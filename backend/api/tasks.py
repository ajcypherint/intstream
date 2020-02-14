from celery import shared_task
import feedparser
import datetime
from . import models
import requests
from django.utils import timezone
from celery_singleton import Singleton
from celery.utils.log import get_task_logger
import numpy as np
logger = get_task_logger(__name__)
from utils import vector, read, train
import venv
from api.models import ModelVersion, MLModel, Organization
from django.core.files import File
from django.conf import settings
import os
import subprocess
import tempfile
from shutil import copyfile
import virtualenv
import json
import tarfile

class Venv(Exception):
    pass

class Create(Venv):
    pass

class Pip(Venv):
    pass

@shared_task
def add(x,y):
    return x + y


@shared_task
def process_entry(post_title,
                  post_description,
                  post_id,
                  post_link,
                  source_id,
                  organization_id
                  ):
    """

    :param post_title: str
    :param post_description: str
    :param post_id: int
    :param post_link: str
    :param source_id: int
    :param articles_id: list[int]
    :param articles_text: list[string]
    :return:
    """

    response = requests.get(post_link)
    article = models.RSSArticle(
        title=post_title,
        description=post_description,
        guid=post_id,
        link=post_link,
        text=response.text
        )

    article.source_id = source_id
    article.organization_id=organization_id
    article.save()


def process_rss_source(source_url, source_id, organization_id):
    """
    will launch them async
    :param source_url: str
    :param source_id: int
    :return:
    """
    data = feedparser.parse(source_url)
    logger.debug("source_url:" + str(source_url))
    for post in data.entries:
        if "id" not in post.keys():
            if "guid" in post.keys():
                post["id"] = post.guid[0:800]
            else:
                post["id"] = post.title[0:200] + source_url[0:600]
        else:
            post["id"]=str(post.id)[0:800]
        logger.debug("post id:" + str(post.id))
        exists = models.RSSArticle.objects.filter(guid=post.id,
                                                  organization=organization_id).exists()
        if not exists:
            process_entry.delay(post.title,
                                post.description,
                                post.id,
                                post.link,
                                source_id,
                                organization_id
                                )



@shared_task()
def process_rss_sources():
    sources = models.RSSSource.objects.filter(active=True).all()
    for source in sources:
        logger.debug("source:" + source.name)
        process_rss_source(source.url,source.id,source.organization_id)


def iterate(instances):
    for i in instances:
        yield i.text

@shared_task(bind=True)
def upload_docs(self,
                model,
                s3_bucket_logs,
                s3_bucket_temp_files,
                region,
                aws_access_key_id,
                aws_secret_access_key_id,
                ):
    trainer = train.DeployPySparkScriptOnAws(model=model,
                s3_bucket_logs=s3_bucket_logs,
                s3_bucket_temp_files=s3_bucket_temp_files,
                region=region,
                aws_access_key_id=aws_access_key_id,
                aws_secret_access_key_id=aws_secret_access_key_id,
                task=self.request.id)

    trainer.upload()


@shared_task
def task_create_virtual_env(script_directory, proxy=None):
    pass

SCRIPT = "script_"
VENV = "venv_"
MODEL = "model_"
BASE_CLASSIFY_FILE = "base_classify_file.py"
CUSTOM_CLASSIFY_FILE = "train_classify.py"
INTSTREAM_PROXY_ENV = "INTSTREAM_PROXY"


def classify(directory, text_list, model_version_id):
    """
    :param directory: str
    :param text_list: list[str]
    :return:
    """
    model = ModelVersion.objects.get(id=model_version_id)
    #todo(aj) extract tar.gz  model_bytes to tmp dir folder if not already exists
    model_directory = os.path.join(settings.VENV_DIR, MODEL+str(model.id))
    full_model_dir = os.path.join(model_directory,settings.MODEL_FOLDER)
    # create model dir
    if not os.path.exists(model_directory):
        model_tar = tarfile.open(mode="r:gz", fileobj=model.file)
        try:
            model_tar.extractall(path=model_directory)
        except Exception as e:
            if os.path.exists(model_directory):
                os.rmdir(model_directory)
            raise e
    #create venv and program folders
    create_dirs(directory)
    script_directory = os.path.join(settings.VENV_DIR, SCRIPT + directory)
    venv_directory = os.path.join(settings.VENV_DIR, VENV + directory)
    json_data = {"classifier":full_model_dir, "text":text_list}
    path_python = os.path.join(venv_directory,"bin","python"),
    script = os.path.join(script_directory,BASE_CLASSIFY_FILE)
    res = subprocess.run([
        path_python,
        script,
        ],
        env={"PYTHON_PATH":venv_directory},
        stdin=json.dumps(json_data).encode("utf-8"),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE)

    classifications = json.loads(res.stdout)
    return classifications


def create_dirs(script_directory):
    """
    :param script_directory: str
    :return:
    """
    create_script_directory(script_directory)
    create_virtual_env(script_directory)


