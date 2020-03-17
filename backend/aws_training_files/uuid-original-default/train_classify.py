from __future__ import unicode_literals
from __future__ import print_function
from pyspark.sql import SparkSession
from pyspark.sql.functions import substring_index, col
from pyspark.sql.types import IntegerType
from pyspark import keyword_only  ## < 2.0 -> pyspark.ml.util.keyword_only
from pyspark.ml import Transformer
from pyspark.ml.param.shared import HasInputCol, HasOutputCol, Param, Params, TypeConverters
# Available in PySpark >= 2.3.0
from pyspark.ml.util import DefaultParamsReadable, DefaultParamsWritable
from pyspark.sql.functions import udf
from selectolax.parser import HTMLParser
from pyspark.ml import Pipeline,PipelineModel
from pyspark.ml.feature import VectorAssembler
from pyspark.ml.evaluation import BinaryClassificationEvaluator, MulticlassClassificationEvaluator
from pyspark.ml.feature import Tokenizer, StopWordsRemover, CountVectorizer, IDF, StringIndexer
from pyspark.ml.tuning import CrossValidator, ParamGridBuilder
from pyspark.sql.types import ArrayType, StructField, StructType, StringType, IntegerType


from pyspark.ml.classification import LogisticRegression
import re
import boto3
from os import path


class CleanHtml(
    Transformer, HasInputCol, HasOutputCol,
    # Credits https://stackoverflow.com/a/52467470
    # by https://stackoverflow.com/users/234944/benjamin-manns
    DefaultParamsReadable, DefaultParamsWritable):

    # https://stackoverflow.com/questions/32331848/create-a-custom-transformer-in-pyspark-ml
    # https://www.google.com/search?q=spark+udf+transformer&oq=spark+udf+transformer&aqs=chrome..69i57.4514j1j7&sourceid=chrome&ie=UTF-8
    # stopwords = Param(Params._dummy(), "stopwords", "stopwords",
    #                 typeConverter=TypeConverters.toListString)

    @keyword_only
    def __init__(self, inputCol=None, outputCol=None):
        super(CleanHtml, self).__init__()
        kwargs = self._input_kwargs
        self.setParams(**kwargs)

    @keyword_only
    def setParams(self, inputCol=None, outputCol=None):
        kwargs = self._input_kwargs
        return self._set(**kwargs)

    # Required in Spark >= 3.0
    def setInputCol(self, value):
        """
        Sets the value of :py:attr:`inputCol`.
        """
        return self._set(inputCol=value)

    # Required in Spark >= 3.0
    def setOutputCol(self, value):
        """
        Sets the value of :py:attr:`outputCol`.
        """
        return self._set(outputCol=value)

    def _transform(self, dataset):
        def clean_hashes(raw):
            """
            remove unneeded hashes (words with number and letter)
            :param raw:
            :return:
            """
            clean_nonwords = re.compile(r'\S*[^a-zA-Z\s\-\"\']\S*')
            cleantext = re.sub(clean_nonwords, '', raw)
            return cleantext

        def f(raw):
            """
            remove html headers and tags
            :param raw:
            :return:
            """

            tree = HTMLParser(raw)

            if tree.body is None:
                return raw

            for tag in tree.css('script'):
                tag.decompose()
            for tag in tree.css('style'):
                tag.decompose()

            text = tree.body.text(separator='\n')
            text = re.sub(r'\n\s*', "\n", text)
            text = clean_hashes(text)
            return text.strip().strip("\n")

        t = StringType()
        out_col = self.getOutputCol()
        in_col = dataset[self.getInputCol()]
        return dataset.withColumn(out_col, udf(f, t)(in_col))


class MissingArgs(Exception):
    pass


def classify(text, classifier):
    spark = SparkSession.builder.appName('Classify').getOrCreate()
    schema = StructType([
        StructField('text', StringType(), True),
    ])
    rdd = spark.sparkContext.parallelize(text)
    df = spark.createDataFrame(rdd,schema)
    classifier = PipelineModel.load(classifier)
    targets = classifier.transform(df)
    targets_list = [row.prediction for row in targets.collect()]
    return targets_list

def train(input_bucket,
          job_name,
          output_model_file_key,
          output_metric_file_key,
          metric):
    """
    :param input_bucket: str
    :param output_file: str
    :param output_metric_file: str
    :param metric: str
    :return:
    """
    spark = SparkSession.builder.appName('train').getOrCreate()

    # merge text and targets
    rdd = spark.sparkContext.wholeTextFiles(path.join("s3://", input_bucket, job_name, "data/"))
    dfWithSchema = spark.createDataFrame(rdd).toDF("file", "text")
    targets = spark.read.json(path.join("s3://", input_bucket, job_name, "targets.json"))
    targets = targets.drop("id")
    res = dfWithSchema.select(col("*"), substring_index(col("file"), "/", -1).alias("id"))
    joined = res.join(targets, res.id == targets.article_id, "inner")
    joined.select("target")
    joined = joined.withColumn("target_int", joined["target"].cast(IntegerType()))

    # build pipeline
    cleanhtml = CleanHtml(inputCol="text", outputCol="clean_text")
    tokenizer = Tokenizer(inputCol="clean_text", outputCol="token_text")
    stopremove = StopWordsRemover(inputCol='token_text', outputCol='stop_tokens')
    count_vec = CountVectorizer(inputCol='stop_tokens', outputCol='c_vec')  # TF
    idf = IDF(inputCol="c_vec", outputCol="tf_idf")  # IDF Scaler
    clean_up = VectorAssembler(inputCols=['tf_idf'], outputCol='features')
    lr = LogisticRegression(maxIter=20, featuresCol='features', labelCol='target_int')
    pipeline = Pipeline(stages=[cleanhtml, tokenizer, stopremove, count_vec, idf, clean_up, lr])
    paramGrid = ParamGridBuilder() \
        .addGrid(lr.regParam, [0.1, .01, 0.001]) \
        .build()
    crossval = CrossValidator(estimator=pipeline,
                              estimatorParamMaps=paramGrid,
                              evaluator=MulticlassClassificationEvaluator(labelCol="target_int", metricName=metric),
                              numFolds=2)
    # fit model
    mdl = crossval.fit(joined)
    mymodel = mdl.bestModel

    #required: save metric file
    s3 = boto3.resource("s3")
    score = sorted(mdl.avgMetrics)[-1]  # for writing int (5)
    res3 = s3.Object(input_bucket,path.join(job_name,output_metric_file_key))\
          .put(Body=str(score), ContentType='text/plain')

    #required: save model file;
    mymodel.save(path.join("s3://",input_bucket,path.join(job_name,output_model_file_key)))


