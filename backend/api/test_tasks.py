from django.test import TestCase
from django.test import Client
from unittest import mock
from api import tasks
from api import models
import datetime


class MockResponse():
    def __init__(self):
        self.text = """
// ===BEGIN ICANN DOMAINS===

// ac : https://en.wikipedia.org/wiki/.ac
ac
com.ac
edu.ac
gov.ac
net.ac
mil.ac
org.ac

// ad : https://en.wikipedia.org/wiki/.ad
ad
nom.ad 
// ===BEGIN PRIVATE DOMAINS===
"""

    def raise_for_status(self):
        pass


def mock_get(url):
    return MockResponse()


class PostResp(object):
    def __init__(self):
        self.text = "sample"


def post_get(url):
    return PostResp()


async def fetch(url):
    return "test text"


class TestTasks(TestCase):
    fixtures = ['UserIntstream.json',
                'Organization.json',
                "MLModel.json",
                "ModelVersion.json",
                "RSSSource.json",
                "Source.json",
                "JobSource.json",
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

    @mock.patch("api.tasks._now")
    def test_remove_old_articles(self, now):
        #fake date way in future as current date for remove_articles function
        now.return_value = datetime.datetime(3000,1,1, tzinfo=datetime.timezone.utc)
        source = models.Source.objects.get(id=1)
        organization = models.Organization.objects.get(id=1)
        article = models.Article(source=source,
                                 text="test test",
                                 title="test test",
                                 organization=organization
                                 )
        article.save()
        tasks._remove_old_articles()
        #todo mock datetime.datetime.now return last year
        articles = models.Article.objects.all()
        self.assertEqual(articles.count(), 0)


    def test_extract_indicators(self):
        text = """
        192.168.9.1
        192[.]168[.]9[.]1
        http://test.com
        098f6bcd4621d373cade4e832627b4f6
        4468e5deabf5e6d0740cd1a77df56f67093ec943
        9123dcbb0b42652b0e105956c68d3ca2ff34584f324fa41a29aedd32b883e131
        2607:f0d0:1002:0051:0000:0000:0000:0004
        """
        source = models.Source.objects.get(id=1)
        organization = models.Organization.objects.get(id=1)
        article = models.Article(source=source,
                                 text="test test",
                                 title="test test",
                                 organization=organization
                                 )
        article.save()
        tasks.extract_indicators(text, article, organization)
        ipv4s = models.IndicatorIPV4.objects.all()
        self.assertEqual(len(ipv4s), 1)
        ipv6s = models.IndicatorIPV6.objects.all()
        self.assertEqual(len(ipv6s), 1)
        md5s = models.IndicatorMD5.objects.all()
        self.assertEqual(len(md5s), 1)
        sha1 = models.IndicatorSha1.objects.all()
        self.assertEqual(len(sha1), 1)
        sha256 = models.IndicatorSha1.objects.all()
        self.assertEqual(len(sha256), 1)
        urls = models.IndicatorUrl.objects.all()
        self.assertEqual(len(urls), 2)


    @mock.patch("api.tasks.classify")
    @mock.patch("api.tasks.fetch")
    @mock.patch("feedparser.parse")
    def test_process_rss_source(self,
                                feedparser_parse,
                                mock_fetch,
                                classify):
        classify.return_value = [True, True, True]
        mock_fetch.side_effect = fetch

        class DictAttr(dict):
            def __getattr__(self, key):
                if key not in self:
                    raise AttributeError(key)
                return self[key]

            def __setattr__(self, key, value):
                self[key] = value

            def __delattr__(self, key):
                del self[key]

        class Data(object):
            def __init__(self):
                self.entries = [
                            DictAttr(
                                id="x1",
                                title="test",
                                link="http://test.com",
                                description="test",
                            ),
                            DictAttr(
                                id="x2",
                                title="test2",
                                quid="test2x2",
                                link="http://test.com",
                                description="test"
                            ),
                            DictAttr(
                                title="test3x3",
                                link="http://test3.com/test/test3",
                                description="test"
                            )
                        ]

        data = Data()
        feedparser_parse.return_value = data
        tasks._process_rss_source("http:/test", 1, 1)

    @mock.patch("api.tasks.requests.get")
    def test_suffix_update(self, mock_get):
        mock_get.return_value = MockResponse()
        tasks._update_suffixes()
        self.assertEqual(mock_get.called, True)


    @mock.patch("api.tasks.process_rss_source.delay")
    @mock.patch("api.tasks.create_dirs")
    @mock.patch("tarfile.open")
    @mock.patch("os.path.exists")
    def test_process_rss_sources(self, exist, tar_open, create_dirs, process):
        exist.return_value = False
        tasks._process_rss_sources()

        class MockTar(object):
            def __init__(self):
                pass

            def extractall(self):
                pass

        m_open = MockTar()
        tar_open.return_value = m_open
        self.assertTrue(exist.called)
        self.assertTrue(tar_open.called)
        self.assertTrue(create_dirs.called)
        self.assertTrue(process.called)
