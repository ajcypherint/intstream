from django.test import TestCase
from django.test import Client
from rest_framework import status
from unittest.mock import patch
from api import models
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
                "password": "somecomplexpass123",
                "password2": "somecomplexpass123"
                }
        r = self.c.post("/api/register/",data=data,headers=headers)
        self.assertEqual(r.status_code,status.HTTP_400_BAD_REQUEST)

    def test_passwords_not_match(self):
        self.c = Client()
        headers={"Content-Type":"application/json"}
        data = {"username": "test34",
                "organization_name": "SYSTEM",
                "first_name": "test",
                "last_name": "test",
                "email": "test34@test.com",
                "password": "somecomplexpass123",
                "password2": "nosomecomplexpass123"
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
                "password": "somecomplexpass123",
                "password2": "somecomplexpass123"
                }
        r = self.c.post("/api/register/",data=data,headers=headers)
        self.assertEqual(r.status_code,status.HTTP_400_BAD_REQUEST)

    @patch('api.views.EmailMessage')
    @patch('api.views.account_activation_token.check_token')
    @patch('api.views.account_activation_token.make_token')
    @patch('api.models.UserIntStream.objects.get')
    @patch('api.views.urlsafe_base64_decode')
    def test_success_register(self, base_64_decode, get_user, make_token, check_token, email_message):
        """
        is_superuser is set True
        :return:
        """
        class Message:
            def send(self):
                pass

        #just get the first user in the database
        get_user.return_value = models.UserIntStream.objects.get(pk=1)
        email_message.return_value = Message()
        TOKEN = "1"
        check_token.return_value = True
        make_token.return_value = TOKEN
        base_64_decode.return_value = TOKEN
        self.c = Client()
        headers={"Content-Type":"application/json"}
        data = {"username": "test23",
                "organization_name": "test",
                "first_name": "test",
                "last_name": "test",
                "email": "test@test.com",
                "password": "somecomplexpass123",
                "password2": "somecomplexpass123",
                }
        r = self.c.post("/api/register/",data=data,headers=headers)
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        r = self.c.get("/api/activate/1/"+TOKEN)
        self.assertEqual(r.status_code, status.HTTP_200_OK)



