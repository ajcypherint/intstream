from django.test import TestCase
from django.test import Client
from unittest import mock
from utils import train


def temp_bucket_exists(var):
    return True


async def mock_upload_temp_files(self):
    return True


class Train(TestCase):
    fixtures = ['UserIntstream.json',
                'Organization.json',
                "RSSSource.json",
                "Source.json",
                "JobSource.json",
                "UploadSource.json"
                ]

    def setUp(self):
        username = "ubuntu"
        password = "hinton50"
        self.c = Client()
        headers={"Content-Type":"application/json"}
        self.c.login(username=username,password=password)

    def test_upload_classifications(self):
        self.assertEqual(False,True)

    @mock.patch("utils.train.DeployPySparkScriptOnAws.temp_bucket_exists")
    @mock.patch("utils.train.DeployPySparkScriptOnAws.tar_python_script")
    @mock.patch("utils.train.DeployPySparkScriptOnAws.upload_temp_files")
    @mock.patch("api.models.Article")
    @mock.patch("utils.train.DeployPySparkScriptOnAws.chunks")
    def test_upload(self,
                    chunks,
                    Article,
                    upload_temp_files,
                    tar_python_script,
                    temp_bucket_exists,
                    ):
        temp_bucket_exists.return_value = True
        tar_python_script.return_value = True
        upload_temp_files.side_effect = mock_upload_temp_files
        chunks.return_value = []
        objects = mock.Mock()
        objects.filter.return_value = [1]

        Article.objects = objects

        logger = mock.Mock()
        trainer = train.DeployPySparkScriptOnAws(
                 "MODEL",
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
        res = trainer.upload()
        self.assertEqual(res,True)

    def test_run(self):
        self.assertEqual(False,True)

    def test_generate_job_name(self):
        self.assertEqual(False,True)

    def test_tar_python_script(self):
        self.assertEqual(False,True)

    def test_upload_article(self):
        self.assertEqual(False,True)

    def test_make_tar_file(self):
        self.assertEqual(False,True)

    def test_download_metric(self):
        self.assertEqual(False,True)

    def test_download_dir(self):
        self.assertEqual(False,True)

    def test_describe_status_until_term(self):
        pass

    def test_step_spark_submit(self):
        pass

