import logging
import tempfile
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
import django
django.setup()
from api.models import ModelVersion
from django.core.files import File

from utils import train
from api.models import ModelVersion, MLModel, Organization
MODEL=2
ORGANIZATION=1
METRIC="f1"

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
# create file handler which logs even debug messages
# create console handler with a higher log level
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
# create formatter and add it to the handlers
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
# add the handlers to logger
logger.addHandler(ch)
# in view initiate trainer.  send back job_name so it can be used to query websocket
# pass trainer into celery.
trainer = train.DeployPySparkScriptOnAws(model=MODEL,
                                         s3_bucket_logs="intstream-train-log",
                                         s3_bucket_temp_files="intstream-train-upload",
                                         region="us-east-1",
                                         aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID",""),
                                         aws_secret_access_key_id=os.environ.get("AWS_SECRET_ACCESS_KEY",""),
                                         training_script_folder="uuid-original-default",
                                         ec2_key_name="CypherInt-Master-Key",
                                         metric=METRIC, #possible metric f1,recall,precision
                                        )
try:
    #insert job_id into model version
    # model, version, organization
    model = MLModel.objects.get(id=MODEL)
    org = Organization.objects.get(id=ORGANIZATION)
    model_version = ModelVersion(organization=org,
                                 model=model,
                                 version=trainer.job_name,
                                 metric_name=METRIC)
    model_version.save()
    #todo(aj) pass in callback callback(job_name, status)
    # upserts the database with jobname
    result = trainer.run(delete=False)
    temp_dir = tempfile.TemporaryDirectory()

    # download model
    trainer.download_dir(os.path.join(trainer.job_name,trainer.MODEL_NAME),temp_dir.name,trainer.s3_bucket_temp_files)
    temp_file = tempfile.NamedTemporaryFile(suffix=".tar.gz")
    trainer.make_tarfile(temp_file.name,os.path.join(temp_dir.name,trainer.job_name,trainer.MODEL_NAME))
    with open(temp_file.name, "rb") as f:
        model_version.file=File(f,os.path.basename(f.name))
        model_version.save()

    # download metric
    temp_metric_file = tempfile.NamedTemporaryFile()
    trainer.download_metric(temp_metric_file.name)
    with open(temp_metric_file.name,encoding="ascii") as f:
        value = f.read()
        model_version.metric_value=float(value)
        model_version.save()

    # just here to see if we throw exception
    i = 1
    # temp_file.name = model file tar.gz
    # temp_metric_file.name = metric file
    # todo (aj) update model,metric, to db
finally:
    #cleanup
    trainer.remove_temp_files(trainer.sync_s3)


