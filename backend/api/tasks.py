from celery import shared_task
import feedparser
import asyncio
from utils import domain
import aiohttp
import tarfile
import re

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
from rest_framework_simplejwt.tokens import RefreshToken
import iocextract
import venv
from api.models import ModelVersion, MLModel, Organization
from api import serializers
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

class IntstreamException(Exception):
    pass

class RSSArticleSave(IntstreamException):
    pass

class Venv(IntstreamException):
    pass


class ClassifyError(IntstreamException):
    pass

class IndicatorJobError(IntstreamException):
    pass

class JobError(IntstreamException):
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
            async with session.get(url, timeout=120) as response:
                try:
                    return await response.text()
                except UnicodeDecodeError as e:
                    return str(e)
                except aiohttp.ClientError as e:
                    return str(e)
                except asyncio.TimeoutError as e:
                    return str(e)
        except aiohttp.ClientError as e:
            return str(e)

PLACEHOLDER_TEXT = "placeholder text for classifier"

PUBLIC_SUFFIX_RE = re.compile(r'^(?P<suffix>[.*!]*\w[\S]*)', re.UNICODE | re.MULTILINE)


def _update_suffixes():
    proxies = {
        "https": settings.PROXY,
        "http": settings.PROXY
    }

    resp = requests.get(settings.SUFFIX_LIST_URL, proxies=proxies, timeout=60)
    resp.raise_for_status()
    text, _, _ = resp.text.partition('// ===BEGIN PRIVATE DOMAINS===')
    tlds = [m.group('suffix') for m in PUBLIC_SUFFIX_RE.finditer(text)]
    for x in tlds:
        suffix = models.Suffix.objects.get_or_create(value=x)


@shared_task()
def update_suffixes():
    _update_suffixes()


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

INDICATOR_JOB_PREFIX = "indicator"
JOB_PREFIX = "standard"
SCRIPT_INDICATOR_JOB = "indicatorjob.py"
SCRIPT_JOB = "job.py"


@shared_task()
def indicatorjob(id, indicator):
    _indicatorjob(id, indicator)


def _indicatorjob(id, indicator):
    job = models.IndicatorJob.objects.get(id=id)
    user = models.UserIntStream.objects.get(username=job.user)
    job_version = models.IndicatorJobVersion.objects.get(job=job)
    tokens = get_tokens_for_user(user)
    directory = get_script_directory_indicator_script_version_id(job_version.id)
    create_job_script_directory(job_version, directory, SCRIPT_INDICATOR_JOB)
    create_virtual_env(job_version, aws_req=False, job=INDICATOR_JOB_PREFIX)

    job_args = "" if job_version.job.arguments is None else job_version.job.arguments
    script_directory = get_script_directory_indicator_script_version_id(job_version.id)
    venv_directory = get_venv_directory_script_version(job_version.id, INDICATOR_JOB_PREFIX)
    path_python = os.path.join(venv_directory,"bin","python")
    script = os.path.join(script_directory, SCRIPT_INDICATOR_JOB)
    proc = None
    try:
        args = [
            path_python,
            script,
            "--indicator",
            indicator,
            ]
        if len(job_args) > 0:
            args.extend(job_args.split(" "))
        proc = subprocess.run(args,
            env={
                "JOB_SERVER_URL": os.environ.get("INSTREAM_URL","http://127.0.0.1:8000"),
                "JOB_REFRESH": tokens["refresh"],
                "JOB_ACCESS": tokens["access"],
                "VIRTUAL_ENV": venv_directory,
                "PATH": os.path.join(venv_directory, "bin") + ":" + os.environ["PATH"],
                 },
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            encoding="utf-8",
            timeout=job.timeout)

        if proc.returncode != 0:
            raise IndicatorJobError("ErrorCode: "+ str(proc.returncode) +
                                "\nstdout: " + proc.stdout +
                                "\nstderr: " + proc.stderr)

        log = models.IndicatorJobLog(organization=job_version.organization,
                                     job=job_version.job,
                                     stdout=proc.stdout,
                                     stderr=proc.stderr)
        log.save()
    except TimeoutError:
        proc.kill()
        outs, errs = proc.communicate()
        log = models.IndicatorJobLog(organization=job_version.organization,
                                     job=job_version.job,
                                     stdout=outs,
                                     stderr=errs)
        log.save()
        raise IndicatorJobError("Timeout reached: " + str(job.timeout))

@shared_task()
def job(id):
    _job(id)

