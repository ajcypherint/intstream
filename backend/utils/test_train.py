from django.test import TestCase
from django.test import Client
from unittest import mock
from utils import train
from datetime import datetime
from api import models
import asyncio

class MockResult(object):
    def __init__(self, id):
        self.id = id

def temp_bucket_exists(var):
    return True


async def mock_upload_temp_files(self):
    return True


class Train(TestCase):
    #todo extract classifications
    # models
    # modelversion
    fixtures = ['UserIntstream.json',
                'Organization.json',
                "RSSSource.json",
                "MLModel.json",
                "ModelVersion.json",
                "Article.json",
                "Classification.json",
                "Source.json",
                "UploadSource.json",
                "TrainingScript.json",
                "TrainingScriptVersion.json"
                ]

    def setUp(self):
        username = "ubuntu"
        password = "hinton50"
        self.c = Client()
        headers={"Content-Type":"application/json"}
        self.c.login(username=username,password=password)
        logger = mock.Mock()


        self.trainer = train.DeployPySparkScriptOnAws(
                 2,
                 "S3_logs_folder",
                 "s3_bucket_temp_files",
                 "region",
                 "aws_access_key_id",
                 "aws_secret_access_key_id",
                 "training_script_folder",
                 "ec2_key_name",
                 "metric",
                 logger,
                 task=None,
                 emr_version="emr-5.28.0", #python3.6 spark
                 extra_kwargs=''
                 )


    @mock.patch("boto3.Session")
    @mock.patch("aioboto3.Session")
    def test_upload_classifications(self, aioboto3_session, boto3_session):
        logger = mock.Mock()
        res = {"ResponseMetadata":{"HTTPStatusCode":200}}
        Object = mock.Mock()
        Object.put.return_value = res
        resource = mock.Mock()
        resource.Object.return_value = Object

        session_obj = mock.Mock()
        session_obj.resource.return_value = resource

        boto3_session.return_value = session_obj
        aioboto3_session.return_value = session_obj

        trainer = train.DeployPySparkScriptOnAws(
                 2,
                 "S3_logs_folder",
                 "s3_bucket_temp_files",
                 "region",
                 "aws_access_key_id",
                 "aws_secret_access_key_id",
                 "training_script_folder",
                 "ec2_key_name",
                 "metric",
                 logger,
                 task=None,
                 emr_version="emr-5.28.0", #python3.6 spark
                 extra_kwargs=''
                 )


        self.assertEqual(trainer.upload_classifications(),True)

    def test_chunks(self):
        ls = [1,2,3,4,5,6]
        res = [i for i in self.trainer.chunks(ls,2)]
        self.assertEqual(res,[[1,2],[3,4],[5,6]])

    @mock.patch("utils.train.DeployPySparkScriptOnAws.temp_bucket_exists")
    @mock.patch("utils.train.DeployPySparkScriptOnAws.tar_python_script")
    @mock.patch("utils.train.DeployPySparkScriptOnAws.upload_temp_files")
    @mock.patch("api.models.Article")
    @mock.patch("utils.train.DeployPySparkScriptOnAws.chunks")
    @mock.patch("utils.train.DeployPySparkScriptOnAws.upload_article")
    def test_upload(self,
                    upload_article,
                    chunks,
                    Article,
                    upload_temp_files,
                    tar_python_script,
                    temp_bucket_exists,
                    ):
        future = asyncio.Future()
        future.set_result({"ResponseMetadata": {"HTTPStatusCode": 200}})
        upload_article.return_value = future
        temp_bucket_exists.return_value = True
        tar_python_script.return_value = True
        upload_temp_files.side_effect = mock_upload_temp_files
        chunks.return_value = [[1]]
        objects = mock.Mock()
        objects.filter.return_value = [1,2]

        Article.objects = objects

        res = self.trainer.upload()
        self.assertEqual(res,True)

    @mock.patch("utils.train.DeployPySparkScriptOnAws.temp_bucket_exists")
    def test_run_no_temp_bucket(self, temp_bucket_exists):
        temp_bucket_exists.return_value = False
        res = self.trainer.run()
        self.assertEqual(res.status, train.TrainResult.S3_NOT_EXIST)

    @mock.patch("utils.train.DeployPySparkScriptOnAws.temp_bucket_exists")
    @mock.patch("utils.train.DeployPySparkScriptOnAws.upload")
    @mock.patch("utils.train.DeployPySparkScriptOnAws.upload_classifications")
    def test_run_temp_bucket_no_upload(self, upload_classifications, upload, temp_bucket_exists):
        upload_classifications.return_value = True
        upload.return_value = False
        temp_bucket_exists.return_value = True
        res = self.trainer.run()
        self.assertEqual(res.status, train.TrainResult.UPLOAD_FAILED)

    @mock.patch("utils.train.DeployPySparkScriptOnAws.temp_bucket_exists")
    @mock.patch("utils.train.DeployPySparkScriptOnAws.upload")
    @mock.patch("utils.train.DeployPySparkScriptOnAws.upload_classifications")
    def test_run_temp_bucket_no_classification(self, upload_classifications, upload, temp_bucket_exists):
        upload_classifications.return_value = False
        upload.return_value = True
        temp_bucket_exists.return_value = True
        res = self.trainer.run()
        self.assertEqual(res.status, train.TrainResult.UPLOAD_FAILED)

    @mock.patch("utils.train.DeployPySparkScriptOnAws.describe_status_until_terminated")
    @mock.patch("utils.train.DeployPySparkScriptOnAws.start_spark_cluster")
    @mock.patch("utils.train.DeployPySparkScriptOnAws.step_spark_submit")
    @mock.patch("boto3.Session")
    @mock.patch("aioboto3.Session")
    @mock.patch("utils.train.DeployPySparkScriptOnAws.temp_bucket_exists")
    @mock.patch("utils.train.DeployPySparkScriptOnAws.upload")
    @mock.patch("utils.train.DeployPySparkScriptOnAws.upload_classifications")
    def test_run(self, upload_classifications,
                 upload,
                 temp_bucket_exists,
                 boto3_session,
                 aioboto3_session,
                 step_spark_submit,
                 start_spark_cluster,
                 describe_status_until_terminated):
        describe_status_until_terminated.return_value = True
        logger = mock.Mock()
        client = mock.Mock()
        session_obj = mock.Mock()
        session_obj.client.return_value = client

        boto3_session.return_value = session_obj
        aioboto3_session.return_value = session_obj

        trainer = train.DeployPySparkScriptOnAws(
                 2,
                 "S3_logs_folder",
                 "s3_bucket_temp_files",
                 "region",
                 "aws_access_key_id",
                 "aws_secret_access_key_id",
                 "training_script_folder",
                 "ec2_key_name",
                 "metric",
                 logger,
                 task=None,
                 emr_version="emr-5.28.0", #python3.6 spark
                 extra_kwargs=''
                 )



        upload_classifications.return_value = True
        upload.return_value = True
        temp_bucket_exists.return_value = True
        res = trainer.run()
        self.assertEqual(res.status, train.TrainResult.SUCCESS)

    def test_generate_job_name(self):
        self.assertEqual(True, True)

    @mock.patch("utils.train.datetime")
    def test_tar_python_script(self, mock_date):
        mock_date.now.return_value = datetime(2010, 1, 1)
        mock_date.side_effect = lambda *args, **kw: datetime.date(*args, **kw)
        test_date = datetime(2010,1,1)
        app_name = 1
        job_name = self.trainer.generate_job_name(app_name)
        expected = "intstream-{}.{}".format(app_name,
                                          test_date.strftime("%Y%m%d.%H%M%S.%f"))
        self.assertEqual(expected, job_name)

    def test_upload_article(self):
        pass

    def test_make_tar_file(self):
        pass

    def test_download_metric(self):
        pass

    def test_download_dir(self):
        pass

    @mock.patch("time.sleep")
    def test_describe_status_until_term_terminated(self, time_sleep):

        class mockC(object):
            def describe_cluster(self, ClusterId):
                res = {'Cluster':{'Status':{'State':"TERMINATED"}}}
                return res

        c = mockC()
        res = self.trainer.describe_status_until_terminated(c)
        self.assertEqual(True, res)

    @mock.patch("time.sleep")
    def test_describe_status_until_term_failed(self, time_sleep):

        class mockC(object):
            def describe_cluster(self, ClusterId):
                res = {'Cluster':{'Status':{'State':"TERMINATED_WITH_ERRORS"}}}
                return res

        c = mockC()
        res = self.trainer.describe_status_until_terminated(c)
        self.assertEqual(False, res)

    @mock.patch("time.sleep")
    def test_describe_status_until_term_while(self, time_sleep):

        class mockC(object):
            def __init__(self):
                self.counter = 0
            def describe_cluster(self, ClusterId):

                res = {'Cluster':{'Status':{'State':"RUNNING"}}}
                res_term = {'Cluster':{'Status':{'State':"TERMINATED"}}}
                if self.counter == 0:
                    self.counter += 1
                    return res
                return res_term


        c = mockC()
        res = self.trainer.describe_status_until_terminated(c)
        self.assertEqual(True, res)

    def test_step_spark_submit(self):
        pass

