from django.test import TestCase
from django.test import Client
from rest_framework import status
# Create your tests here.


class TestPerms(TestCase):
    fixtures = ['UserIntstream.json','Organization.json']

    def test_existing_user(self):
        self.c = Client()
        headers={"Content-Type":"application/json"}
        data = {"username": "test",
                "organization_name": "SYSTEM",
                "first_name": "test",
                "last_name": "test",
                "email": "test@test.com",
                "password": "somecomplexpass123"
                }
        r = self.c.post("/api/register/",data=data,headers=headers)
        self.assertEqual(r.status_code,status.HTTP_400_BAD_REQUEST)

    def test_existing_org(self):
        self.c = Client()
        headers={"Content-Type":"application/json"}
        data = {"username": "test34",
                "organization_name": "SYSTEM",
                "first_name": "test",
                "last_name": "test",
                "email": "test34@test.com",
                "password": "somecomplexpass123"
                }
        r = self.c.post("/api/register/",data=data,headers=headers)
        self.assertEqual(r.status_code,status.HTTP_400_BAD_REQUEST)

    def test_success_register(self):
        """
        is_superuser is set True
        :return:
        """
        self.c = Client()
        headers={"Content-Type":"application/json"}
        data = {"username": "test23",
                "organization_name": "test",
                "first_name": "test",
                "last_name": "test",
                "email": "test@test.com",
                "password": "somecomplexpass123"
                }
        r = self.c.post("/api/register/",data=data,headers=headers)
        self.assertEqual(r.status_code,status.HTTP_201_CREATED)