def _job(id):
    job = models.Job.objects.get(id=id)
    user = models.UserIntStream.objects.get(username=job.username)
    job_version = models.JobVersion.objects.get(active=True, job=job)
    tokens = get_tokens_for_user(user)
    directory = get_script_directory_script_version_id(job_version.id)
    create_job_script_directory(job_version, directory)
    create_virtual_env(job_version, aws_req=False, job=JOB_PREFIX)

    job_version = models.JobVersion.objects.get(id=job_version.id)
    job_args = job_version.job.arguments
    script_directory = get_script_directory_script_version_id(job_version.id)
    venv_directory = get_venv_directory_script_version(job.id, JOB_PREFIX)
    path_python = os.path.join(venv_directory,"bin","python")
    script = os.path.join(script_directory, SCRIPT)
    proc = None
    try:
        proc = subprocess.run([
            path_python,
            script,
            ].extend(job_args.split(" ")),
            env={
                "JOB_REFRESH": tokens["refresh"],
                "JOB_ACCESS": tokens["access"],
                "VIRTUAL_ENV": venv_directory,
                "PATH": os.path.join(venv_directory, "bin") + ":" + os.environ["PATH"],
                 },
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            encoding="utf-8",
            timeout=job.timeout)

        if proc.returncode != 0:
            raise IndicatorJobError("ErrorCode: "+ str(proc.returncode) +
                                "\nstdout: " + proc.stdout +
                                "\nstderr: " + proc.stderr)

        log = models.JobLog(organization=job_version.organization,
                                     job=job_version.job,
                                     stdout=proc.stdout,
                                     stderr=proc.stderr)
        log.save()
    except TimeoutError:
        proc.kill()
        outs, errs = proc.communicate()
        log = models.JobLog(organization=job_version.organization,
                                     job=job_version.job,
                                     stdout=outs,
                                     stderr=errs)
        log.save()
        raise JobError("Timeout reached: " + str(job.timeout))


CUSTOM_TRAIN_FILE = "train_classify.py"


def create_job_script_directory(jobversion, directory, file=CUSTOM_TRAIN_FILE):
    if not os.path.exists(directory):
        try:
            os.mkdir(directory)
            archive = tarfile.open(jobversion.zip.path, 'r:gz')
            tmp = archive.extractfile(file)
            with open(os.path.join(directory, file), "wb") as f:
                f.write(tmp.read())
                f.flush()
        except Exception as e:
            shutil.rmtree(directory)
            raise e


def _extract_indicators(text, article_id, organization_id):
    """
    :param text: str
    :param article: models.Article
    :return:
    """

    article = models.Article.objects.get(id=article_id)
    organization = models.Organization.objects.get(id=organization_id)
    ipv4s = iocextract.extract_ipv4s(text, refang=True)
    for i in ipv4s:
        ip, _ = models.IndicatorIPV4.objects.get_or_create(value=i, organization=organization)
        ip.articles.add(article)
        jobs = models.IndicatorJobVersion.objects.filter(job__indicator_types__name="IPV4",
                                                   organization=organization,
                                                   job__active=True)
        for job in jobs:
            indicatorjob.delay(job.id, ip.value)

    ipv6s = iocextract.extract_ipv6s(text)
    for i in ipv6s:
        ip, _ = models.IndicatorIPV6.objects.get_or_create(value=i, organization=organization)
        ip.articles.add(article)
        jobs = models.IndicatorJobVersion.objects.filter(job__indicator_types__name="IPV6",
                                                   organization=organization,
                                                   job__active=True)
        for job in jobs:
            indicatorjob.delay(job.id, ip.value)


    urls = iocextract.extract_urls(text, refang=True)
    for i in urls:
        # todo  load extra suffixes from models.suffixes
        subdomain, dom, suff = domain.extract(i)
        if suff != "":
            suffix = models.Suffix.objects.get(value=suff)
            instance, _ = models.IndicatorNetLoc.objects.get_or_create(subdomain=subdomain,
                                        domain=domain,
                                        suffix=suffix,
                                        organization=organization)

            instance.articles.add(article)
            jobs = models.IndicatorJobVersion.objects.filter(job__indicator_types__name="NetLoc",
                                                       organization=organization,
                                                       job__active=True)
            serial_instance = serializers.IndicatorNetLocSerializer(instance)
            for job in jobs:
                indicatorjob.delay(job.id, serial_instance.url)

    md5s = iocextract.extract_md5_hashes(text)
    for i in md5s:
        md5, _ = models.IndicatorMD5.objects.get_or_create(value=i, organization=organization)
        md5.articles.add(article)
        jobs = models.IndicatorJobVersion.objects.filter(job__indicator_types__name="MD5",
                                                   organization=organization,
                                                   job__active=True)
        for job in jobs:
            indicatorjob.delay(job.id, md5.value)

    sha1s = iocextract.extract_sha1_hashes(text)
    for i in sha1s:
        sha1 = models.IndicatorSha1(value=i, organization=organization)
        sha1.save()
        sha1.articles.add(article)
        jobs = models.IndicatorJobVersion.objects.filter(job__indicator_types__name="Sha1",
                                                   organization=organization,
                                                   job__active=True)
        for job in jobs:
            indicatorjob.delay(job.id, sha1.value)

    sha256s = iocextract.extract_sha256_hashes(text)
    for i in sha256s:
        sha256 = models.IndicatorSha256(value=i, organization=organization)
        sha256.save()
        sha256.articles.add(article)
        # todo(run indicatorJobs)
        jobs = models.IndicatorJobVersion.objects.filter(job__indicator_types__name="Sha256",
                                                   organization=organization,
                                                   job__active=True)
        for job in jobs:
            indicatorjob.delay(job.id, sha256.value)

