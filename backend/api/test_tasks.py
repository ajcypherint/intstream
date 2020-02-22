from django.test import TestCase
from django.test import Client
from unittest.mock import patch
from api import tasks

class PostResp(object):
    def __init__(self):
        self.text = "sample"

def post_get(url):
    return PostResp

class TestPerms(TestCase):
    fixtures = ['initial.json']

    def setUp(self):
        username = "ubuntu"
        password = "hinton50"
        self.c = Client()
        headers={"Content-Type":"application/json"}
        self.c.login(username=username,password=password)
        data = {"name":"test"}
        r = self.c.post("/api/sourcesupload/",data=data,headers=headers)

    @patch("api.tasks.requests.get")
    def test_process_entry(self,get):
        get.side_effect=post_get
        res = tasks.process_entry(post_title="test",
                            post_description="test",
                            post_id=1,
                            post_link="http://testcom",
                            source_id=1,
                            organization_id=1)
        self.assertIsInstance(res.result, int)


