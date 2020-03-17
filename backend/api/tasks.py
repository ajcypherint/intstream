from celery import shared_task
import feedparser
import asyncio
import aiohttp

from celery.utils.log import get_task_logger

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
from celery import group
import os
import subprocess
import tempfile
from shutil import copyfile
import virtualenv
import json
import tarfile
from utils.train import TrainResult
from celery.app.log import TaskFormatter
from celery.signals import task_prerun, task_postrun
import logging
# to control the tasks that required logging mechanism
from celery import signals
TASK_WITH_LOGGING = ['api.tasks.train_model']
from celery.app.log import TaskFormatter

from api import models
"""
@signals.task_prerun.connect(sender=TASK_WITH_LOGGING)
def prepare_logging(signal=None, sender=None, task_id=None, task=None, args=None, **kwargs):
    logger = logging.getLogger(task_id)
    formatter = TaskFormatter('[%(asctime)s][%(levelname)s] %(task_id) %(message)s ')
    # optionally logging on the Console as well as file
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)
    stream_handler.setLevel(logging.DEBUG) #todo(aj) hardcoded for now
    # Adding File Handle with file path. Filename is task_id
    task_handler = logging.FileHandler(os.path.join('/tmp/', task_id+'.log'))
    task_handler.setFormatter(formatter)
    task_handler.setLevel(logging.DEBUG) #todo(aj) hardcoded for now
    logger.addHandler(stream_handler)
    logger.addHandler(task_handler)


@signals.task_postrun.connect(sender=TASK_WITH_LOGGING)
def close_logging(signal=None, sender=None, task_id=None, task=None, args=None, retval=None, state=None, **kwargs):
    # getting the same logger and closing all handles associated with it
    logger = logging.getLogger(task_id)
    for handler in logger.handlers:
        handler.flush()
        handler.close()
    logger.handlers = []
    # save log to database for review
    version = models.ModelVersion.objects.get(task_id=task_id)
    with open(os.path.join('/tmp/', task_id + ".log")) as f:
        version.celery_log.save(task_id + ".log",File(f))
        version.save()
"""


class RSSArticleSave(Exception):
    pass

class Venv(Exception):
    pass


class ClassifyError(Exception):
    pass


class Create(Venv):
    pass


class Pip(Venv):
    pass

@shared_task
def add(x,y):
    return x + y


