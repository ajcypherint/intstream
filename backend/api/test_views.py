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
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
