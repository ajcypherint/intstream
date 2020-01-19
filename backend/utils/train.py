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
logger = logging.getLogger(__name__)

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
                 tmp_dir = "/tmp"
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
        self.AWS_DIR = os.path.join(settings.BASE_DIR,"awsfiles/")
        self.AWS_TRAIN_DIR = os.path.join(settings.BASE_DIR,"aws_training_files/")
        self.job_flow_id = None # Returned by AWS in start_spark_cluster()
        self.job_name = None    # Filled by generate_job_name()

        self.app_name = model
        training_script = "base_train_file.py" if training_script is None else training_script
        self.script = training_script

        self.ec2_key_name = model
        self.s3_bucket_logs = s3_bucket_logs
        self.s3_bucket_temp_files = s3_bucket_temp_files
        self.s3_region = s3_region
        self.aws_access_key_id = aws_access_key_id
        self.aws_secret_access_key = aws_secret_access_key_id
        self.tmp_dir=tmp_dir
        self.script_tar = tempfile.NamedTemporaryFile(suffix='.tar.gz',
                                                      dir=self.tmp_dir)



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

    def _upload_articles(self):
        pass

    def run(self):
        # todo(aj) check for lock file
        # write lock file
        self.lock()
        try:
            loop = asyncio.get_event_loop()
            session = aioboto3.Session(aws_access_key_id=self.aws_access_key_id,
                                    aws_secret_access_key=self.aws_secret_access_key)        # Select AWS IAM profile
            s3 = session.resource('s3')                         # Open S3 connection
            loop.run_until_complete(self._upload_articles())
            self.generate_job_name()                            # Generate job name
            self.temp_bucket_exists(s3)                         # Check if S3 bucket to store temporary files in exists
            self.tar_python_script()                            # Tar the Python Spark script
            self.upload_temp_files(s3)                          # Move the Spark files to a S3 bucket for temporary files
            c = session.client('emr')                           # Open EMR connection
            self.start_spark_cluster(c)                         # Start Spark EMR cluster
            self.step_spark_submit(c)                           # Add step 'spark-submit'
            self.describe_status_until_terminated(c)            # Describe cluster status until terminated
            self.remove_temp_files(s3)                          # Remove files from the temporary files S3 bucket
            # todo(aj) remove lock file
        finally:
            self.unlock()

    def generate_job_name(self):
        self.job_name = "intstream-{}.{}".format(self.app_name,
                                          datetime.now().strftime("%Y%m%d.%H%M%S.%f"))

    def temp_bucket_exists(self, s3):
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
                terminate("Bucket for temporary files does not exist")
            terminate("Error while connecting to Bucket")
        logger.info("S3 bucket for temporary files exists")

    def tar_python_script(self):
        """
        :return:
        """
        # Create tar.gz file
        t_file = tarfile.open(self.script_tar.name, 'w:gz')
        # Add Spark script path to tar.gz file
        t_file.add(os.path.join(self.AWS_TRAIN_DIR, self.script), arcname=self.script)
        # List all files in tar.gz
        for f in t_file.getnames():
            logger.info("Added %s to tar-file" % f)
        t_file.close()

    async def upload_temp_files(self, s3):
        """
        Move the PySpark script files to the S3 bucket we use to store temporary files
        :param s3:
        :return:
        """
        files = models.MLModel.objects.filter(id=self.app_name).all()
        for f in files:
            await s3.Object(self.s3_bucket_temp_files, self.job_name +"/data/"+f)\
                .put(Body=open(os.path.join(settings.MEDIA_ROOT,f), 'rb'), ContentType='text/plain')
        await s3.Object(self.s3_bucket_temp_files, self.job_name + '/setup.sh')\
          .put(Body=open(os.path.join(self.AWS_DIR,'setup.sh'), 'rb'), ContentType='text/x-sh')
        # Shell file: Terminate idle cluster
        await s3.Object(self.s3_bucket_temp_files, self.job_name + '/terminate_idle_cluster.sh')\
          .put(Body=open(os.path.join(self.AWS_DIR,'terminate_idle_cluster.sh'), 'rb'), ContentType='text/x-sh')
        # Compressed Python script files (tar.gz)
        await s3.Object(self.s3_bucket_temp_files, self.job_name + '/script.tar.gz')\
          .put(Body=open(os.path.join(self.tmp_dir,'script.tar.gz'), 'rb'), ContentType='application/x-tar')
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
                            "/home/hadoop/wordcount.py",
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


