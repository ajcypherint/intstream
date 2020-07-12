import logging
import tempfile
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
import django
django.setup()
from api.models import ModelVersion
from django.core.files import File
from utils.train import TrainResult


from utils import train
from api.models import ModelVersion, MLModel, Organization, ModelVersion, TrainingScriptVersion
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
                                         logger=logger
                                        )
def update_status(job_name, status):
    """
    :param job_name: str
    :param status: str
    :return:
    """
    model_version = ModelVersion.objects.get(version=job_name)
    model_version.status=status
    model_version.save()


if __name__ == "__main__":
    model = MLModel.objects.get(id=MODEL)
    org = Organization.objects.get(id=ORGANIZATION)
    script = TrainingScriptVersion.objects.first()
    model_version = ModelVersion(organization=org,
                                 model=model,
                                 version=trainer.job_name,
                                 training_script_version=script,
                                 metric_name=METRIC)
    model_version.save()
    try:
        # insert job_id into model version
        # model, version, organization
        # todo(aj) pass in callback callback(job_name, status)
        # upserts the database with jobname
        result = trainer.run(delete=False, status_callback=update_status)
        model_version.status = result.status

        if result.status == TrainResult.SUCCESS:
            temp_dir = tempfile.TemporaryDirectory()

            # download model
            trainer.download_dir(os.path.join(trainer.job_name,trainer.MODEL_NAME),
                                 temp_dir.name,
                                 trainer.s3_bucket_temp_files)
            temp_file = tempfile.NamedTemporaryFile(suffix=".tar.gz")
            trainer.make_tarfile(temp_file.name, os.path.join(temp_dir.name, trainer.job_name, trainer.MODEL_NAME))
            with open(temp_file.name, "rb") as f:
                model_version.file=File(f,os.path.basename(f.name))
                model_version.save()

            # download metric
            temp_metric_file = tempfile.NamedTemporaryFile()
            trainer.download_metric(temp_metric_file.name)
            with open(temp_metric_file.name,encoding="ascii") as f:
                value = f.read()
                model_version.metric_value = float(value)
                model_version.save()
        else:
            model_version.status = "FAILED"
            model_version.save()
    except Exception as e:
        model_version.status="FAILED"
        model_version.save()
        raise e
    finally:
        # cleanup
        trainer.remove_temp_files(trainer.sync_s3)


