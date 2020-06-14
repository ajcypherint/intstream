from django.test import TestCase
from django.test import Client
from unittest.mock import patch
from api import tasks

class PostResp(object):
    def __init__(self):
        self.text = "sample"

def post_get(url):
    return PostResp()

class TestTasks(TestCase):
    fixtures = ['UserIntstream.json',
                'Organization.json',
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


