from celery import shared_task
import feedparser
import asyncio
import aiohttp
import tarfile

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
import shutil
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
        try:
            async with session.get(url, timeout=25) as response:
                try:
                    return await response.text()
                except UnicodeDecodeError as e:
                    return str(e)
        except aiohttp.ClientError as e:
            return str(e)

PLACEHOLDER_TEXT = "placeholder text for classifier"


@shared_task()
def process_rss_source(source_url, source_id, organization_id):
    _process_rss_source(source_url, source_id, organization_id)


def _process_rss_source(source_url, source_id, organization_id):
    #todo(aj) add logging here and save to database for lookup
    """
    will launch them async
    :param source_url: str
    :param source_id: int
    :return:
    """
    logger.info("source_url:" + str(source_url))
    data = feedparser.parse(source_url)
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

    article_texts = [[i.text] for i in articles]
    org = models.Organization.objects.get(id=organization_id)
    for version in active_model_versions:
        predictions = classify(article_texts, version.id)
        for i, article in enumerate(articles):
            prediction = models.Prediction(article=article,
                                               organization=org,
                                               mlmodel=version.model,
                                               target=predictions[i])
            prediction.save()


#unit test
def model_dir(id):
    model_directory = os.path.join(settings.VENV_DIR, MODEL+str(id))
    return model_directory


@shared_task()
def process_rss_sources():
    _process_rss_sources()


def _process_rss_sources():
#todo unit test
   #generate
    # 1. model_version dir
    # 2. script dir
    # 3. venv dir
    active_model_versions = models.ModelVersion.objects.filter(model__active=True,
                                                               active=True)
    for version in active_model_versions:
        model_directory = model_dir(version.id)
        # create model dir
        if not os.path.exists(model_directory):
            model_tar = tarfile.open(mode="r:gz", fileobj=version.file)
            try:
                model_tar.extractall(path=model_directory)
            except Exception as e:
                if os.path.exists(model_directory):
                    shutil.rmtree(model_directory)
                raise e
    script_versions = models.TrainingScriptVersion.objects.all()
    for v in script_versions:
        create_dirs(v)
    sources = models.RSSSource.objects.filter(active=True).all()
    for source in sources:
        logger.info("source:" + source.name)
        process_rss_source.delay(
            source.url, source.id, source.organization_id
        )


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

#todo unit test
def classify(text_list, model_version_id):
    """
    :param text_list: list[str]
    :param model_version_id: int
    :return:
    """
    model = ModelVersion.objects.get(id=model_version_id)
    model_directory = model_dir(model.id)
    full_model_dir = os.path.join(model_directory,settings.MODEL_FOLDER)

    script_directory =  get_script_directory_model_version_id(model_version_id)
    venv_directory = get_venv_directory_model_version_id(model_version_id)
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


def create_dirs(training_script_version):
    """
    :param training_script_version: models.TrainingScriptVersion
    :return:
    """
    create_script_directory(training_script_version)
    create_virtual_env(training_script_version)


def get_script_directory_script_version_id(id):
    """

    :param id: int script id
    :return:
    """
    directory = os.path.join(settings.VENV_DIR, SCRIPT + str(id))
    return  directory


def get_script_directory_model_version_id(id):
    """

    :param id: int model id
    :return:
    """
    model_version = models.ModelVersion.objects.get(id=id)
    script_id = model_version.training_script_version.id
    directory = os.path.join(settings.VENV_DIR, SCRIPT + str(script_id))
    return  directory


#todo unit test
def create_script_directory(training_script_version):
    """
    :param training_script_version: models.TrainingScriptVersion
    :return:
    """
    directory = get_script_directory_script_version_id(training_script_version.id)
    #VENV_DIR = /tmp
    if not os.path.exists(directory):
        try:
            os.mkdir(directory)
            base_script = os.path.join(settings.AWS_TRAIN_FILES, BASE_CLASSIFY_FILE)
            copyfile(base_script,os.path.join(directory,BASE_CLASSIFY_FILE))
            # todo(aj) open tar file
            archive = tarfile.open(training_script_version.zip.path, 'r:gz')

            tmp = archive.extractfile(CUSTOM_CLASSIFY_FILE)
            with open(os.path.join(directory, CUSTOM_CLASSIFY_FILE),"wb") as f:
                f.write(tmp.read())
                f.flush()
        except Exception as e:
            shutil.rmtree(directory)
            raise e


def get_venv_directory_model_version_id(id):
    """
    :param id: int
    :return:
    """
    model_version = models.ModelVersion.objects.get(id=id)
    script_id = model_version.training_script_version.id

    directory = os.path.join(settings.VENV_DIR, VENV + str(script_id))
    return directory


def get_venv_directory_script_version(id):
    """
    :param id: int
    :return:
    """
    directory = os.path.join(settings.VENV_DIR, VENV + str(id))
    return directory


def create_virtual_env(training_script_version):
    """
    generate virtual env in dir for models
    :param training_script_version: models.TrainingScriptVersion
    :return:
    """
    proxy = os.environ.get(INTSTREAM_PROXY_ENV, None)
    directory = get_venv_directory_script_version(training_script_version.id)
    if not os.path.exists(directory):
        try:
            # todo causes error isADirectory when running virtualenv
            env = {**os.environ,"test":"test"}
            if proxy is not None:
                env={**env, "http_proxy":proxy,"https_proxy":proxy}
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

            # special case pystemmer install needs cython installed
            respip = subprocess.run([os.path.join(directory,"bin/python"),
                              "-m",
                              "pip",
                              "install",
                              "cython",
                              ],
                           env=env,
                           stdout=subprocess.PIPE,
                           stderr=subprocess.PIPE)
            logger.info("pip stderr: " + str(respip.stderr))
            logger.info("pip stdout: " + str(respip.stdout))
            if res.returncode != 0:
                raise Pip

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

            REQ = "requirements.txt"
            archive = tarfile.open(training_script_version.zip.path, 'r:gz')
            with tempfile.NamedTemporaryFile() as req:
                tmpreq = archive.extractfile(REQ)
                req.write(tmpreq.read())
                req.flush()
                # add PYTHON_PATH to virtual env params
                respip2 = subprocess.run([os.path.join(directory,"bin/python"),
                                  "-m",
                                  "pip",
                                  "install",
                                  "-r",
                                  req.name],
                               env=env,
                               stdout=subprocess.PIPE,
                               stderr=subprocess.PIPE)
                logger.info("pip stderr: " + str(respip2.stderr))
                logger.info("pip stdout: " + str(respip2.stdout))
                if res.returncode != 0:
                    raise Pip
        except Exception as e:
            shutil.rmtree(directory)
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

#todo refactor into one method for task and another for function to allow unit testing of function
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
                logging_level=logging.DEBUG,
                extra_kwargs=''
                ):
    task = self.request.id.__str__()
    # todo(aj) could be a function
    logger = get_task_logger(task)
    logger.setLevel(logging.DEBUG)
    formatter = TaskFormatter('%(asctime)s - %(task_id)s - %(task_name)s - %(name)s - %(levelname)s - %(message)s')

    # optionally logging on the Console as well as file
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)
    stream_handler.setLevel(logging_level) #todo(aj) hardcoded for now
    # Adding File Handle with file path. Filename is task_id
    log_name = os.path.join('/tmp/', task+'.log')
    task_handler = logging.FileHandler(log_name)
    task_handler.setFormatter(formatter)
    task_handler.setLevel(logging_level) #todo(aj) hardcoded for now
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
                                             logger=logger,
                                             extra_kwargs=extra_kwargs
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




