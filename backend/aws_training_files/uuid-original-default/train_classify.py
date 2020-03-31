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
from pyspark.ml.feature import VectorAssembler, NGram
from pyspark.ml.evaluation import BinaryClassificationEvaluator, MulticlassClassificationEvaluator
from pyspark.ml.feature import Tokenizer, StopWordsRemover, CountVectorizer, IDF, StringIndexer
from pyspark.ml.tuning import ParamGridBuilder
from pyspark.sql.types import ArrayType, StructField, StructType, StringType, IntegerType
import Stemmer

from pyspark.ml.classification import LogisticRegression
import re
import boto3
from os import path
import itertools
import numpy as np

from pyspark import since, keyword_only
from pyspark.ml import Estimator, Model
from pyspark.ml.common import _py2java
from pyspark.ml.param import Params, Param, TypeConverters
from pyspark.ml.param.shared import HasSeed
from pyspark.ml.tuning import CrossValidator, CrossValidatorModel
from pyspark.ml.util import *
from pyspark.ml.wrapper import JavaParams
from pyspark.sql.functions import rand
from functools import reduce


class StratifiedCrossValidator(CrossValidator):
  def stratify_data(self, dataset):
    """
    Returns an array of dataframes with the same ratio of passes and failures.
    Currently only supports binary classification problems.
    """

    epm = self.getOrDefault(self.estimatorParamMaps)
    numModels = len(epm)
    nFolds = self.getOrDefault(self.numFolds)
    split_ratio = 1.0 / nFolds

    passes = dataset[dataset['target_int'] == 1]
    fails = dataset[dataset['target_int'] == 0]

    pass_splits = passes.randomSplit([split_ratio for i in range(nFolds)])
    fail_splits = fails.randomSplit([split_ratio for i in range(nFolds)])

    stratified_data = [pass_splits[i].unionAll(fail_splits[i]) for i in range(nFolds)]

    return stratified_data

  def _fit(self, dataset):
    est = self.getOrDefault(self.estimator)
    epm = self.getOrDefault(self.estimatorParamMaps)
    numModels = len(epm)
    eva = self.getOrDefault(self.evaluator)
    nFolds = self.getOrDefault(self.numFolds)
    seed = self.getOrDefault(self.seed)
    metrics = [0.0] * numModels

    stratified_data = self.stratify_data(dataset)

    for i in range(nFolds):
      train_arr = [x for j,x in enumerate(stratified_data) if j != i]
      train = reduce((lambda x, y: x.unionAll(y)), train_arr)
      validation = stratified_data[i]

      models = est.fit(train, epm)

      for j in range(numModels):
        model = models[j]
        metric = eva.evaluate(model.transform(validation, epm[j]))
        metrics[j] += metric/nFolds

    if eva.isLargerBetter():
      bestIndex = np.argmax(metrics)
    else:
      bestIndex = np.argmin(metrics)

    bestModel = est.fit(dataset, epm[bestIndex])
    return self._copyValues(CrossValidatorModel(bestModel, metrics))

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

        def clean_md5(raw):
            text = re.sub(r'\b[a-fA-F0-9]{32}\b', '', raw)
            return text

        def clean_sha256(raw):
            text = re.sub(r'\b[a-fA-F0-9]{64}\b', '', raw)
            return text

        def clean_sha1(raw):
            text = re.sub(r'\b[a-fA-F0-9]{40}\b', '', raw)
            return text

        def stemmer(raw):
            stem = Stemmer.Stemmer('english')
            return " ".join(stem.stemWords(raw.split()))

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
            text = clean_sha1(text)
            text = clean_sha256(text)
            text = clean_md5(text)
            text = stemmer(text)
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
    ngram = NGram(inputCol="token_text", outputCol="ngram") #ngram
    stopremove = StopWordsRemover(inputCol='ngram', outputCol='stop_tokens')
    count_vec = CountVectorizer(inputCol='stop_tokens', outputCol='c_vec')  # TF
    idf = IDF(inputCol="c_vec", outputCol="tf_idf")  # IDF Scaler
    clean_up = VectorAssembler(inputCols=['tf_idf'], outputCol='features')
    lr = LogisticRegression(maxIter=20, featuresCol='features', labelCol='target_int')
    pipeline = Pipeline(stages=[cleanhtml, tokenizer, ngram, stopremove, count_vec,  idf, clean_up, lr])
    paramGrid = ParamGridBuilder() \
        .addGrid(lr.regParam, [0.1, .01, 0.001]) \
        .addGrid(ngram.n, [1, 2, 3]) \
        .build()
    crossval = StratifiedCrossValidator(estimator=pipeline,
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



