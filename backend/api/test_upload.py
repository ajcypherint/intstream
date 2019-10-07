from django.test import TestCase
from django.test import Client
from rest_framework import status
# Create your tests here.


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

    def test_upload_html(self):
        file = open('./sample_files/report_html.html','rb')
        data = {'source':1,'title':'test','file':file}
        r = self.c.post("/api/htmlarticles/",data=data)
        self.assertEqual(r.status_code,status.HTTP_201_CREATED)

    def test_upload_txt(self):
        file = open('./sample_files/report_text.txt','rb')
        data = {'source':1,'title':'test','file':file}
        r = self.c.post("/api/txtarticles/",data=data)
        self.assertEqual(r.status_code,status.HTTP_201_CREATED)

    def test_upload_pdf(self):
        file = open('./sample_files/pdf-test.pdf','rb')
        data = {'source':1,'title':'test','file':file}
        r = self.c.post("/api/pdfarticles/",data=data)
        self.assertEqual(r.status_code,status.HTTP_201_CREATED)

    def test_upload_docx(self):
        file = open('./sample_files/report_docx.docx','rb')
        data = {'source':1,'title':'test','file':file}
        r = self.c.post("/api/docxarticles/",data=data)
        self.assertEqual(r.status_code,status.HTTP_201_CREATED)

