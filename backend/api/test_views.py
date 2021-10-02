from django.test import TestCase
from django.test import Client
from rest_framework import status
from unittest import mock
from api import tasks
from api import models
import datetime
import json
import tempfile
import os
from django.conf import settings


class TestTasks(TestCase):
    fixtures = ['UserIntstream.json',
                'Organization.json',
                "MLModel.json",
                "ModelVersion.json",
                "RSSSource.json",
                "Source.json",
                "UploadSource.json",
                "TrainingScript.json",
                "TrainingScriptVersion.json"

                ]

    def setUp(self):
        self.username = "ubuntu"
        self.password = "hinton50"
        self.c = Client()
        headers = {"Content-Type":"application/json"}
        self.c.login(username=self.username,password=self.password)

    def test_mlmodel(self):
        source = models.Source.objects.all()[0]
        data1 = {"name": "test123", "active": True,
                "sources": [{"id":source.id, "name":source.name,
                             "active":source.active, "organization": source.organization.id}]}
        r = self.c.post("/api/mlmodels/", content_type="application/json",data=data1)
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)

    def test_integrity_error(self):
        data = {'value': 'ac'}
        r = self.c.post("/api/htmlarticles/", content_type="application/json", data=data)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_link(self):
        data = {"value": "0800fc577294c34e0b28ad2839435945"}
        r = self.c.post("/api/indicatormd5/", content_type="application/json", data=data)
        id = r.json().get("id")
        org = models.Organization.objects.get(id=1)
        source = models.RSSSource(url="http://test.com", organization=org)
        source.save()
        article = models.RSSArticle(text="some article text",
                                    link="https://test.com/test",
                                    description="testing",
                                    guid="test123455",
                                    organization=org,
                                    source=source)
        article.save()
        data = {"indicator_ids": [id]}
        r = self.c.post("/api/articles/" + str(article.id) + "/link/", content_type="application/json", data=data)

        link_article = models.Article.objects.get(id=article.id)
        self.assertEqual(link_article.indicator_set.count(), 1)

    def test_net_loc(self):
        suffix =  models.Suffix.objects.get(value="com").pk
        ind_type = models.IndicatorType.objects.get(name="NetLoc")
        data = {
            "subdomain":"testing",
            "domain":"mycompany",
            "suffix":suffix,
            "ind_type": ind_type
            }
        r = self.c.post("/api/indicatornetloc/", data=data)
        self.assertEqual(r.status_code, 201)

    def test_settings(self):
        data = {
            "aws_key": "test",
            "aws_secret": "test",
            "aws_s3_log_base": "test_log",
            "aws_s3_upload_base": "test_upload",
            "aws_region": "us-east"
        }
        r = self.c.post("/api/setting/", content_type="application/json", data=data)
        self.assertEqual(r.status_code, 201)
        data = {
            "aws_key": "test",
            "aws_secret": "test1",
            "aws_s3_log_base": "test_log",
            "aws_s3_upload_base": "test_upload",
            "aws_region": "us-east"
        }
        # strange bug with put
        r_put = self.c.put("/api/setting/" + str(r.data["id"]) + "/", content_type="application/json", data=data)
        self.assertEqual(r_put.status_code, 200)

    def test_upload_article(self):
        fake_article = """
        This is an article about something"""
        with tempfile.NamedTemporaryFile() as f:
            f.write(fake_article.encode("utf8"))
            f.flush()
            f.seek(0)

            r = self.c.post("/api/uploadarticle/",
                            data={
                             "file": f,
                             "type": "TXT",
                             "source": 1,
                             "title": "READ_TITLE"})

        self.assertEqual(r.status_code, 200)


    def test_upload_html_article(self):
        fake_article = """
        <h1>This is an article about something</h1>"""
        with tempfile.NamedTemporaryFile() as f:
            f.write(fake_article.encode("utf8"))
            f.flush()
            f.seek(0)

            r = self.c.post("/api/uploadarticle/",
                            data={
                             "file": f,
                             "type": "HTML",
                             "source": 1,
                             "title": "READ_TITLE"})

        self.assertEqual(r.status_code, 200)

    def test_upload_pdf_article(self):

        with open(os.path.join(settings.BASE_DIR,"sample_files/pdf-test.pdf"), "rb") as f:
            r = self.c.post("/api/uploadarticle/",
                            data={
                             "file": f,
                             "type": "PDF",
                             "source": 1,
                             "title": "READ_TITLE"})

        self.assertEqual(r.status_code, 200)

    def test_upload_docx_article(self):
        with open(os.path.join(settings.BASE_DIR,"sample_files/report_docx.docx"), "rb") as f:

            r = self.c.post("/api/uploadarticle/",
                            data={
                             "file": f,
                             "type": "DOCX",
                             "source": 1,
                             "title": "READ_TITLE"})

        self.assertEqual(r.status_code, 200)