def create_script_directory(script_directory):
    """

    :param script_directory: str
    :return:
    """
    directory = os.path.join(settings.VENV_DIR, SCRIPT + script_directory)
    if not os.path.exists(directory):
        try:
            os.mkdir(directory)
            base_script = os.path.join(settings.AWS_TRAIN_FILES, BASE_CLASSIFY_FILE)
            copyfile(base_script,os.path.join(directory,BASE_CLASSIFY_FILE))
            train_classify_script = os.path.join(settings.AWS_TRAIN_FILES, script_directory, CUSTOM_CLASSIFY_FILE)
            copyfile(train_classify_script, os.path.join(directory, CUSTOM_CLASSIFY_FILE))
        except Exception as e:
            os.rmdir(directory)
            raise e


def create_virtual_env(script_directory):
    """
    generate virtual env in dir for models
    todo(aj) allow proxy
    :param script_directory: str
    :param proxy: str
    :return:
    """
    proxy = os.environ.get(INTSTREAM_PROXY_ENV, None)
    directory = os.path.join(settings.VENV_DIR, VENV + script_directory)
    if not os.path.exists(directory):
        try:
            if proxy is not None:
                #todo(aj)
                proxy_str = "--proxy " + proxy
            res = subprocess.run(["python",
                            "-m",
                            "virtualenv",
                            directory],
                           stdout=subprocess.PIPE,
                           stderr=subprocess.PIPE)
            logger.info("create venv stderr: " + str(res.stderr))
            logger.info("create venv stdout: " + str(res.stdout))
            if res.returncode != 0:
                raise Create
            respip = subprocess.run([os.path.join(directory,"bin/python"),
                              "-m",
                              "pip",
                              "install",
                              "-r",
                              os.path.join(settings.AWS_TRAIN_FILES,"requirements.txt")],
                           stdout=subprocess.PIPE,
                           stderr=subprocess.PIPE)
            logger.info("pip stderr: " + str(respip.stderr))
            logger.info("pip stdout: " + str(respip.stdout))
            if res.returncode != 0:
                raise Pip

            respip2 = subprocess.run([os.path.join(directory,"bin/python"),
                              "-m",
                              "pip",
                              "install",
                              "-r",
                              os.path.join(settings.AWS_TRAIN_FILES,script_directory,"requirements.txt")],
                           stdout=subprocess.PIPE,
                           stderr=subprocess.PIPE)
            logger.info("pip stderr: " + str(respip2.stderr))
            logger.info("pip stdout: " + str(respip2.stdout))
            if res.returncode != 0:
                raise Pip
        except Exception as e:
            os.rmdir(directory)
            raise e


@shared_task(bind=True)
def train_model(self,
                model,
                organization,
                metric,
                s3_bucket_logs,
                s3_bucket_temp_files,
                region,
                aws_access_key_id,
                aws_secret_access_key_id,
                training_script_folder,
                ec2_key_name,
                ):
    trainer = train.DeployPySparkScriptOnAws(model=model,
                                             s3_bucket_logs=s3_bucket_logs,
                                             s3_bucket_temp_files=s3_bucket_temp_files,
                                             region=region,
                                             aws_access_key_id=aws_access_key_id,
                                             aws_secret_access_key_id=aws_secret_access_key_id,
                                             training_script_folder=training_script_folder,
                                             task=self.request.id.__str__(),
                                             ec2_key_name=ec2_key_name,
                                             metric=metric# possible metric f1,recall,precision
                                             )
    try:
        # insert job_id into model version
        # model, version, organization
        model = MLModel.objects.get(id=model)
        org = Organization.objects.get(id=organization)
        model_version = ModelVersion(organization=org,
                                     model=model,
                                     version=trainer.job_name,
                                     metric_name=metric)
        model_version.save()
        # todo(aj) pass in callback callback(job_name, status)
        # upserts the database with jobname
        result = trainer.run(delete=False)
        temp_dir = tempfile.TemporaryDirectory()

        # download model
        trainer.download_dir(os.path.join(trainer.job_name, trainer.MODEL_NAME), temp_dir.name,
                             trainer.s3_bucket_temp_files)
        temp_file = tempfile.NamedTemporaryFile(suffix=".tar.gz")
        trainer.make_tarfile(temp_file.name, os.path.join(temp_dir.name, trainer.job_name, trainer.MODEL_NAME))
        with open(temp_file.name, "rb") as f:
            model_version.file = File(f, os.path.basename(f.name))
            model_version.save()

        # download metric
        temp_metric_file = tempfile.NamedTemporaryFile()
        trainer.download_metric(temp_metric_file.name)
        with open(temp_metric_file.name, encoding="ascii") as f:
            value = f.read()
            model_version.metric_value = float(value)
            model_version.save()

    finally:
        # cleanup
        trainer.remove_temp_files(trainer.sync_s3)




