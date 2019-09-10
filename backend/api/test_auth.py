from django.test import TestCase
from django.test import Client
from rest_framework import status
# Create your tests here.


class TestPerms(TestCase):
    fixtures = ['initial.json']


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
