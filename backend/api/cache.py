from django.core.cache import caches
from rest_framework import throttling


class CustomAnonRateThrottle(throttling.AnonRateThrottle):
    cache = caches['throttling']