@shared_task()
def extract_indicators(text, article_id, organization_id):
    """

    :param text: str
    :param article_id: int
    :param organization_id: int
    :return:
    """
    _extract_indicators(text, article_id, organization_id)


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
    source = models.Source.objects.get(id=source_id)
    org = models.Organization.objects.get(id=organization_id)

    for i, html in enumerate(htmls):
        article = models.RSSArticle(
            title=collect[i].title[0:1000],
            description=collect[i].description,
            guid=collect[i].id,
            link=collect[i].link,
            text=html,
            source=source,
            organization=org
            )
        article.save()
        ser = serializers.RSSSerializer(article)
        articles.append(article.pk)
        if source.extract_indicators:
            extract_indicators.delay(ser.data["clean_text"], ser.instance.id, ser.instance.organization.id)


    predict.delay(articles, source_id, organization_id)


def _predict(article_ids, source_id, organization_id):
    # filter ModelVersion by model__source=source and model__active=True
    active_model_versions = models.ModelVersion.objects.filter(organization__id=organization_id,
                                                               model__sources__id=source_id,
                                                               model__active=True,
                                                               active=True)
    # move to new task pass article.id, and org id.
    # call function from serializer.create
    # this way when an article is sent in through the api it is classified
    # and when an article is processed through this job it is classified.
    articles = models.Article.objects.filter(id__in=article_ids).all()
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

@shared_task()
def predict(article_ids, source_id, organization_id):
    _predict(article_ids, source_id, organization_id)

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
DIRINDSCRIPT = "indscript_"
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

    script_directory = get_script_directory_model_version_id(model_version_id)
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


def get_script_directory_indicator_script_version_id(id):
    """
    :param id: int script id
    :return:
    """
    directory = os.path.join(settings.VENV_DIR, DIRINDSCRIPT + str(id))
    return  directory


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


def get_venv_directory_script_version(id, job=None):
    """
    :param id: int
    :return:
    """
    if job is not None:
        return os.path.join(settings.VENV_DIR , VENV + "_" + job + str(id))

    return os.path.join(settings.VENV_DIR , VENV + str(id))


def create_virtual_env(training_script_version, aws_req=True, job=None):
    """
    generate virtual env in dir for models
    :param training_script_version: models.TrainingScriptVersion
    :return:
    """
    proxy = os.environ.get(INTSTREAM_PROXY_ENV, None)
    directory = get_venv_directory_script_version(training_script_version.id, job)
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
            if aws_req:
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
                if respip2.returncode != 0:
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


def _now(tz):
    """
    :param tz: datetime.timezone
    :return: datetime
    """
    return datetime.datetime.now(tz=tz)


def _remove_old_articles():
    startdate = _now(tz=datetime.timezone.utc)
    monthprior = startdate - datetime.timedelta(days=30)
    # delete articles not used for classifications for freemium accounts older than 1 month
    old_articles = models.RSSArticle.objects.filter(organization__freemium=True,
                                                 upload_date__lt=monthprior,
                                                 classification__isnull=True)
    old_articles.delete()
    old_articles = models.TxtArticle.objects.filter(organization__freemium=True,
                                                 upload_date__lt=monthprior,
                                                 classification__isnull=True)
    old_articles.delete()
    old_articles = models.HtmlArticle.objects.filter(organization__freemium=True,
                                                 upload_date__lt=monthprior,
                                                 classification__isnull=True)
    old_articles.delete()
    old_articles = models.PDFArticle.objects.filter(organization__freemium=True,
                                                 upload_date__lt=monthprior,
                                                 classification__isnull=True)
    old_articles.delete()


@shared_task(bind=True)
def remove_old_articles(self):
    _remove_old_articles()

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




