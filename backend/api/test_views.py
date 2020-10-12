from django.test import TestCase
from django.test import Client
from rest_framework import status
from unittest import mock
from api import tasks
from api import models
import datetime


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

    def test_integrity_error(self):
        data = {'value': 'ac'}
        r = self.c.post("/api/htmlarticles/", data=data)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_link(self):
        data = {"value": "0800fc577294c34e0b28ad2839435945"}
        r = self.c.post("/api/indicatormd5/", data=data)
        id = r.json().get("id")
        org = models.Organization.objects.all()[0]
        source = models.RSSSource(url="http://test.com", organization=org)
        source.save()
        article = models.RSSArticle(text="some article text",
                                    link="https://test.com/test",
                                    description="testing",
                                    guid="test123455",
                                    organization=org,
                                    source=source)
        article.save()
        data = {"indicator_ids": [id,id]}
        r = self.c.post("/api/articles/" + str(article.id) + "/link/", data=data)
        link_article = models.Article.objects.get(id=article.id)
        self.assertEqual(len(link_article.indicator_set.all()), 1)

