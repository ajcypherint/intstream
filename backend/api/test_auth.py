from django.test import TestCase
from django.test import Client
from rest_framework import status
from unittest import mock
# Create your tests here.


class TestPerms(TestCase):
    fixtures = ['UserIntstream.json','Organization.json']


    def testIsAdmin(self):

        """
        is_superuser is set True
        :return:
        """
        username = "ubuntu"
        password = "hinton50"
        self.c = Client()
        headers={"Content-Type":"application/json"}
        self.c.login(username=username,password=password)
        data = {"name":"test"}
        r = self.c.post("/api/sourcesupload/",data=data,headers=headers)
        self.assertEqual(r.status_code,status.HTTP_201_CREATED)

    def testIsIntegrator(self):
        """
        is_integrator is set True
        :return:
        """
        username = "test"
        password = "hinton50"
        self.c = Client()
        headers={"Content-Type":"application/json"}
        data = {"name":"test"}
        self.c.login(username=username,password=password)
        r = self.c.post("/api/sourcesupload/",data=data,headers=headers)
        self.assertEqual(r.status_code,status.HTTP_201_CREATED)
        r = self.c.get("/api/sourcesupload/")
        self.assertEqual(r.status_code,status.HTTP_200_OK)

    def testIsAnalyst(self):
        """
        not is_superuser and not is_integrator
        :return:
        """
        username = "analyst"
        password = "hinton50"
        self.c = Client()
        headers={"Content-Type":"application/json"}
        self.c.login(username=username,password=password)
        r = self.c.post("/api/sourcesupload/",data={"name":"test"},headers=headers)
        self.assertEqual(r.status_code,status.HTTP_403_FORBIDDEN)
        r = self.c.get("/api/sourcesupload/")
        self.assertEqual(r.status_code,status.HTTP_200_OK)

    @mock.patch("api.permissions.settings.MAX_SOURCES", 0)
    def testFreemium(self):
        """
        test freemium limits for integrator
        :return:
        """
        # todo mock settings.max = 0
        username = "test"
        password = "hinton50"
        self.c = Client()
        headers={"Content-Type":"application/json"}
        self.c.login(username=username,password=password)
        r = self.c.post("/api/sources/",data={"name":"test2"},headers=headers)
        self.assertEqual(r.status_code,status.HTTP_403_FORBIDDEN)
