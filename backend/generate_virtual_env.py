import django
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from api.tasks import classify

res = classify("uuid-original-default",[["some text "], ["another string of text"]], 16)
print(res)

