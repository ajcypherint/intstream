from django.test import TestCase
from django.test import Client
from unittest.mock import patch
from utils import train

class TestPerms(TestCase):
    fixtures = ['initial.json']

    def setUp(self):
        username = "ubuntu"
        password = "hinton50"
        self.c = Client()
        headers={"Content-Type":"application/json"}
        self.c.login(username=username,password=password)

    def test_train_run(self):
        pass
