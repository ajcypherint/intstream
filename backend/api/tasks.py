from celery import shared_task
import feedparser
import asyncio
from utils import domain
import aiohttp
import re
import pathlib
from django.core import exceptions
from django import db
from celery.result import allow_join_result


import datetime
import requests
from celery.utils.log import get_task_logger
logger = get_task_logger(__name__)
import shutil
from rest_framework_simplejwt.tokens import RefreshToken
import iocextract
from api.models import ModelVersion, MLModel, Organization
from api import serializers
from django.core.files import File
from django.conf import settings
import os
import subprocess
import tempfile
from shutil import copyfile
import json
import tarfile
from utils import train
import logging
from celery import group
# to control the tasks that required logging mechanism
TASK_WITH_LOGGING = ['api.tasks.train_model']
from celery.app.log import TaskFormatter
import base64
MITIGATE = "mitigate"
UNMITIGATE = "unmitigate"

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
# Venv dirs
DIRVENV = os.path.join(settings.TMP_DIR, "venv")

DIRCLASSIFVENV  = os.path.join(DIRVENV, "classif")
DIRJOBVENV    = os.path.join(DIRVENV, "job")
DIRINDJOBVENV = os.path.join(DIRVENV, "indjob")
DIRMITINDJOBVENV = os.path.join(DIRVENV, "mitindjob")
DIRUNMITINDJOBVENV = os.path.join(DIRVENV, "unmitindjob")

# script dirs
DIRSCRIPT = os.path.join(settings.TMP_DIR, "script")

DIRJOBSCRIPT = os.path.join(DIRSCRIPT, "jobscript")
DIRINDSCRIPT = os.path.join(DIRSCRIPT,"indscript")
DIRMITIGATEINDSCRIPT = os.path.join(DIRSCRIPT,"mitigateindscript")
DIRUNMITIGATEINDSCRIPT = os.path.join(DIRSCRIPT,"unmitigateindscript")
DIRCLASSIFSCRIPT = os.path.join(DIRSCRIPT,"classifscript")

#model dir
MODEL = os.path.join(settings.TMP_DIR,"model")

#python script constants
BASE_CLASSIFY_FILE = "base_classify_file.py"
CUSTOM_CLASSIFY_FILE = "train_classify.py"
SCRIPT_INDICATOR_JOB = "indicatorjob.py"
SCRIPT_JOB = "job.py"

INTSTREAM_PROXY_ENV = "INTSTREAM_PROXY"

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

@shared_task()
def add(x,y, organization_id=None):
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
def update_suffixes(organization_id=None):
    _update_suffixes()


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@shared_task()
def runjobs_mitigate(indicator_ids, organization_id=None):
    """

    :param indicator_ids: list[int]
    :param organization_id: int
    :return:
    """
    if isinstance(indicator_ids, int):
        indicator_ids = [indicator_ids]
    for i in indicator_ids:
        instance  = models.Indicator.objects.get(pk=i)
        all_jobs = models.StandardIndicatorJob.objects.filter(indicator_types=instance.ind_type).all()
        tasks = []
        for j in all_jobs:
            tasks.append(indicatorjob.s(j.id, i, organization_id=organization_id))
        if len(tasks) > 0:
        # run all jobs
            job_group = group(tasks)
            promise = job_group()
            with allow_join_result():
                result = promise.get() #join
                # run mitigation on success
                mitigate_jobs = models.MitigateIndicatorJob.objects.filter(organization_id=organization_id,
                                                                indicator_type=instance.ind_type).all()
                if len(mitigate_jobs) > 0:
                    for m in mitigate_jobs:
                        indicatorjob.delay(m.id, i, organization_id=organization_id,
                                           model="MitigateIndicatorJob", model_version="MitigateIndicatorJobVersion")

@shared_task(bind=True)
def indicatorjob(self,
                 id,
                 indicator_id,
                 organization_id=None,
                 dir_ind_script=DIRINDSCRIPT,
                 script_indicator_job=SCRIPT_INDICATOR_JOB,
                 dir_ind_job_venv=DIRINDJOBVENV,
                 model="StandardIndicatorJob",
                 model_version="StandardIndicatorJobVersion"
                 ):
    """

    :param id:
    :param indicator: str - value field
    :param organization_id:
    :return:
    """

    task = self.request.id.__str__()
    _indicatorjob(task,
                  id,
                  indicator_id,
                  dir_ind_script,
                  script_indicator_job,
                  dir_ind_job_venv,
                  model=model,
                  model_version=model_version)


