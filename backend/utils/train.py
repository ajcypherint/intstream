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
from api import models
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
logger = logging.getLogger(__name__)

def handle_exception(loop, exception):
    pass

def terminate(error_message=None):
    """
    Method to exit the Python script. It will log the given message and then exit().
    :param error_message:
    """
    if error_message:
        logger.error(error_message)
    logger.critical('The script is now terminating')
    exit()

class classifications(object):
    def __init__(self, category, article_ids):
        """

        :param category: str
        :param article_ids: list[int]
        """
        self.category = category
        self.article_ids = article_ids

class DeployPySparkScriptOnAws(object):
    """
    Programmatically deploy a local PySpark script on an AWS cluster
    """

    def __init__(self,
                 model,
                 s3_bucket_logs,
                 s3_bucket_temp_files,
                 s3_region,
                 aws_access_key_id,
                 aws_secret_access_key_id,
                 training_script=None,
                 task = None
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
        """
        self.DATA_DIR = "data"
        self.OUTPUT_DIR = "output"
        self.MODEL_NAME = "output.clf"
        self.TRAIN_SCRIPT = "train.py"
        self.AWS_DIR = os.path.join(settings.BASE_DIR,"awsfiles/")
        self.AWS_TRAIN_DIR = os.path.join(settings.BASE_DIR,"aws_training_files/")
        self.job_flow_id = None # Returned by AWS in start_spark_cluster()
        self.app_name = model
        self.job_name = self.generate_job_name(model)    # Filled by generate_job_name()
        self.task_id = task
        self.UPLOAD_DIR = self.job_name + "/" + self.DATA_DIR + "/"
        self.OUTPUT_FILE = self.job_name + "/" + self.OUTPUT_DIR + "/" + self.MODEL_NAME

        training_script = "base_train_file.py" if training_script is None else training_script
        self.script = tempfile.NamedTemporaryFile()
        self._write_script(training_script, s3_bucket_temp_files, self.UPLOAD_DIR, self.OUTPUT_FILE)


        self.ec2_key_name = model
        self.s3_bucket_logs = s3_bucket_logs
        self.s3_bucket_temp_files = s3_bucket_temp_files
        self.s3_region = s3_region
        self.aws_access_key_id = aws_access_key_id
        self.aws_secret_access_key = aws_secret_access_key_id
        self.script_tar = tempfile.NamedTemporaryFile(suffix='.tar.gz', )
        self.session = aioboto3.Session(aws_access_key_id=self.aws_access_key_id,
                                    aws_secret_access_key=self.aws_secret_access_key)        # Select AWS IAM profile
        self.s3 = self.session.resource('s3')                         # Open S3 connection

    def _write_script(self,script, input_bucket, upload_dir, output_model_file):
        input_bucket = "s3:///"+input_bucket+"/"+upload_dir
        output_model_file = "s3:///"+self.OUTPUT_DIR+"/"+output_model_file
        with open(os.path.join(settings.BASE_DIR,self.AWS_TRAIN_DIR,script),"rb") as f:
            text = f.read().decode("utf-8",errors="ignore").replace("#define_input_bucket#", input_bucket)
            text = text.replace("#define_output_bucket#",output_model_file)
            with open(self.script.name, "w") as f:
                f.write(text)




    def _read_script(self,script):
        """
        read base_train_file - find and replace input s3, and output s3;
        write a new file to tmp_dir
        :param app_name:
        :return:
        """
        with open(os.path.join(settings.BASE_DIR,self.AWS_TRAIN_DIR,script)) as file:
            script = file.read()
            return script

    def lock(self):
        pass

    def unlock(self):
        pass

    async def _upload_articles(self):
        pass

    def chunks(self, lst, n):
        """Yield successive n-sized chunks from lst."""
        for i in range(0, len(lst), n):
            yield lst[i:i + n]

    def run(self):
        # todo(aj) check for lock file
        # write lock file
        self.lock()
        try:
            loop = asyncio.get_event_loop()

            res = loop.run_until_complete(self.temp_bucket_exists(self.s3))# Check if S3 bucket to store temporary files in exists
            if res:
                self.tar_python_script()                            # Tar the Python Spark script
                files = models.Article.objects.filter(source__mlmodel=self.app_name)
                for chunk in self.chunks(files,20):
                    pool = asyncio_pool.AioPool(4)
                    loop.run_until_complete(pool.map(self.upload_article, chunk))
                loop.run_until_complete(self.upload_temp_files(self.s3)) # Move the Spark files to a S3 bucket for temporary files
                #c = self.session.client('emr')                           # Open EMR connection
                #self.start_spark_cluster(c)                         # Start Spark EMR cluster
                #self.step_spark_submit(c)                           # Add step 'sggpark-submit'
                #self.describe_status_until_terminated(c)            # Describe cluster status until terminated
                #self.remove_temp_files(self.s3)                          # Remove files from the temporary files S3 bucket
        finally:
            self.unlock()

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
            s3.meta.client.head_bucket(Bucket=self.s3_bucket_temp_files)
        except botocore.exceptions.ClientError as e:
            # If a client error is thrown, then check that it was a 404 error.
            # If it was a 404 error, then the bucket does not exist.
            error_code = int(e.response['Error']['Code'])
            if error_code == 404:
                logger.error("Bucket for temporary files does not exist")
                return False
            logger.error("Error while connecting to Bucket")
            return False
        logger.info("S3 bucket for temporary files exists")
        return True

    def tar_python_script(self):
        """
        :return:
        """
        # Create tar.gz file
        t_file = tarfile.open(self.script_tar.name, 'w:gz')
        # Add Spark script path to tar.gz file
        t_file.add(os.path.join(self.AWS_TRAIN_DIR, self.script.name), arcname=self.TRAIN_SCRIPT)
        # List all files in tar.gz
        for f in t_file.getnames():
            logger.info("Added %s to tar-file" % f)
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
        await s3.Object(self.s3_bucket_temp_files, self.job_name + '/setup.sh')\
          .put(Body=open(os.path.join(self.AWS_DIR,'setup.sh'), 'rb'), ContentType='text/x-sh')
        # Shell file: Terminate idle cluster
        await s3.Object(self.s3_bucket_temp_files, self.job_name + '/terminate_idle_cluster.sh')\
          .put(Body=open(os.path.join(self.AWS_DIR,'terminate_idle_cluster.sh'), 'rb'), ContentType='text/x-sh')
        # Compressed Python script files (tar.gz)
        await s3.Object(self.s3_bucket_temp_files, self.job_name + '/script.tar.gz')\
          .put(Body=open(os.path.join(self.script_tar.name), 'rb'), ContentType='application/x-tar')
        logger.info("Uploaded files to key '{}' in bucket '{}'".format(self.job_name, self.s3_bucket_temp_files))
        return True

    def remove_temp_files(self, s3):
        """
        Remove Spark files from temporary bucket
        :param s3:
        :return:
        """
        bucket = s3.Bucket(self.s3_bucket_temp_files)
        for key in bucket.objects.all():
            if key.key.startswith(self.job_name) is True:
                key.delete()
                logger.info("Removed '{}' from bucket for temporary files".format(key.key))

    def start_spark_cluster(self, c):
        """

        :param c: EMR client
        :return:
        """
        response = c.run_job_flow(
            Name=self.job_name,
            LogUri="s3://{}/{}/".format(self.s3_bucket_logs,self.job_name),
            ReleaseLabel="emr-4.4.0",
            Instances={
                'InstanceGroups': [
                    {
                        'Name': 'EmrMaster',
                        'Market': 'SPOT',
                        'InstanceRole': 'MASTER',
                        'BidPrice': '0.05',
                        'InstanceType': 'm3.xlarge',
                        'InstanceCount': 1,
                    },
                    {
                        'Name': 'EmrCore',
                        'Market': 'SPOT',
                        'InstanceRole': 'CORE',
                        'BidPrice': '0.05',
                        'InstanceType': 'm3.xlarge',
                        'InstanceCount': 2,
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
                        'Args': ['3600', '300']
                    }
                },
            ],
        )
        # Process response to determine if Spark cluster was started, and if so, the JobFlowId of the cluster
        response_code = response['ResponseMetadata']['HTTPStatusCode']
        if response['ResponseMetadata']['HTTPStatusCode'] == 200:
            self.job_flow_id = response['JobFlowId']
        else:
            terminate("Could not create EMR cluster (status code {})".format(response_code))

        logger.info("Created Spark EMR-4.4.0 cluster with JobFlowId {}".format(self.job_flow_id))

    def describe_status_until_terminated(self, c):
        """
        :param c:
        :return:
        """
        stop = False
        while stop is False:
            description = c.describe_cluster(ClusterId=self.job_flow_id)
            state = description['Cluster']['Status']['State']
            if state == 'TERMINATED' or state == 'TERMINATED_WITH_ERRORS':
                stop = True
            #todo(aj) write state to database and link to  database ad link to task id
            logger.info(state)
            time.sleep(30)  # Prevent ThrottlingException by limiting number of requests

    def step_spark_submit(self, c, arguments):
        """

        :param c:
        :return:
        """
        response = c.add_job_flow_steps(
            JobFlowId=self.job_flow_id,
            Steps=[
                {
                    'Name': 'Spark Application',
                    'ActionOnFailure': 'CONTINUE',
                    'HadoopJarStep': {
                        'Jar': 'command-runner.jar',
                        'Args': [
                            "spark-submit",
                            "/home/hadoop/"+self.TRAIN_SCRIPT,
                            arguments
                        ]
                    }
                },
            ]
        )
        logger.info("Added step 'spark-submit' with argument '{}'".format(arguments))
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
        logger.info("Added step 'Copy data from {} to {}'".format(src, dest))


