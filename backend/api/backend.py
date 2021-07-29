from django_filters import rest_framework as filters
from api import models
from django_celery_results import backends, managers
import json
import logging

LOG = logging.getLogger(__name__)
class DisabledHTMLFilterBackend(filters.DjangoFilterBackend):
    def to_html(self, request, queryset, view):
        return ""


class OrgDatabaseBackend(backends.DatabaseBackend):
    TaskModel = models.OrgTaskResultMdl

    def _store_result(self, task_id, result, status,
                      traceback=None, request=None, using=None):
        """Store return value and status of an executed task."""
        content_type, content_encoding, result = self.encode_content(result)
        _, _, meta = self.encode_content({
            'children': self.current_task_children(request),
        })

        task_name = getattr(request, 'task', None) if request else None
        task_args = getattr(request,
                            'argsrepr', getattr(request, 'args', None))
        task_kwargs = getattr(request, 'kwargsrepr', getattr(request, 'kwargs', None))
        task_kwargs_dict = getattr(request, "kwargs", {})
        worker = getattr(request, 'hostname', None)

        organization_id = task_kwargs_dict.get("organization_id", None)
        if organization_id is None:
            LOG.error("org is none; task_id: %s task_name: %s task_args %s task_kwargs: %s",
                      task_id, task_name, task_args, task_kwargs)
        self.TaskModel._default_manager.store_result_org(
            content_type, content_encoding,
            task_id, result, status,
            traceback=traceback,
            meta=meta,
            task_name=task_name,
            task_args=task_args,
            task_kwargs=task_kwargs,
            worker=worker,
            using=using,
            organization_id=organization_id
        )
        return result


class OrgTaskManager(managers.TaskResultManager):

    @managers.transaction_retry(max_retries=2)
    def store_result(self, content_type, content_encoding,
                     task_id, result, status,
                     traceback=None, meta=None,
                     task_name=None, task_args=None, task_kwargs=None,
                     worker=None, using=None, organization=None):
        """Store the result and status of a task.

        Arguments:
        ---------
            content_type (str): Mime-type of result and meta content.
            content_encoding (str): Type of encoding (e.g. binary/utf-8).
            task_id (str): Id of task.
            task_name (str): Celery task name.
            task_args (str): Task arguments.
            task_kwargs (str): Task kwargs.
            result (str): The serialized return value of the task,
                or an exception instance raised by the task.
            status (str): Task status.  See :mod:`celery.states` for a list of
                possible status values.
            worker (str): Worker that executes the task.
            using (str): Django database connection to use.

        Keyword Arguments:
        -----------------
            traceback (str): The traceback string taken at the point of
                exception (only passed if the task failed).
            meta (str): Serialized result meta data (this contains e.g.
                children).
            exception_retry_count (int): How many times to retry by
                transaction rollback on exception.  This could
                happen in a race condition if another worker is trying to
                create the same task.  The default is to retry twice.

        """
        fields = {
            'status': status,
            'result': result,
            'traceback': traceback,
            'meta': meta,
            'content_encoding': content_encoding,
            'content_type': content_type,
            'task_name': task_name,
            'task_args': task_args,
            'task_kwargs': task_kwargs,
            'organization_id': organization,
            'worker': worker
        }
        obj, created = self.using(using).get_or_create(task_id=task_id,
                                                       defaults=fields)
        if not created:
            for k, v in items(fields):
                setattr(obj, k, v)
            obj.save(using=using)
        return obj