def _indicatorjob(task,
                  id,
                  indicator_id,
                  dir_ind_script=DIRINDSCRIPT,
                  script_indicator_job=SCRIPT_INDICATOR_JOB,
                  dir_ind_job_venv=DIRINDJOBVENV,
                  model="StandardIndicatorJob",
                  model_version = "StandardIndicatorJobVersion"):
    job = getattr(models, model).objects.get(id=id)
    indicator = models.Indicator.objects.get(id=indicator_id)
    user = models.UserIntStream.objects.get(pk=job.user.id)
    job_version = None
    try:
        job_version = getattr(models, model_version).objects.get(job=job, active=True)
    except exceptions.ObjectDoesNotExist as e:
        logger.warning("no active version for job: " + str(id) + "; " + str(e))
        return

    tokens = get_tokens_for_user(user)
    # can't create dirs here.  race conditions
    script = _create_job_script_path(job_version, dir_ind_script, script_indicator_job, create=False)
    venv_directory = _create_virtual_env(job_version, dir_ind_job_venv, aws_req=False, create=False)

    job_args = "" if job_version.job.arguments is None else job_version.job.arguments
    path_python = os.path.join(venv_directory,"bin","python")
    proc = None
    try:
        args = [
            path_python,
            script,
            "--indicator",
            indicator.value,
            ]
        if len(job_args) > 0:
            args.extend(job_args.split(" "))
        proc = subprocess.run(args,
            env={
                "JOB_SERVER_URL": job_version.job.server_url,
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
            logger.info("indicator job: " + job.name + " failed; stderr: " + proc.stderr.replace('\n', ';').replace('\r', '') +
                        "; stdout: " + proc.stdout.replace('\n', ';').replace('\r', ''))
        log = models.IndicatorJobLog(organization=job_version.organization,
                                     job=job,
                                     task_id=task,
                                     return_status_code=proc.returncode,
                                     stdout=proc.stdout,
                                     stderr=proc.stderr)
        log.save()

    except TimeoutError:
        proc.kill()
        outs, errs = proc.communicate()
        log = models.IndicatorJobLog(organization=job_version.organization,
                                     job=job,
                                     task_id=task,
                                     return_status_code=proc.returncode,
                                     stdout=outs,
                                     stderr=errs)
        log.save()
        logger.info("indicator job: " + job.name + " timeout; stderr: " + proc.stderr.replace('\n', ';').replace('\r', '') +
                        "; stdout: " + proc.stdout.replace('\n', ';').replace('\r', ''))

@shared_task(bind=True)
def job(self, id=None, organization_id=None):

    task = self.request.id.__str__()
    _job(task, id, organization_id)

def get_expire(refresh_token):
    refresh_parts = refresh_token.split(".")
    refresh_header=base64.urlsafe_b64decode(refresh_parts[0].encode('ascii')+b'===')
    refresh_payload=base64.urlsafe_b64decode(refresh_parts[1].encode('ascii')+b'===')
    refresh_sig=base64.urlsafe_b64decode(refresh_parts[2].encode('ascii')+b'===')
    return json.loads(refresh_payload)['exp']

def _job(task, id, organization_id):
    job = models.Job.objects.get(id=id)
    user = models.UserIntStream.objects.get(pk=job.user.id)
    job_version = models.JobVersion.objects.get(active=True, job=job)
    tokens = get_tokens_for_user(user)
    # can't  create virtual env here. race conditions
    script = _create_job_script_path(job_version, DIRJOBSCRIPT, SCRIPT_JOB, create=False)
    venv_directory = _create_virtual_env(job_version, DIRJOBVENV, aws_req=False, create=False)

    job_version = models.JobVersion.objects.get(id=job_version.id)
    job_args = job_version.job.arguments
    path_python = os.path.join(venv_directory,"bin","python")
    proc = None
    script = [path_python, script]
    if job_args != "":
        script.extend(job_args.split(" "))
    try:
        proc = subprocess.run(script,
            env={
                "JOB_REFRESH": tokens["refresh"],
                "JOB_ACCESS": tokens["access"],
                "JOB_SERVER_URL": job_version.job.server_url,
                "VIRTUAL_ENV": venv_directory,
                "PATH": os.path.join(venv_directory, "bin") + ":" + os.environ["PATH"],
                 },
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            encoding="utf-8",
            timeout=job.timeout)

        if proc.returncode != 0:
            logger.error("job: " + job.name + " failed; stderr: " + proc.stderr.replace('\n', ';').replace('\r', '') +
                        "; stdout: " + proc.stdout.replace('\n', ';').replace('\r', ''))


        log = models.JobLog(organization=job_version.organization,
                            task_id=task,
                            job=job_version.job,
                            return_status_code=proc.returncode,
                            stdout=proc.stdout,
                            stderr=proc.stderr)
        log.save()
    except TimeoutError:
        proc.kill()
        outs, errs = proc.communicate()
        log = models.JobLog(organization=job_version.organization,
                            task_id=task,
                                     job=job_version.job,
                                     return_status_code=proc.returncode,
                                     stdout=outs,
                                     stderr=errs)
        log.save()
        logger.error("job: " + job.name + " timeout; stderr: " + proc.stderr.replace('\n', ';').replace('\r', '') +
                        "; stdout: " + proc.stdout.replace('\n', ';').replace('\r', ''))


CUSTOM_TRAIN_FILE = "train_classify.py"


@shared_task(bind=True)
def task_create_job_script_path(self, jobversion_id, create=True, organization_id=None):
    jobversion = models.JobVersion.objects.get(id=jobversion_id)
    task_id = self.request.id.__str__()
    jobversion.task_create_script_path = task_id
    jobversion.save()
    _create_job_script_path(jobversion, DIRJOBSCRIPT, SCRIPT_JOB, create=create)

@shared_task(bind=True)
def task_create_indicator_job_script_path(self,
                                          jobversion_id,
                                          create=True,
                                          organization_id=None,
                                          model="StandardIndicatorJobVersion",
                                          dir=DIRINDSCRIPT,
                                          script_indicator_job=SCRIPT_INDICATOR_JOB):
    jobversion = getattr(models, model).objects.get(id=jobversion_id)
    task_id = self.request.id.__str__()
    jobversion.task_create_script_path = task_id
    jobversion.save()
    _create_job_script_path(jobversion, dir, script_indicator_job, create=create)

def _create_job_script_path(jobversion, dir, file, create=True):

    directory = os.path.join(dir, str(jobversion.id))
    if not os.path.exists(directory) and create:
        try:
            pathlib.Path(directory).mkdir(parents=True)
            archive = tarfile.open(jobversion.zip.path, 'r:gz')
            tmp = archive.extractfile(file)
            with open(os.path.join(directory, file), "wb") as f:
                f.write(tmp.read())
                f.flush()
        except Exception as e:
            shutil.rmtree(directory)
            raise e
        except tarfile.ReadError as e:
            logger.error("create job script path failed:" + job.name + " failed; " + str(e).replace('\n', ';').replace('\r', ''))
            log = models.JobLog(organization=jobversion.organization,
                                         job=jobversion.job,
                                         return_status_code=1,
                                         stdout='',
                                         stderr=str(e))
            log.save()
            raise e
    return os.path.join(directory, file)


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
        #todo(aj)
        ind_type = models.IndicatorType.objects.get(name=settings.IPV4)
        ip, _ = models.IndicatorIPV4.objects.get_or_create(
            value=i,
            organization=organization,
            ind_type=ind_type)
        ip.articles.add(article)
        jobs = models.StandardIndicatorJob.objects.filter(indicator_types__name=settings.IPV4,
                                                  organization=organization,
                                                  active=True)
        for job in jobs:
            indicatorjob.delay(job.id,
                               ip.id,
                               organization_id=organization_id)

    ipv6s = iocextract.extract_ipv6s(text)
    for i in ipv6s:
        try:
            ind_type = models.IndicatorType.objects.get(name=settings.IPV6)
            ip, _ = models.IndicatorIPV6.objects.get_or_create(value=i,
                                                               organization=organization,
                                                               ind_type=ind_type)
            ip.articles.add(article)
            jobs = models.StandardIndicatorJob.objects.filter(indicator_types__name=settings.IPV6,
                                                      organization=organization,
                                                      active=True)
            for job in jobs:
                indicatorjob.delay(job.id,
                                   ip.id,
                                   organization_id=organization_id)
        except db.DataError as e:
            logger.error("ip: " + str(i) + "; " + str(e))

    urls = iocextract.extract_urls(text, refang=True)
    for i in urls:
        # todo  load extra suffixes from models.suffixes
        subdomain, dom, suff = domain.extract(i)
        try:
            if suff != "":
                ind_type = models.IndicatorType.objects.get(name=settings.NETLOC)
                suffix = models.Suffix.objects.get(value=suff)
                instance, _ = models.IndicatorNetLoc.objects.get_or_create(subdomain=subdomain,
                                            domain=dom,
                                            suffix=suffix,
                                            ind_type=ind_type,
                                            organization=organization)

                instance.articles.add(article)
                jobs = models.StandardIndicatorJob.objects.filter(indicator_types__name=settings.NETLOC,
                                                          organization=organization,
                                                          active=True)
                for job in jobs:
                    indicatorjob.delay(job.id,
                                       instance.id,
                                       organization_id=organization_id)
        except exceptions.ObjectDoesNotExist as e:
            logger.error("domain: " + i + "; " + str(e))

    md5s = iocextract.extract_md5_hashes(text)
    for i in md5s:
        ind_type = models.IndicatorType.objects.get(name=settings.MD5)
        md5, _ = models.IndicatorMD5.objects.get_or_create(value=i,
                                                           organization=organization,
                                                           ind_type=ind_type)
        md5.articles.add(article)

        jobs = models.StandardIndicatorJob.objects.filter(indicator_types__name=settings.MD5,
                                                  organization=organization,
                                                  active=True)
        for job in jobs:
            indicatorjob.delay(job.id,
                               md5.id,
                               organization_id=organization_id)

    sha1s = iocextract.extract_sha1_hashes(text)
    for i in sha1s:
        ind_type = models.IndicatorType.objects.get(name=settings.SHA1)
        sha1, _= models.IndicatorSha1.objects.get_or_create(value=i,
                                    organization=organization,
                                    ind_type=ind_type)
        sha1.save()
        sha1.articles.add(article)
        jobs = models.StandardIndicatorJob.objects.filter(indicator_types__name=settings.SHA1,
                                                  organization=organization,
                                                  active=True)
        for job in jobs:
            indicatorjob.delay(job.id,
                               sha1.id,
                               organization_id=organization_id)

    sha256s = iocextract.extract_sha256_hashes(text)
    for i in sha256s:

        ind_type = models.IndicatorType.objects.get(name=settings.SHA256)
        sha256, _ = models.IndicatorSha256.objects.get_or_create(value=i, organization=organization, ind_type=ind_type)
        sha256.save()
        sha256.articles.add(article)
        jobs = models.StandardIndicatorJob.objects.filter(indicator_types__name=settings.SHA256,
                                                  organization=organization,
                                                  active=True)
        for job in jobs:
            indicatorjob.delay(job.id,
                               sha256.id,
                               organization_id=organization_id)

@shared_task()
def extract_indicators(text, article_id, organization_id=None):
    """

    :param text: str
    :param article_id: int
    :param organization_id: int
    :return:
    """
    _extract_indicators(text, article_id, organization_id)


@shared_task()
def process_rss_source(source_url, source_id, organization_id=None):
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
            extract_indicators.delay(text=ser.data["clean_text"],
                                     article_id=ser.instance.id,
                                     organization_id=ser.instance.organization.id)


    predict.delay(article_ids=articles,
                  source_id=source_id,
                  organization_id=organization_id)


def _predict(article_ids=None, source_id=None, organization_id=None):
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
def predict(article_ids, source_id, organization_id=None):
    _predict(article_ids, source_id, organization_id)


@shared_task()
def process_rss_sources(organization_id=None):
    _process_rss_sources(organization_id)

@shared_task()
def process_rss_sources_all(organization_id=None):
    orgs = models.Organization.objects.all()
    ids = [i.id for i in orgs]
    for i in ids:
        process_rss_sources.delay(organization_id=i)


def _process_rss_sources(organization_id):
#todo unit test
   #generate
    # 1. model_version dir
    # 2. script dir
    # 3. venv dir

    sources = models.RSSSource.objects.filter(active=True).filter(organization_id=organization_id)
    for source in sources:
        logger.info("source:" + source.name)
        process_rss_source.delay(
            source_url=source.url,
            source_id=source.id,
            organization_id=source.organization_id
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
                organization_id=None
                ):
    trainer = train.DeployPySparkScriptOnAws(model=model,
                s3_bucket_logs=s3_bucket_logs,
                s3_bucket_temp_files=s3_bucket_temp_files,
                region=region,
                aws_access_key_id=aws_access_key_id,
                aws_secret_access_key_id=aws_secret_access_key_id,
                task=self.request.id)

    trainer.upload()



def classify(text_list, model_version_id):
    """
    :param text_list: list[str]
    :param model_version_id: int
    :return:
    """
    model_directory = os.path.join(MODEL, str(model_version_id))
    model_version = models.ModelVersion.objects.get(id=model_version_id)
    # create model dir
    if not os.path.exists(model_directory):
        model_tar = tarfile.open(mode="r:gz", fileobj=model_version.file)
        try:
            model_tar.extractall(path=model_directory)
        except Exception as e:
            if os.path.exists(model_directory):
                shutil.rmtree(model_directory)
            raise e

    full_model_dir = os.path.join(model_directory,settings.MODEL_FOLDER)

    # check if dirs exist if not create them.
    # There are race condition problems with doing this here.  multiple classify calls clobber each other.
    # will need to rely on training creating directory
    script_directory, venv_directory = create_classify_dirs(model_version.training_script_version, create=False)

    json_data = {"classifier":full_model_dir, "text": text_list}
    path_python = os.path.join(venv_directory, "bin", "python")
    script = os.path.join(script_directory, BASE_CLASSIFY_FILE)
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

def create_classify_dirs(training_script_version, create=True):
    """
    :param training_script_version: models.TrainingScriptVersion
    :return:
    """
    script_dir = create_classif_script_directory(training_script_version, create=create)
    virtualenv_dir = _create_virtual_env(training_script_version, DIRCLASSIFVENV, aws_req=True, create=create)
    return script_dir, virtualenv_dir



#todo unit test
def create_classif_script_directory(training_script_version, create=True):
    """
    :param training_script_version: models.TrainingScriptVersion
    :return:
    """
    directory = os.path.join(DIRCLASSIFSCRIPT, str(training_script_version.id))
    if not os.path.exists(directory) and create:
        try:
            pathlib.Path(directory).mkdir(parents=True)
            base_script = os.path.join(settings.AWS_TRAIN_FILES, BASE_CLASSIFY_FILE)
            copyfile(base_script,os.path.join(directory,BASE_CLASSIFY_FILE))
            archive = tarfile.open(training_script_version.zip.path, 'r:gz')

            tmp = archive.extractfile(CUSTOM_CLASSIFY_FILE)
            with open(os.path.join(directory, CUSTOM_CLASSIFY_FILE),"wb") as f:
                f.write(tmp.read())
                f.flush()
        except Exception as e:
            shutil.rmtree(directory)
            raise e
    return directory

@shared_task(bind=True)
def task_create_job_virtual_env(self, version_id, aws_req=False, create=True, organization_id=None):
    version = models.JobVersion.objects.get(id=version_id)
    task_id = self.request.id.__str__()
    version.task_create_virtual_env = task_id
    version.save()
    _create_virtual_env(version, DIRJOBVENV, aws_req=aws_req, create=create)

@shared_task(bind=True)
def task_create_indicator_job_virtual_env(self,
                                          version_id,
                                          aws_req=False,
                                          create=True,
                                          organization_id=None,
                                          model="StandardIndicatorJobVersion",
                                          dir=DIRINDJOBVENV):
    version = getattr(models, model).objects.get(id=version_id)
    task_id = self.request.id.__str__()
    version.task_create_virtual_env = task_id
    version.save()

    _create_virtual_env(version, dir, aws_req=aws_req, create=create)

def _create_virtual_env(version, base_dir, aws_req=False, create=True):
    """
    generate virtual env in dir for models
    :param training_script_version: models.TrainingScriptVersion
    :return:
    """
    proxy = os.environ.get(INTSTREAM_PROXY_ENV, None)
    directory = os.path.join(base_dir, str(version.id))

    if not os.path.exists(directory) and create:
        try:
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
            if aws_req: #install extra requirements
                respip = subprocess.run([os.path.join(directory,"bin/python"),
                                  "-m",
                                  "pip",
                                  "install",
                                  "-r",
                                  os.path.join(settings.AWS_TRAIN_FILES, "requirements.txt")],
                               env=env,
                               stdout=subprocess.PIPE,
                               stderr=subprocess.PIPE)
                logger.info("pip stderr: " + str(respip.stderr))
                logger.info("pip stdout: " + str(respip.stdout))
            if res.returncode != 0:
                raise Pip

            REQ = "requirements.txt"
            archive = tarfile.open(version.zip.path, 'r:gz')
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
    return directory


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


def _remove_old_articles(organization_id=None):
    startdate = _now(tz=datetime.timezone.utc)
    monthprior = startdate - datetime.timedelta(days=30)
    # delete articles not used for classifications for freemium accounts older than 1 month
    old_articles = models.RSSArticle.objects.filter(organization__freemium=True,
                                                    organization_id=organization_id,
                                                 upload_date__lt=monthprior,
                                                 classification__isnull=True).iterator()
    [i.delete() for i in old_articles]
    old_articles = models.TxtArticle.objects.filter(organization__freemium=True,
                                                    organization_id=organization_id,
                                                 upload_date__lt=monthprior,
                                                 classification__isnull=True).iterator()
    [i.delete() for i in old_articles]
    old_articles = models.HtmlArticle.objects.filter(organization__freemium=True,
                                                     organization_id=organization_id,
                                                 upload_date__lt=monthprior,
                                                 classification__isnull=True).iterator()
    [i.delete() for i in old_articles]
    old_articles = models.PDFArticle.objects.filter(organization__freemium=True,
                                                    organization_id=organization_id,
                                                 upload_date__lt=monthprior,
                                                 classification__isnull=True).iterator()
    [i.delete() for i in old_articles]


@shared_task()
def remove_old_articles(organization_id=None):
    _remove_old_articles(organization_id=organization_id)

@shared_task()
def remove_old_articles_all(organization_id=None):
    """
    :param self:
    :param organization_id: this is set to 1 so results can be saved
    :return:
    """
    orgs = models.Organization.objects.filter(freemium=True)
    ids = [i.id for i in orgs]
    for i in ids:
        remove_old_articles.delay(organization_id=i)

#todo refactor into one method for task and another for function to allow unit testing of function
@shared_task(bind=True)
def train_model(
        self,
        model,
        metric,
        s3_bucket_logs,
        s3_bucket_temp_files,
        region,
        aws_access_key_id,
        aws_secret_access_key_id,
        training_script_folder,
        ec2_key_name,
        logging_level=logging.DEBUG,
        extra_kwargs='',
        organization_id=None
        ):
    _train_model(
                self=self,
                model=model,
                metric=metric,
                s3_bucket_logs=s3_bucket_logs,
                s3_bucket_temp_files=s3_bucket_temp_files,
                region=region,
                aws_access_key_id=aws_access_key_id,
                aws_secret_access_key_id=aws_secret_access_key_id,
                training_script_folder=training_script_folder,
                ec2_key_name=ec2_key_name,
                logging_level=logging_level,
                extra_kwargs=extra_kwargs,
                organization_id=organization_id)

def _train_model(self,
                model,
                metric,
                s3_bucket_logs,
                s3_bucket_temp_files,
                region,
                aws_access_key_id,
                aws_secret_access_key_id,
                training_script_folder,
                ec2_key_name,
                logging_level=logging.DEBUG,
                extra_kwargs='',
                organization_id=None
                ):
    task = self.request.id.__str__()
    logger = get_task_logger(task)
    logger.setLevel(logging.DEBUG)
    formatter = TaskFormatter('%(asctime)s - %(task_id)s - %(task_name)s - %(name)s - %(levelname)s - %(message)s')

    # optionally logging on the Console as well as file
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)
    stream_handler.setLevel(logging_level)
    # Adding File Handle with file path. Filename is task_id
    log_name = os.path.join('/tmp/', task+'.log')
    task_handler = logging.FileHandler(log_name)
    task_handler.setFormatter(formatter)
    task_handler.setLevel(logging_level)
    logger.addHandler(stream_handler)
    logger.addHandler(task_handler)
    logger.info("test this is the message")
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
    org = Organization.objects.get(id=organization_id)
    training_script_object = models.TrainingScriptVersion.objects.get(
            script__active=True,
            active=True,
            organization__id=organization_id
            )

    model_version = ModelVersion(organization=org,
                                     model=model,
                                     task=task,
                                     version=trainer.job_name, # unique
                                     metric_name=metric,
                                     training_script_version=training_script_object)
    model_version.save()
    try:
        # insert job_id into model version
        # model, version, organization
        result = trainer.run(delete=False, status_callback=update_status)
        mversion = models.ModelVersion.objects.get(version=trainer.job_name)
        mversion.status = result.status
        mversion.save()
        script_directory, venv_directory = create_classify_dirs(model_version.training_script_version, create=True)
        if result.status == train.TrainResult.SUCCESS:
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




