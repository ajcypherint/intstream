from django.test import TestCase
from django.test import Client
from unittest import mock
from unittest.mock import patch
from api import tasks
import aiohttp


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
                "UploadSource.json"
                ]

    def setUp(self):
        username = "ubuntu"
        password = "hinton50"
        self.c = Client()
        headers={"Content-Type":"application/json"}
        self.c.login(username=username,password=password)


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