async def fetch(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            #todo(aj) if 301 get redirect.  use gcaptain.com rss feed to test
            return await response.text()

PLACEHOLDER_TEXT = "placeholder text for classifier"



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

    # filter ModelVersion by model__source=source and model__active=True
    # todo(aj) requests.get all the article texts and then run all the saves then run the prediction
    active_model_versions = models.ModelVersion.objects.filter(organization__id=organization_id,
                                                               model__sources__id=source_id,
                                                               model__active=True,
                                                               active=True)
    for version in active_model_versions:
        directory = version.model.script_directory
        predictions = classify(directory, [[article.text]], version.id)
        prediction = models.Prediction(article=article,
                                           organization__id=organization_id,
                                           mlmodel=version.model,
                                           target=predictions[0])
        prediction.save()


def process_rss_source(source_url, source_id, organization_id):
    """
    will launch them async
    :param source_url: str
    :param source_id: int
    :return:
    """
    data = feedparser.parse(source_url)
    logger.debug("source_url:" + str(source_url))
    collect = []
    for post in data.entries:
        if "id" not in post.keys():
            if "guid" in post.keys():
                post["id"] = post.guid[0:2000]
            else:
                post["id"] = post.title[0:200] + source_url[0:1800]
        else:
            post["id"]=str(post.id)[0:2000]
        logger.debug("post id:" + str(post.id))
        exists = models.RSSArticle.objects.filter(guid=post.id,
                                                  organization=organization_id).exists()
        if not exists:
            collect.append(post)

    loop = asyncio.get_event_loop()
    tasks = []
    for post in collect:
        tasks.append(fetch(post.link))

    htmls = loop.run_until_complete(asyncio.gather(*tasks))
    articles = []
    for i, html in enumerate(htmls):

        article = models.RSSArticle(
            title=collect[i].title[0:1000],
            description=collect[i].description,
            guid=collect[i].id,
            link=collect[i].link,
            text=html
            )

        article.source_id = source_id
        article.organization_id=organization_id
        article.save()
        articles.append(article)

        # filter ModelVersion by model__source=source and model__active=True
    active_model_versions = models.ModelVersion.objects.filter(organization__id=organization_id,
                                                               model__sources__id=source_id,
                                                               model__active=True,
                                                               active=True)
    if len(articles) == 0:
        logger.debug("no articles to classify: " + source_url)
        return
    #todo(aj) implement paging here to prevent overload
    article_texts = [[i.text] for i in articles]
    org = models.Organization.objects.get(id=organization_id)
    for version in active_model_versions:
        directory = version.model.script_directory
        predictions = classify(directory, article_texts, version.id)
        for i,article in enumerate(articles):
            prediction = models.Prediction(article=article,
                                               organization=org,
                                               mlmodel=version.model,
                                               target=predictions[i])
            prediction.save()


        #process_entry.delay(post.title,
            #                    post.description,
            #                    post.id,
            #                    post.link,
            #                    source_id,
            #                    organization_id
            #                    )




@shared_task()
def process_rss_sources():
    sources = models.RSSSource.objects.filter(active=True).all()
    for source in sources:
        logger.debug("source:" + source.name)
        process_rss_source(source.url, source.id, source.organization_id)


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
    path_python = os.path.join(venv_directory,"bin","python")
    script = os.path.join(script_directory,BASE_CLASSIFY_FILE)
    proc = None
    timeout = 530
    try:
        proc = subprocess.run([
            path_python,
            script,
            ],
            env={"VIRTUAL_ENV":venv_directory,
                 "PATH":os.path.join(venv_directory,"bin") + ":" + os.environ["PATH"],
                 "PYSPARK_PYTHON":path_python},
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            encoding="utf-8",
        timeout=timeout,
        input=json.dumps(json_data))

        if proc.returncode != 0:
            raise ClassifyError("ErrorCode: "+ str(proc.returncode) +
                                "\nstdout: " + proc.stdout +
                                "\nstderr: " + proc.stderr)

    except TimeoutError:
        proc.kill()
        outs, errs = proc.communicate()
        raise ClassifyError("Timeout reached: " + str(timeout))

    classifications = json.loads(proc.stdout)
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
    :param script_directory: str
    :param proxy: str
    :return:
    """
    proxy = os.environ.get(INTSTREAM_PROXY_ENV, None)
    directory = os.path.join(settings.VENV_DIR, VENV + script_directory)
    if not os.path.exists(directory):
        try:
            env = None
            if proxy is not None:
                env={"http_proxy":proxy,"https_proxy":proxy}
            res = subprocess.run(["python3",
                            "-m",
                            "virtualenv",
                            directory],
                                 env=env,
                           stdout=subprocess.PIPE,
                           stderr=subprocess.PIPE)
            logger.info("create venv stderr: " + str(res.stderr))
            logger.info("create venv stdout: " + str(res.stdout))
            if res.returncode != 0:
                raise Create
            # add PYTHON_PATH to virtual env params
            env={"VIRTUAL_ENV":directory,
                     "PATH":os.path.join(directory,"bin") + ":" + os.environ["PATH"],
                     "PYSPARK_PYTHON":os.path.join(directory,"bin")}

            respip = subprocess.run([os.path.join(directory,"bin/python"),
                              "-m",
                              "pip",
                              "install",
                              "-r",
                              os.path.join(settings.AWS_TRAIN_FILES,"requirements.txt")],
                           env=env,
                           stdout=subprocess.PIPE,
                           stderr=subprocess.PIPE)
            logger.info("pip stderr: " + str(respip.stderr))
            logger.info("pip stdout: " + str(respip.stdout))
            if res.returncode != 0:
                raise Pip

            # add PYTHON_PATH to virtual env params
            respip2 = subprocess.run([os.path.join(directory,"bin/python"),
                              "-m",
                              "pip",
                              "install",
                              "-r",
                              os.path.join(settings.AWS_TRAIN_FILES,script_directory,"requirements.txt")],
                           env=env,
                           stdout=subprocess.PIPE,
                           stderr=subprocess.PIPE)
            logger.info("pip stderr: " + str(respip2.stderr))
            logger.info("pip stdout: " + str(respip2.stdout))
            if res.returncode != 0:
                raise Pip
        except Exception as e:
            os.rmdir(directory)
            raise e


def update_status(job_name, status):
    """
    :param job_name: str
    :param status: str
    :return:
    """
    model_version = models.ModelVersion.objects.get(version=job_name)
    model_version.status=status
    model_version.save()


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
    task = self.request.id.__str__()
    # todo(aj) could be a function
    logger = get_task_logger(task)
    logger.setLevel(logging.DEBUG)
    formatter = TaskFormatter('%(asctime)s - %(task_id)s - %(task_name)s - %(name)s - %(levelname)s - %(message)s')

    # optionally logging on the Console as well as file
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)
    stream_handler.setLevel(logging.DEBUG) #todo(aj) hardcoded for now
    # Adding File Handle with file path. Filename is task_id
    log_name = os.path.join('/tmp/', task+'.log')
    task_handler = logging.FileHandler(log_name)
    task_handler.setFormatter(formatter)
    task_handler.setLevel(logging.DEBUG) #todo(aj) hardcoded for now
    logger.addHandler(stream_handler)
    logger.addHandler(task_handler)
    logger.info("test this is the message")
    #todo(aj) pass logger into trainer so it can log to this logger instead of default one
    trainer = train.DeployPySparkScriptOnAws(model=model,
                                             s3_bucket_logs=s3_bucket_logs,
                                             s3_bucket_temp_files=s3_bucket_temp_files,
                                             region=region,
                                             aws_access_key_id=aws_access_key_id,
                                             aws_secret_access_key_id=aws_secret_access_key_id,
                                             training_script_folder=training_script_folder,
                                             task=task,
                                             ec2_key_name=ec2_key_name,
                                             metric=metric,# possible metric f1,recall,precision
                                             logger=logger
                                             )
    model = MLModel.objects.get(id=model)
    org = Organization.objects.get(id=organization)
    model_version = ModelVersion(organization=org,
                                     model=model,
                                     task=task,
                                     version=trainer.job_name,
                                     metric_name=metric)
    model_version.save()
    try:
        # insert job_id into model version
        # model, version, organization
        # todo(aj) pass in callback callback(job_name, status)
        result = trainer.run(delete=False, status_callback=update_status)
        mversion = models.ModelVersion.objects.get(version=trainer.job_name)
        mversion.status = result.status
        mversion.save()
        if result.status == TrainResult.SUCCESS:
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
            model_version.status = "SUCCESS"
            model_version.save()
        else:
            model_version.status = "FAILED"
            model_version.save()
    except Exception as e:
        model_version.status = "FAILED"
        model_version.save()
        raise e
    finally:
        # cleanup
        trainer.remove_temp_files(trainer.sync_s3)
        for handler in logger.handlers:
            handler.flush()
            handler.close()
        logger.handlers = []
        # save log to database for review
        version = models.ModelVersion.objects.get(task=task)
        with open(log_name) as f:
            version.celery_log.save(os.path.basename(log_name), File(f))
            version.save()




