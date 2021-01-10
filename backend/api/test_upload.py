from django.test import TestCase
from django.test import Client
from rest_framework import status
from unittest import mock
from api import models
# Create your tests here.


class TestUpload(TestCase):

    fixtures = ['UserIntstream.json',
                'Organization.json',
                "RSSSource.json",
                "Source.json",
                "UploadSource.json"
                ]

    def setUp(self):
        username = "ubuntu"
        password = "hinton50"
        self.c = Client()
        headers={"Content-Type":"application/json"}
        self.c.login(username=username,password=password)

    @mock.patch("api.views.tasks.extract_indicators")
    @mock.patch("api.views.tasks.predict")
    def test_upload_html(self, mock_predict, mock_extract_indicators):
        file = open('./sample_files/report_html.html', 'rb')
        data = {'source': 1, 'title': 'test', 'file':file}
        r = self.c.post("/api/htmlarticles/", data=data)
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertTrue(mock_predict.delay.called)
        # todo(aj) branch extract_indicators
        #self.assertTrue(mock_extract_indicators.delay.called)

    @mock.patch("api.views.tasks.extract_indicators")
    @mock.patch("api.views.tasks.predict")
    def test_upload_txt(self, mock_predict, mock_extract_indicators):
        file = open('./sample_files/report_text.txt','rb')

        data = {'source':1,'title':'test','file':file}

        r = self.c.post("/api/txtarticles/",data=data)
        self.assertEqual(r.status_code,status.HTTP_201_CREATED)
        self.assertTrue(mock_predict.delay.called)

    @mock.patch("api.views.tasks.extract_indicators")
    @mock.patch("api.views.tasks.predict")
    def test_upload_pdf(self, mock_predict, mock_extract_indicators):
        file = open('./sample_files/f1065.pdf','rb')
        data = {'source':1,'title':'test','file':file}
        r = self.c.post("/api/pdfarticles/",data=data)
        self.assertEqual(r.status_code,status.HTTP_201_CREATED)
        self.assertTrue(mock_predict.delay.called)

    @mock.patch("api.views.tasks.extract_indicators")
    @mock.patch("api.views.tasks.predict")
    def test_upload_docx(self, mock_predict, mock_extract_indicators):
        file = open('./sample_files/report_docx.docx','rb')
        data = {'source':1,'title':'test','file':file}
        r = self.c.post("/api/docxarticles/",data=data)
        self.assertEqual(r.status_code,status.HTTP_201_CREATED)
        self.assertTrue(mock_predict.delay.called)

