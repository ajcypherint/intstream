from celery import shared_task
import feedparser
import datetime
from . import models
import requests
from django.utils import timezone
from celery_singleton import Singleton
from celery.utils.log import get_task_logger
logger = get_task_logger(__name__)

@shared_task
def add(x,y):
    return x + y


@shared_task
def process_entry(post_title,
                  post_description,
                  post_id,
                  post_link,
                  source_id):
    response = requests.get(post_link)
    # check similar for the last 24 hours
    article = models.RSSArticle(
        title=post_title,
        description=post_description,
        quid=post_id,
        link=post_link,
        text=response.text
        )
    article.source_id = source_id
    article.save()
    previous_day= timezone.now()-datetime.timedelta(hours=-24)
    all_articles_previous_day = models.Article.objects.filter(upload_date__gt=previous_day)
    # pass all articles including this text to similar check;


@shared_task
def process_rss_source(source_url,source_id):
    """
    will launch them async
    :param feedname:
    :return:
    """
    previous_day= timezone.now()-datetime.timedelta(hours=24)
    logger.info("previous date: " + datetime.datetime.strftime(previous_day,"%m/%d/%Y, %H:%M:%S"))
    existing = models.RSSArticle.objects.filter(upload_date__gt=previous_day)
    guids = [object.guid for object in existing]
    logger.info("guids: " + str(guids))
    data = feedparser.parse(source_url)
    for post in data.entries:
        logger.info("post id:" + str(post.id))
        if post.id not in guids:
            process_entry.delay(post.title,
                                post.description,
                                post.id,
                                post.link,source_id)



@shared_task(base=Singleton)
def process_rss_sources():
    sources = models.RSSSource.objects.all()
    for source in sources:
        logger.info("source:" + source.name)
        process_rss_source.delay(source.url,source.id)


