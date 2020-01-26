import logging
logging.basicConfig(level=logging.DEBUG)
LOG = logging.getLogger(__name__)
LOG.info("starting")
LOG.warning("here")
import django
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

LOG.info("after django")
from utils import train

model = 1

trainer = train.DeployPySparkScriptOnAws(model=1,
                                         s3_bucket_logs="intstream-train-log",
                                         s3_bucket_temp_files="intstream-train-upload",
                                         s3_region="us-east-1",
                                         aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID",""),
                                         aws_secret_access_key_id=os.environ.get("AWS_SECRET_ACCESS_KEY",""),
                                         training_script="base_train_file.py",
                                         task = None,
                                         ec2_key_name="CypherInt-Master-Key"
                                        )
trainer.run()


