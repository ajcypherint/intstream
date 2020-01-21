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
@shared_task
def add(x,y):
    return x + y

@shared_task
def train_model():
    pass

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
    # todo(aj) hard coded clean_html and clean_hashes for now
    vectorizer = vector.StemmedTfidfVectorizer(decode_error="ignore",
                                               clean_html=True,
                                               clean_hashes=True)

    response = requests.get(post_link)
    article = models.RSSArticle(
        title=post_title,
        description=post_description,
        guid=post_id,
        link=post_link,
        text=response.text
        )
    # todo(aj) hardcoded for now
    settings = models.Setting.objects.filter(organization=organization_id).first()
    if not settings or settings.threshold is None:
        threshold = .7
    else:
        threshold = settings.threshold

    article.source_id = source_id
    article.organization_id=organization_id
    article.save()


#@shared_task
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
                post["id"] = post.guid[0:180] + str(organization_id)
            else:
                post["id"] = post.title[0:80] + source_url[0:100] + str(organization_id)
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



#@shared_task(base=Singleton)
@shared_task()
def process_rss_sources():
    sources = models.RSSSource.objects.filter(active=True).all()
    for source in sources:
        logger.debug("source:" + source.name)
        process_rss_source(source.url,source.id,source.organization_id)


@shared_task(bind=True)
def train_model(model,
                s3_bucket_logs,
                s3_bucket_temp_files,
                s3_region,
                aws_access_key_id,
                aws_secret_access_key_id,
                ):
    trainer = train.DeployPySparkScriptOnAws(model=model,
                s3_bucket_logs=s3_bucket_logs,
                s3_bucket_temp_files=s3_bucket_temp_files,
                s3_region=s3_region,
                aws_access_key_id=aws_access_key_id,
                aws_secret_access_key_id=aws_secret_access_key_id,
                task = self.request.id)

    trainer.run()
