from pyspark.sql import SparkSession

spark = SparkSession.builder.appName('logregdoc').getOrCreate()
from pyspark.ml.classification import LogisticRegression

# vectorize all data
# remove hashes
# remove html
# Load training data
training = spark.read.format("libsvm").load("sample_libsvm_data.txt")

lr = LogisticRegression()