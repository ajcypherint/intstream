# for each file classified
# 1. upload each file
# 2. tfidf vectorize - clean html, clean hashes
# 3. logistic regression; grid search
# 4. save model to s3
# 5. delete s3 bucket
# encoding: utf-8
"""
Created on April 6, 2016
@author: thom.hopmans
"""
from rest_framework.renderers import JSONRenderer
from api import models
from api import serializers
import logging
import asyncio
import aioboto3
import os
from datetime import datetime
import time
import tarfile
import boto3
import botocore
from django.conf import settings
import tempfile
import asyncio_pool
LOG = logging.getLogger(__name__)

def handle_exception(loop, exception):
    pass


class Locked(Exception):
    pass


class TrainResult(object):
    SUCCESS = "SUCCESS"
    UPLOAD_FAILED="UPLOAD FAILED"
    TRAIN_FAILED = "TRAIN FAILED"
    LOCKED = "LOCKED"
    S3_NOT_EXIST = "S3_NOT_EXIST"

    def __init__(self, status, clf, message, job_name, emr_version):
        self.status = status
        self.clf = clf # unused
        self.message = message #unused
        self.job_name = job_name
        self.emr_version = emr_version


class Terminate(Exception):
    pass


class DeployPySparkScriptOnAws(object):
    """
    Programmatically deploy a local PySpark script on an AWS cluster
    """

    def __init__(self,
                 model,
                 s3_bucket_logs,
                 s3_bucket_temp_files,
                 region,
                 aws_access_key_id,
                 aws_secret_access_key_id,
                 training_script_folder,
                 ec2_key_name,
                 metric,
                 logger,
                 task=None,
                 emr_version="emr-5.28.0", #python3.6 spark
                 extra_kwargs=''
                 ):
        """
        :param model: str
        :param ec2_key_name:  str; Key name to use for cluster
        :param s3_bucket_logs:  str; S3 Bucket to store AWS EMR logs
        :param s3_bucket_temp_files: str; S3 Bucket to store temporary files
        :param s3_region: str; S3 region to specifiy s3Endpoint in s3-dist-cp step
        :param user: str; define user name
        :param profile_name: str; profile name
        :param training_script: str; script to upload to EWS for training
        :param logger: logger
        """
        self.extra_kwargs=extra_kwargs
        self.logger = logger
        self.metric=metric
        self.METRIC_FILE="metrics.file"
        self.TRAIN_CLASSIFY = "train_classify.py"
        self.DATA_DIR = "data"
        self.OUTPUT_DIR = "output"
        self.MODEL_NAME = settings.MODEL_FOLDER
        self.TRAIN_SCRIPT = "base_train_file.py"
        self.EMR_VERSION = emr_version
        self.AWS_DIR = os.path.join(settings.BASE_DIR,"awsfiles/")
        self.AWS_TRAIN_DIR = os.path.join(settings.BASE_DIR,"aws_training_files/")
        self.job_flow_id = None # Returned by AWS in start_spark_cluster()
        self.app_name = model
        self.job_name = self.generate_job_name(model)    # Filled by generate_job_name()
        self.task_id = task
        self.UPLOAD_DIR = self.job_name + "/" + self.DATA_DIR + "/"
        self.OUTPUT_FILE = self.job_name + "/" + self.OUTPUT_DIR + "/" + self.MODEL_NAME
        self.training_script_folder = "uuid-original-default" \
            if training_script_folder is None else training_script_folder
        self.ec2_key_name = ec2_key_name
        self.s3_bucket_logs = s3_bucket_logs
        self.s3_bucket_temp_files = s3_bucket_temp_files
        self.region = region
        self.aws_access_key_id = aws_access_key_id
        self.aws_secret_access_key = aws_secret_access_key_id
        self.script_tar = tempfile.NamedTemporaryFile(suffix='.tar.gz', )
        self.session = aioboto3.Session(aws_access_key_id=self.aws_access_key_id,
                                    aws_secret_access_key=self.aws_secret_access_key)        # Select AWS IAM profile
        self.sync_session = boto3.Session(aws_access_key_id=self.aws_access_key_id,
                                    aws_secret_access_key=self.aws_secret_access_key)        # Select AWS IAM profileboto
        self.s3 = self.session.resource('s3')                         # Open S3 connection
        self.sync_s3 = self.sync_session.resource("s3")

    def lock(self):
        #todo(aj)
        pass

    def unlock(self):
        #todo(aj)
        pass

    async def _upload_articles(self):
        pass

    def chunks(self, lst, n):
        """Yield successive n-sized chunks from lst."""
        for i in range(0, len(lst), n):
            yield lst[i:i + n]

    def upload_classifications(self):
        """
        :return: bool - True success
        """
        targets = models.Classification.objects.filter(mlmodel=self.app_name)
        serial = serializers.ClassificationSerializer(targets, many=True)
        json_serial = JSONRenderer().render(serial.data)
        res = self.sync_s3.Object(self.s3_bucket_temp_files, self.job_name + "/targets.json")\
                .put(Body=json_serial, ContentType='text/plain')
        return res["ResponseMetadata"]["HTTPStatusCode"] == 200

    def upload(self):
        """
        returns True if successful else false
        :return:  bool -
        """
        loop = asyncio.get_event_loop()
        self.temp_bucket_exists(self.sync_s3)# Check if S3 bucket to store temporary files in exists
        self.tar_python_script()                            # Tar the Python Spark script
        #todo(aj) filter by classification
        files = models.Article.objects.filter(source__mlmodel=self.app_name,
                                              classification__target__isnull=False,
                                              )
        if len(files) == 0:
            return False
        for chunk in self.chunks(files,20):
            pool = asyncio_pool.AioPool(4)
            loop.run_until_complete(pool.map(self.upload_article, chunk))
        res = loop.run_until_complete(self.upload_temp_files(self.s3)) # Move the Spark files to a S3 bucket for temporary files
        return res

    def locked(self):
        return False

    def run(self, delete=True, status_callback=None):
        """
        :param delete: bool - clean s3 bucket after run
        :param status_callback: function(job_name:str,status:str)
        :return: TrainResult
        """
        if not self.temp_bucket_exists(self.sync_s3):
            return TrainResult(TrainResult.S3_NOT_EXIST, None, "extra stuff", self.job_name, self.EMR_VERSION)

        # todo(aj) check for lock file
        if self.locked():
            return TrainResult(TrainResult.LOCKED, None, "extra stuff", self.job_name, self.EMR_VERSION)
        # write lock file
        self.lock() #todo set running flag in database
        try:
            if self.upload() and self.upload_classifications():
                try:
                    c = self.sync_session.client('emr', region_name=self.region)                           # Open EMR connection
                    self.start_spark_cluster(c)                         # Start Spark EMR cluster
                    self.step_spark_submit(c)                           # Add step 'spark-submit'
                    res = self.describe_status_until_terminated(c, status_callback)            # Describe cluster status until terminated
                    if res:
                        return TrainResult(TrainResult.SUCCESS, b"CLASSIFIER", "extra stuff", self.job_name,self.EMR_VERSION)
                    else:
                        return TrainResult(TrainResult.TRAIN_FAILED, None, "extra stuff", self.job_name, self.EMR_VERSION)
                finally:
                    if delete:
                        self.remove_temp_files(self.sync_s3)                         # Remove files from the temporary files S3 bucket
            else:
                return TrainResult(TrainResult.UPLOAD_FAILED, None, "extra stuff", self.job_name, self.EMR_VERSION)
        finally:
            self.unlock() #todo(aj) unset running flag in database

    def generate_job_name(self, app_name):
        return "intstream-{}.{}".format(app_name,
                                          datetime.now().strftime("%Y%m%d.%H%M%S.%f"))

    async def temp_bucket_exists(self, s3):
        """
        Check if the bucket we are going to use for temporary files exists.
        :param s3:
        :return:
        """
        try:
            await s3.meta.client.head_bucket(Bucket=self.s3_bucket_temp_files)
        except botocore.exceptions.ClientError as e:
            # If a client error is thrown, then check that it was a 404 error.
            # If it was a 404 error, then the bucket does not exist.
            error_code = int(e.response['Error']['Code'])
            if error_code == 404:
                self.logger.error("Bucket for temporary files does not exist")
                return False
            self.logger.error("Error while connecting to Bucket")
            return False
        self.logger.info("S3 bucket for temporary files exists")
        return True

    def tar_python_script(self):
        """
        :return:
        """
        # Create tar.gz file
        REQ = "requirements.txt"
        t_file = tarfile.open(self.script_tar.name, 'w:gz')
        # Add Spark script path to tar.gz file
        t_file.add(os.path.join(self.AWS_TRAIN_DIR,
                                self.TRAIN_SCRIPT), arcname=self.TRAIN_SCRIPT)
        t_file.add(os.path.join(self.AWS_TRAIN_DIR, self.training_script_folder, self.TRAIN_CLASSIFY),
                   arcname=self.TRAIN_CLASSIFY)
        t_file.add(os.path.join(self.AWS_TRAIN_DIR, self.training_script_folder, REQ),
                   arcname=REQ)

        # List all files in tar.gz
        for f in t_file.getnames():
            self.logger.info("Added %s to tar-file" % f)
        t_file.close()

    async def upload_article(self, article):
        await self.s3.Object(self.s3_bucket_temp_files, self.UPLOAD_DIR+str(article.id))\
                .put(Body=article.text, ContentType='text/plain')

    async def upload_temp_files(self, s3):
        """
        Move the PySpark script files to the S3 bucket we use to store temporary files
        :param s3:
        :return:
        """
        res = await s3.Object(self.s3_bucket_temp_files, self.job_name + '/setup.sh')\
          .put(Body=open(os.path.join(self.AWS_DIR,'setup.sh'), 'rb'), ContentType='text/x-sh')
        # Shell file: Terminate idle cluster
        res2 = await s3.Object(self.s3_bucket_temp_files, self.job_name + '/terminate_idle_cluster.sh')\
          .put(Body=open(os.path.join(self.AWS_DIR,'terminate_idle_cluster.sh'), 'rb'), ContentType='text/x-sh')
        # Compressed Python script files (tar.gz)
        res3 = await s3.Object(self.s3_bucket_temp_files, self.job_name + '/script.tar.gz')\
          .put(Body=open(os.path.join(self.script_tar.name), 'rb'), ContentType='application/x-tar')
        self.logger.info("Uploaded files to key '{}' in bucket '{}'".format(self.job_name, self.s3_bucket_temp_files))
        stat = res["ResponseMetadata"]["HTTPStatusCode"]
        stat2 = res2["ResponseMetadata"]["HTTPStatusCode"]
        stat3 = res3["ResponseMetadata"]["HTTPStatusCode"]
        if stat == 200 and stat2 == 200 and stat3 == 200:
            return True
        else:
            return False

    def remove_temp_files(self, s3):
        """
        Remove Spark files from temporary bucket
        :param s3:
        :return:
        """
        bucket = s3.Bucket(self.s3_bucket_temp_files)
        bucket.objects.filter(Prefix=self.job_name).delete()

    def start_spark_cluster(self, c):
        """

        :param c: EMR client
        :return:
        """
        response = c.run_job_flow(
            Name=self.job_name,
            LogUri="s3://{}/{}/".format(self.s3_bucket_logs,self.job_name),
            ReleaseLabel=self.EMR_VERSION,
            Instances={
                'InstanceGroups': [
                    {
                        'Name': 'EmrMaster',
                        'Market': 'SPOT',
                        'InstanceRole': 'MASTER',
                        'InstanceType': 'm3.xlarge',
                        'InstanceCount': 1,
                        'Configurations':[{
                                            "Classification": "spark-env",
                                            "Configurations": [
                                                {
                                                    "Classification": "export",
                                                    "Properties": {
                                                        "PYSPARK_PYTHON": "/usr/bin/python3"
                                                    }
                                                }
                                                ]
                                           },
                            {"Classification":"spark-defaults",
                              "Properties":{
                                     }
                            }

                        ]
                    },
                    {
                        'Name': 'EmrCore',
                        'Market': 'SPOT',
                        'InstanceRole': 'CORE',
                        'InstanceType': 'm3.xlarge',
                        'InstanceCount': 2,
                        'Configurations':[
                            {
                                "Classification": "spark-env",
                                "Configurations": [
                                    {
                                        "Classification": "export",
                                        "Properties": {
                                            "PYSPARK_PYTHON": "/usr/bin/python3"
                                        }
                                    }
                                ]
                            },
                            {"Classification":"spark-defaults",
                              "Properties":{
                                     }
                            }

                        ]
                    },
                ],
                'Ec2KeyName': self.ec2_key_name,
                'KeepJobFlowAliveWhenNoSteps': False
            },
            Applications=[{'Name': 'Hadoop'}, {'Name': 'Spark'}],
            JobFlowRole='EMR_EC2_DefaultRole',
            ServiceRole='EMR_DefaultRole',
            VisibleToAllUsers=True,
            BootstrapActions=[
                {
                    'Name': 'setup',
                    'ScriptBootstrapAction': {
                        'Path': 's3n://{}/{}/setup.sh'.format(self.s3_bucket_temp_files, self.job_name),
                        'Args': [
                            's3://{}/{}'.format(self.s3_bucket_temp_files, self.job_name),
                        ]
                    }
                },
                {
                    'Name': 'idle timeout',
                    'ScriptBootstrapAction': {
                        'Path':'s3n://{}/{}/terminate_idle_cluster.sh'.format(self.s3_bucket_temp_files, self.job_name),
                    }
                },
            ],
        )
        # Process response to determine if Spark cluster was started, and if so, the JobFlowId of the cluster
        response_code = response['ResponseMetadata']['HTTPStatusCode']
        if response['ResponseMetadata']['HTTPStatusCode'] == 200:
            self.job_flow_id = response['JobFlowId']
        else:
            raise Terminate("Could not create EMR cluster (status code {})".format(response_code))

        self.logger.info("Created Spark EMR-4.4.0 cluster with JobFlowId {}".format(self.job_flow_id))

    def make_tarfile(self, output_filename, source_dir):
        with tarfile.open(output_filename, "w:gz") as tar:
            tar.add(source_dir, arcname=os.path.basename(source_dir))

    def download_metric(self, local_filename):
        self.sync_s3.Bucket(self.s3_bucket_temp_files).\
            download_file(os.path.join(self.job_name,self.METRIC_FILE), local_filename)

    def download_dir(self, prefix, local, bucket, ):
        """
        params:
        - prefix: pattern to match in s3
        - local: local path to folder in which to place files
        - bucket: s3 bucket with target contents
        - client: initialized s3 client object
        """
        s3 = boto3.client("s3",aws_access_key_id=self.aws_access_key_id,
                                        aws_secret_access_key=self.aws_secret_access_key)
        keys = []
        dirs = []
        next_token = ''
        base_kwargs = {
            'Bucket': bucket,
            'Prefix': prefix,
        }
        while next_token is not None:
            kwargs = base_kwargs.copy()
            if next_token != '':
                kwargs.update({'ContinuationToken': next_token})
            results = s3.list_objects_v2(**kwargs)
            contents = results.get('Contents')
            if contents is not None:
                for i in contents:
                    k = i.get('Key')
                    if k[-1] != '/':
                        keys.append(k)
                    else:
                        dirs.append(k)
            next_token = results.get('NextContinuationToken')
        for d in dirs:
            dest_pathname = os.path.join(local, d)
            if not os.path.exists(os.path.dirname(dest_pathname)):
                os.makedirs(os.path.dirname(dest_pathname))
        for k in keys:
            dest_pathname = os.path.join(local, k)
            if not os.path.exists(os.path.dirname(dest_pathname)):
                os.makedirs(os.path.dirname(dest_pathname))
            s3.download_file(bucket, k, dest_pathname)

    def describe_status_until_terminated(self, c, callback=None):
        """
        #todo(aj) add callback that will send back a me
        :param c:
        :param callback: function(job_name:str, org:int, status:str)
        :return: boolean - True if success else False
        """
        while True:
            description = c.describe_cluster(ClusterId=self.job_flow_id)
            state = description['Cluster']['Status']['State']
            if state == 'TERMINATED' or state == 'TERMINATED_WITH_ERRORS':
                self.logger.info(state)
                if state == "TERMINATED":
                    return True
                else:
                    return False
            #todo(aj) write state to database and link to  database ad link to task id
            self.logger.info(state)
            if callback is not None:
                callback(self.job_name, state)
            time.sleep(30)  # Prevent ThrottlingException by limiting number of requests

    def step_spark_submit(self, c):
        """

        :param c:
        :return:
        """
        response = c.add_job_flow_steps(
            JobFlowId=self.job_flow_id,
            Steps=[
                {
                    'Name': 'Setup Hadoop Debugging',
                    'ActionOnFailure': 'TERMINATE_CLUSTER',
                    'HadoopJarStep': {
                        'Jar': 'command-runner.jar',
                        'Args': ['state-pusher-script']
                    }
                },
                {
                    'Name': 'Spark Application',
                    'ActionOnFailure': 'CONTINUE',
                    'HadoopJarStep': {
                        'Jar': 'command-runner.jar',
                        'Args': [
                            "spark-submit",
                            "/home/hadoop/"+self.TRAIN_SCRIPT,
                            self.s3_bucket_temp_files, # bucket
                            self.job_name, # subfolder
                            self.MODEL_NAME, # model file
                            self.METRIC_FILE, # metric file
                            self.metric, # metric
                            self.extra_kwargs, #extra json kwargs
                        ]
                    }
                },
            ]
        )
        self.logger.info("Added step 'spark-submit' ")
        time.sleep(1)  # Prevent ThrottlingException

    def step_copy_data_between_s3_and_hdfs(self, c, src, dest):
        """
        Copy data between S3 and HDFS (not used for now)
        :param c:
        :return:
        """
        response = c.add_job_flow_steps(
            JobFlowId=self.job_flow_id,
            Steps=[{
                    'Name': 'Copy data from S3 to HDFS',
                    'ActionOnFailure': 'CANCEL_AND_WAIT',
                    'HadoopJarStep': {
                        'Jar': 'command-runner.jar',
                        'Args': [
                            "s3-dist-cp",
                            "--s3Endpoint=s3-eu-west-1.amazonaws.com",
                            "--src={}".format(src),
                            "--dest={}".format(dest)
                        ]
                    }
                }]
        )
        self.logger.info("Added step 'Copy data from {} to {}'".format(src, dest))


