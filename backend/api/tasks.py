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
from utils import vector, read
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
                  articles_id,
                  articles_text,
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
    threshold = .70

    article.source_id = source_id
    article.organization_id=organization_id
    article.save()
    # check that there are historical articles
    if len(articles_text) > 0:
        articles_text.append(read.HTMLRead(article.text).read())
        tfidf = vectorizer.fit_transform(articles_text)
        from sklearn.metrics.pairwise import linear_kernel
        cosine_similarities = linear_kernel(tfidf[-1], tfidf[0:-1]).flatten()
        parent_ids= sorted(np.array(articles_id)[cosine_similarities > threshold])
        if len(parent_ids) > 0:
            parent = parent_ids[-1]
            parent_article = models.Article.objects.get(pk=parent)
            article.parent = parent_article
            article.save()



#@shared_task
def process_rss_source(source_url, source_id, organization_id):
    """
    will launch them async
    :param source_url: str
    :param source_id: int
    :return:
    """
    previous_week = timezone.now()-datetime.timedelta(days=7)
    articles = models.Article.objects.filter(upload_date__gt=previous_week,
                                             parent__isnull=True,
                                             organization=organization_id)
    article_ids = [article.id for article in articles]
    article_text = [read.HTMLRead(article.text).read() for article in articles]
    data = feedparser.parse(source_url)
    logger.debug("source_url:" + str(source_url))
    for post in data.entries:
        if "id" not in post.keys():
            if "guid" in post.keys():
                post["id"]=post.guid
            else:
                post["id"]=post.title[0:100]+source_url[0:100]
        logger.debug("post id:" + str(post.id))
        exists = models.RSSArticle.objects.filter(guid=post.id,
                                                  organization=organization_id).exists()
        if not exists:
            process_entry.delay(post.title,
                                post.description,
                                post.id,
                                post.link,
                                source_id,
                                article_ids,
                                article_text,
                                organization_id
                                )



#@shared_task(base=Singleton)
@shared_task()
def process_rss_sources():
    sources = models.RSSSource.objects.all()
    for source in sources:
        logger.debug("source:" + source.name)
        process_rss_source(source.url,source.id,source.organization_id)


