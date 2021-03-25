import math
import iocextract
from django.db import models as db_models
from django.utils.encoding import force_bytes
from django.utils import timezone
from api.backend import DisabledHTMLFilterBackend
from rest_framework import mixins
from django.core.mail import EmailMessage
from api.tokens import account_activation_token
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_text
from django_filters.widgets import CSVWidget
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.db.models.functions import Trunc
from django.template.loader import render_to_string
from django_rest_passwordreset import views as drpr_views
import urllib.parse as urlparse
from django.core import exceptions
from . import tasks
from urllib.parse import urlencode
from random import randint
from dateutil.parser import parse
from . import serializers
from . import models
from django_celery_results.models import TaskResult as TaskResultMdl
from rest_framework import filters as rest_filters
from rest_framework import status, generics, mixins
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from api.cache import CustomAnonRateThrottle
from django_filters import rest_framework as filters
from django_filters.groups import CombinedGroup
from utils.document import TXT, PDF, WordDocx
from rest_framework import permissions as drfpermissions
from . import permissions
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import viewsets
from django.db.models import F, Func, Window, Q, Case, When
from django.conf import settings
import itertools
from utils import vector, read
from scipy.cluster import  hierarchy
import json
from rest_framework import mixins
from django.views import View
from django.shortcuts import render
from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse

from django_rest_passwordreset.signals import reset_password_token_created

from django.conf import settings

MAX_CLUSTER = 200

class MLModelFilter(filters.FilterSet):
    modelversion__isnull = filters.BooleanFilter(field_name="modelversion",
                                                 lookup_expr="isnull",
                                                 distinct=True)
    class Meta:
        model = models.MLModel
        fields = ('id','name','created_date','train_lock','modelversion__isnull','active')


class SourceTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.SourceType.objects.all()
    serializer_class = serializers.SourceTypeSerializer


class SourceFilter(filters.FilterSet):
    article___upload_date__gte = filters.IsoDateTimeFilter(field_name="article__upload_date",lookup_expr="gte")
    article___upload_date__lte = filters.IsoDateTimeFilter(field_name="article__upload_date", lookup_expr="lte")
    article = filters.NumberFilter(field_name="article__id")

    indicator___upload_date__gte = filters.IsoDateTimeFilter(field_name="article__indicator__upload_date",lookup_expr="gte")
    indicator___upload_date__lte = filters.IsoDateTimeFilter(field_name="article__indicator__upload_date", lookup_expr="lte")
    indicator = filters.NumberFilter(field_name="article__indicator__id")

    class Meta:
        model = models.Source
        fields = ('id','name','active',"mlmodel")


class RandomUnclassified(APIView):

    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)

    model = openapi.Parameter('model',
                            in_=openapi.IN_QUERY,
                            required=True,
                            description="model id",
                            type=openapi.TYPE_INTEGER)
    response = openapi.Response('articles',
            openapi.Schema( type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(type=openapi.TYPE_OBJECT,
                                     properties={
                                        "title":openapi.Schema(type=openapi.TYPE_STRING),
                                         "clean_text":openapi.Schema(type=openapi.TYPE_STRING)
                                    })))
    error = openapi.Response("detail",
                             openapi.Schema(
                                type=openapi.TYPE_STRING,
                             ))
    @swagger_auto_schema(manual_parameters=[model], responses={200:response,404:error})
    def get(self, request, format=None):
        # todo(aj) filter by model id
        # either pass in source ids list to filter by or double nested
        model_id = self.request.query_params["model"]
        count = models.Article.objects.filter(organization=self.request.user.organization,
                                             classification=None,
                                              source__mlmodel=int(model_id)).count()
        if count == 0:
            return Response({"error":"no articles found for model " + str(model_id)},status.HTTP_404_NOT_FOUND)
        random_index = randint(0, count - 1)
        object = models.Article.objects.filter(organization=self.request.user.organization,
                                             classification=None,
                                               source__mlmodel=int(model_id))[random_index]
        serial = serializers.ArticleSerializer(models.Article.objects.filter(id=object.id),many=True)
        return Response(serial.data)


class ClassifPageFilterSetting(filters.FilterSet):
    start_upload_date = filters.IsoDateTimeFilter(field_name='upload_date', lookup_expr='gte')
    end_upload_date = filters.IsoDateTimeFilter(field_name='upload_date', lookup_expr='lte')
    class Meta:
        model = models.Article
        fields = ("source","source__active",
                  "classification__mlmodel__modelversion__active",
                  "classification__mlmodel",
                  "classification__target",
                  "classification__mlmodel__active"
                  )
        groups = [
                # many to many: must be grouped to work
                CombinedGroup(["classification__mlmodel", "classification__target","classification__mlmodel__active"])
        ]


class ClassifPageFilter(mixins.ListModelMixin, viewsets.GenericViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.ClassifFilterSerializer
    filterset_class = ClassifPageFilterSetting
    filter_backends = (DisabledHTMLFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)

    def get_queryset(self):
        return models.Article.objects.filter(organization=self.request.user.organization).\
            order_by("source__id",
                     "classification__mlmodel__id",
                     "classification__target",
                     "classification__mlmodel__active",
                    ).\
            distinct("source__id",
                    "classification__mlmodel__id",
                    "classification__target",
                    "classification__mlmodel__active",
                     ).\
            values("source__name",
                   "source__id",
                   "source__active",
                   "classification__mlmodel__name",
                   "classification__mlmodel__id",
                   "classification__target",
                   "classification__mlmodel__active",
                   ).\
            annotate(name=F("source__name"),
                 id=F("source__id"),
                 active=F("source__active"),
                  mlmodel = F("classification__mlmodel__name"),
                  mlmodel_id=F("classification__mlmodel__id"),
                  mlmodel_active=F("classification__mlmodel__active"),
                  target=F("classification__target")
                    )


class HomeFilterSetting(filters.FilterSet):
    start_upload_date = filters.IsoDateTimeFilter(field_name='upload_date', lookup_expr='gte', distinct=True)
    end_upload_date = filters.IsoDateTimeFilter(field_name='upload_date', lookup_expr='lte', distinct=True)
    source = filters.NumberFilter(field_name="source", distinct=True)
    prediction__mlmodel = filters.NumberFilter(field_name="prediction__mlmodel", distinct=True)
    prediction__target = filters.BooleanFilter(field_name="prediction__target", distinct=True)
    class Meta:
        fields = (
            "start_upload_date",
            "end_upload_date",
            "source",
            "prediction__mlmodel",
            "prediction__target"
        )
        model = models.Article
        groups = [
                # many to many: must be grouped to work
                CombinedGroup(["prediction__mlmodel", "prediction__target"])
        ]


class HomeFilter(mixins.ListModelMixin, viewsets.GenericViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.HomeFilterSerializer
    filterset_class = HomeFilterSetting
    filter_backends = (DisabledHTMLFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)

    def get_queryset(self):
        return models.Article.objects.filter(organization=self.request.user.organization).\
            annotate(
                      upload_dt=Trunc("upload_date", "hour"),
                      ).\
            values("source__name",
                   "source__id",
                   "source__active",
                   "upload_dt",
                   "prediction__mlmodel__name",
                   "prediction__mlmodel__id",
                   "prediction__target",
                   "prediction__mlmodel__active",
                   ).distinct()


def set_query_params(url, page):
    url_parts_next = list(urlparse.urlparse(url))
    nextpage_query_param = dict(urlparse.parse_qsl(url_parts_next[4]))
    params = {'page': page}
    nextpage_query_param.update(params)
    url_parts_next[4] = urlencode(nextpage_query_param)
    next_full_uri = urlparse.urlunparse(url_parts_next)
    return next_full_uri


class Upload(APIView):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)


    response = openapi.Response('model_info',
            openapi.Schema( type=openapi.TYPE_OBJECT,
                            properties={
                                    "job_id":openapi.Schema(type=openapi.TYPE_STRING),
                                    }))
    mlmodel = openapi.Parameter('mlmodel',
                            in_=openapi.IN_BODY,
                            required=True,
                            description="start date",
                            type=openapi.TYPE_STRING,)
    error = openapi.Response("error",
                             openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                 properties={
                                     "error":openapi.Schema(type=openapi.TYPE_STRING)
                                 }

                             ))

    @swagger_auto_schema(operation_description="create training job", manual_parameters=[mlmodel], responses={200:response,404:error})
    def post(self, request, format=None):
        if "mlmodel" not in self.request.data.keys():
            return Response({"detail":"mlmodel is required"}, status=status.HTTP_400_BAD_REQUEST)
        org = self.request.user.organization
        aws_settings = models.Setting.objects.filter(organization=org).get()
        result = tasks.upload_docs.delay(
                              model=self.request.data["mlmodel"],
                              s3_bucket_logs=aws_settings.aws_s3_log_base,
                              s3_bucket_temp_files=aws_settings.aws_s3_upload_base,
                              region=aws_settings.aws_region,
                              aws_access_key=aws_settings.aws_key,
                              aws_secret_access_key=aws_settings.aws_secret,
                              organization_id=org.id
                              )
        return Response({"job_id":result.id},status.HTTP_200_OK)


class Train(APIView):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)

    response = openapi.Response('model_info',
            openapi.Schema( type=openapi.TYPE_OBJECT,
                            properties={
                                    "job_id":openapi.Schema(type=openapi.TYPE_STRING),
                                    }))
    mlmodel = openapi.Parameter('mlmodel',
                            in_=openapi.IN_BODY,
                            required=True,
                            description="model id",
                            type=openapi.TYPE_STRING,)
    script_directory = openapi.Parameter('script_directory',
                            in_=openapi.IN_BODY,
                            required=True,
                            description="train script directory",
                            type=openapi.TYPE_STRING,)
    metric_name = openapi.Parameter('metric_name',
                            in_=openapi.IN_BODY,
                            required=True,
                            description="f1, precision, recall, etc",
                            type=openapi.TYPE_STRING,)
    extra_kwargs = openapi.Parameter('extra_kwargs',
                            in_=openapi.IN_BODY,
                            required=True,
                            description="json of extra kwargs",
                            type=openapi.TYPE_OBJECT,)

    error = openapi.Response("error",
                             openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                 properties={
                                     "error":openapi.Schema(type=openapi.TYPE_STRING)
                                 }

                             ))

    @swagger_auto_schema(operation_description="create training job", manual_parameters=[mlmodel], responses={200:response,404:error})
    def post(self, request, format=None):
        REQ_FIELD = ["mlmodel","metric_name","script_directory","extra_kwargs"]
        for field in REQ_FIELD:
            if field not in self.request.data.keys():
                return Response({"detail":field + " is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            json.loads(self.request.data["extra_kwargs"])
        except json.JSONDecodeError as e:
            return Response({"detail":str(e)}, status=status.HTTP_400_BAD_REQUEST)
        org = self.request.user.organization
        aws_setings = None
        try:
            aws_settings = models.Setting.objects.filter(organization=org).get()
        except exceptions.ObjectDoesNotExist as e:
            return Response({"detail":"no aws settings configured"}, status=status.HTTP_400_BAD_REQUEST)
        result = tasks.train_model.delay(
                              model=self.request.data["mlmodel"],
                              metric=self.request.data["metric_name"],
                              s3_bucket_logs=aws_settings.aws_s3_log_base,
                              s3_bucket_temp_files=aws_settings.aws_s3_upload_base,
                              region=aws_settings.aws_region,
                              aws_access_key_id=aws_settings.aws_key,
                              aws_secret_access_key_id=aws_settings.aws_secret,
                              training_script_folder=self.request.data["script_directory"],
                              ec2_key_name=aws_settings.ec2_key_name,
                              extra_kwargs=self.request.data["extra_kwargs"],
                              organization_id=org.id
                              )
        return Response({"job_id":result.id},status.HTTP_200_OK)


class SignUpView(APIView):
    permission_classes = (drfpermissions.AllowAny,)
    authentication_classes = []

    email = openapi.Parameter('email',
                              in_=openapi.IN_BODY,
                              required=True,
                              description="email address",
                              type=openapi.TYPE_STRING
                              )
    username = openapi.Parameter('username',
                              in_=openapi.IN_BODY,
                              required=True,
                              description="username",
                              type=openapi.TYPE_STRING
                              )
    first_name = openapi.Parameter('first_name',
                              in_=openapi.IN_BODY,
                              required=True,
                              description="first name",
                              type=openapi.TYPE_STRING
                              )
    last_name = openapi.Parameter('last_name',
                              in_=openapi.IN_BODY,
                              required=True,
                              description="last name",
                              type=openapi.TYPE_STRING
                              )
    organization_name = openapi.Parameter('organization_name',
                              in_=openapi.IN_BODY,
                              required=True,
                              description="organization name",
                              type=openapi.TYPE_STRING
                              )
    password = openapi.Parameter('password',
                              in_=openapi.IN_BODY,
                              required=True,
                              description="password",
                              type=openapi.TYPE_STRING
                              )
    password2 = openapi.Parameter('password2',
                              in_=openapi.IN_BODY,
                              required=True,
                              description="password2",
                              type=openapi.TYPE_STRING
                              )

    response = openapi.Response('success',
            openapi.Schema( type=openapi.TYPE_OBJECT,
                            properties={
                                     "message":openapi.Schema(type=openapi.TYPE_STRING),
                                    }
                            )
                        )
    error = openapi.Response('success',
            openapi.Schema( type=openapi.TYPE_OBJECT,
                            )
                        )

    @swagger_auto_schema(manual_parameters=[email,
                                            username,
                                            first_name,
                                            last_name,
                                            organization_name,
                                            password], responses={200:response,400:error})
    def post(self, request, format=None):
        email = request.data.get("email", None)
        username = request.data.get("username", None)
        first_name = request.data.get("first_name", None)
        last_name = request.data.get("last_name", None)
        password = request.data.get("password", None)
        password2 = request.data.get("password2", None)
        org_name = request.data.get("organization_name", None)

        if password != password2:
           response = {
                    "password":["passwords do not match"],
                    "password2":["passwords do not match"]
            }
           return Response(response, status=status.HTTP_400_BAD_REQUEST)

        org_ser = serializers.OrganizationSerializer(data={"name":org_name})
        # if org ser is valid and
        if not org_ser.is_valid():
            response = {
                    "organization_name": org_ser.errors["name"]
            }
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

        num_users = models.UserIntStream.objects.filter(organization__name=org_name).count()
        org_exists_count = models.Organization.objects.filter(name=org_name).count()

        if org_exists_count == 0:
            try:
                org_ser.save()
            except IntegrityError as e:
                response = {
                    "organization": [str(e)]
                }
                return Response(response, status.HTTP_400_BAD_REQUEST)

        # if org exists and has no users or org didn't exist
        if (org_exists_count == 1 and num_users == 0) or org_exists_count == 0:
            user = serializers.UserSerializer(data={"username": username,
                                            "email": email,
                                            "password": password,
                                            "first_name": first_name,
                                            "last_name": last_name,
                                            "is_active": False,
                                            "is_staff": True,
                                            "is_integrator": True,
                                            "organization": org_ser.data.get("id")
                                            }
                                            )
            if not user.is_valid():
                response = {
                        "user": user.errors
                }
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            try:
                user.save()
            except IntegrityError as e:
                response = {
                    "user": [str(e)]
                }
                return Response(response, status.HTTP_400_BAD_REQUEST)

            current_site = get_current_site(request)
            subject = 'Activate Your Intstream Account'
            message = render_to_string('api/account_activation_email.html', {
                'first_name': user.instance.first_name,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.instance.pk)),
                'token': account_activation_token.make_token(user.instance),
            })
            email = EmailMessage(

                subject, message,from_email=settings.EMAIL_FROM, to=[user.instance.email]
            )
            email.send()

            response = {
                "message": "Please confirm your email to complete registration",
            }
            return Response(response, status.HTTP_201_CREATED)


class Activate(View):

    def get(self, request, uidb64, token):

        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = models.UserIntStream.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, exceptions.ObjectDoesNotExist):
            user = None
        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            context = {
                       "message": "Thank you for your email confirmation. Now you can login your account."}
            # todo: return template
            return render(request, "api/registration.html", context=context, status=status.HTTP_200_OK)
        else:
            context = {
                "message": "Activate link is invalid",
                        }
            # todo return template
            return render(request, "api/registration.html", context=context, status=status.HTTP_400_BAD_REQUEST)


class HomePage(APIView):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)

    prediction__mlmodel = openapi.Parameter('prediction__mlmodel',
                            in_=openapi.IN_QUERY,
                            required=True,
                            description="prediction mlmodel",
                            type=openapi.TYPE_STRING)

    start_date = openapi.Parameter('start_date',
                            in_=openapi.IN_QUERY,
                            required=True,
                            description="start date",
                            type=openapi.TYPE_STRING)

    end_date = openapi.Parameter('end_date',
                            in_=openapi.IN_QUERY,
                            required=True,
                            description="end date",
                            type=openapi.TYPE_STRING)

    threshold = openapi.Parameter('thresh',
                            in_=openapi.IN_QUERY,
                            required=True,
                            description="end date",
                            type=openapi.TYPE_INTEGER)


    source_id = openapi.Parameter('source_id',
                            in_=openapi.IN_QUERY,
                            required=True,
                            description="source_id",
                            type=openapi.TYPE_INTEGER)

    response = openapi.Response('articles',
            openapi.Schema( type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(type=openapi.TYPE_OBJECT,
                                     properties={
                                         "id":openapi.Schema(type=openapi.TYPE_INTEGER),
                                        "title":openapi.Schema(type=openapi.TYPE_STRING),
                                         "clean_text":openapi.Schema(type=openapi.TYPE_STRING),
                                    })))

    error = openapi.Response("error",
                             openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                 properties={
                                     "error":openapi.Schema(type=openapi.TYPE_STRING)
                                 }

                             ))

    def merge_values(self, values):
        grouped_results = itertools.groupby(values, key=lambda value: value['id'])
        merged_values = []
        for k, g in grouped_results:
            groups = list(g)
            merged_value = {}
            for group in groups:
                for key, val in group.items():
                    if not merged_value.get(key):
                        merged_value[key] = val
                    elif val != merged_value[key]:
                        if isinstance(merged_value[key], list):
                            if val not in merged_value[key]:
                                merged_value[key].append(val)
                        else:
                            old_val = merged_value[key]
                            merged_value[key] = [old_val, val]
            merged_values.append(merged_value)
        return merged_values

    def filter_matches(self,values,
                       source="",
                       start_upload_date="",
                       end_upload_date=""):
        new_values = []
        for i in values:
            if i["match"] is None:
                new_values.append(i)
            else:
                boolean_pred = []
                if source != "":
                    boolean_pred.append(i["match__source__id"] == int(source))
                if start_upload_date != "":
                    startdate = parse(start_upload_date)
                    boolean_pred.append(i["match__upload_date"] >= startdate)
                if end_upload_date != "":
                    enddate = parse(end_upload_date)
                    boolean_pred.append(i["match__upload_date"] <= enddate)
                if  all(boolean_pred):
                    new_values.append(i)
        return new_values

    @swagger_auto_schema(manual_parameters=[source_id,start_date,end_date,threshold], responses={200:response,400:error})
    def get(self, request, format=None):
        # todo(aj) filter by model id
        # either pass in source ids list to filter by or double nested
        prediction__mlmodel = self.request.query_params.get("prediction__mlmodel","")
        max_df = int(self.request.query_params.get("max_df",80)) / 100.0
        min_df = int(self.request.query_params.get("min_df",0)) / 100.0
        source_id = self.request.query_params.get("source","")
        source__active = self.request.query_params.get("source__active",True)
        start_date = self.request.query_params.get("start_upload_date","")
        end_date = self.request.query_params.get("end_upload_date","")
        order_by = self.request.query_params.get("ordering","id")
        order_by = "id" if order_by == "" else order_by
        page = int(self.request.query_params.get("page", 1))
        page = 1 if page == "" else page
        match_id = self.request.query_params.getlist("match")
        threshold = int(self.request.query_params.get("threshold",0))
        if not isinstance(threshold,int) :
            return Response({"detail":"threshold must be and integer"}, status=status.HTTP_400_BAD_REQUEST)
        if threshold > 100 or threshold < 0 :
            return Response({"detail":"threshold must between 0 and 100"}, status=status.HTTP_400_BAD_REQUEST)
        threshold = threshold / 100.0
        filter_kwargs = {}
        filter_kwargs["organization"] = self.request.user.organization
        filter_kwargs["source__active"] = True
        if prediction__mlmodel != "":
            filter_kwargs["prediction__mlmodel"] = prediction__mlmodel
            filter_kwargs["prediction__mlmodel__active"] = True
            filter_kwargs["prediction__target"] = True
        if source_id != "":
            filter_kwargs["source_id"] = source_id
        if start_date != "":
            filter_kwargs["upload_date__gte"] = start_date
        if end_date != "":
            filter_kwargs["upload_date__lte"] = end_date
        if len(match_id) != 0:
            filter_kwargs["match__in"] = match_id

        sql_no_cummulate = models.Article.objects.filter(
                                                    **filter_kwargs
                                                    ).\
            order_by("id").\
            select_related("source").values("upload_date",
                                             "source__name",
                                            "source__id",
                                             "title",
                                            "text",
                                             "id",
                                            )
        if len(sql_no_cummulate) == 0:
            response = {
            "count": 0,
            "results": [],
            "next": None,
            "previous": None,
            }
            return Response(response, status=status.HTTP_200_OK)
        vectorizer = vector.StemmedTfidfVectorizer( decode_error="ignore",
                                                    stemmer="english",
                                                   clean_html=True,
                                                   clean_hashes=True,
                                                    min_df=min_df,
                                                    max_df=max_df)
        all_results=[]
        if len(sql_no_cummulate) == 1:
             element = {"id":sql_no_cummulate[0]["id"],
                        "upload_date": sql_no_cummulate[0]["upload_date"],
                        "source__name":sql_no_cummulate[0]["source__name"],
                        "source": {"id":sql_no_cummulate[0]["source__id"],
                                   "name":sql_no_cummulate[0]["source__name"]},
                       "match":[],
                        "title": sql_no_cummulate[0]["title"]}
             all_results.append(element)

        if len(sql_no_cummulate) > 1:
            if threshold != 0:
                if len(sql_no_cummulate) > MAX_CLUSTER:
                    return Response({"detail":"Set MAX_DIFF to 0 or filter results; Max number of articles for clustering is " +
                                              str(MAX_CLUSTER)}, status=status.HTTP_400_BAD_REQUEST)
                tfidf = vectorizer.fit_transform([i["text"] for i in sql_no_cummulate])
                tfidf = tfidf.todense()
                Z = hierarchy.linkage(tfidf, "average", metric="cosine")
                C = hierarchy.fcluster(Z, threshold, criterion="distance")
                distinct_clusters = set(C)
                found_clusters = []
                all_results_cluster_indexes = {}
                for index, cluster_id in enumerate(C):
                    cluster_id = int(cluster_id)
                    if cluster_id not in found_clusters:
                        # use this for showing only level 1 down
                        element = {"id": sql_no_cummulate[index]["id"],
                                    "upload_date": sql_no_cummulate[index]["upload_date"],
                                    "source__name": sql_no_cummulate[index]["source__name"],
                                    "source": {"id": sql_no_cummulate[index]["source__id"],
                                               "name": sql_no_cummulate[index]["source__name"]},
                                   "match":[],
                                    "title": sql_no_cummulate[index]["title"]}
                        all_results.append(element)
                        found_clusters.append(cluster_id)
                        all_results_cluster_indexes[str(cluster_id)]=len(all_results)-1
                    else:
                        all_result_index = all_results_cluster_indexes[str(cluster_id)]
                        matched_id = sql_no_cummulate[index]["id"]
                        all_results[all_result_index]["match"].append(matched_id)
            else:
                for i,value in enumerate(sql_no_cummulate):
                     element = {"id": sql_no_cummulate[i]["id"],
                                "upload_date": sql_no_cummulate[i]["upload_date"],
                                "source__name": sql_no_cummulate[i]["source__name"],
                                "source": {"id": sql_no_cummulate[i]["source__id"],
                                           "name": sql_no_cummulate[i]["source__name"]},
                               "match":[],
                                "title": sql_no_cummulate[i]["title"]}
                     all_results.append(element)



        #results = [{"id":i.id,
        #            "upload_date":i.upload_date,
        #            "source__name":i.source.name,
        #            "title":i.title}
        #           for i in sql if i.id not in i.cum_child_articles]
        # check valid sort column
        VALID_ORDER = ["id","title","source__name","upload_date"]
        test_order_by = order_by[1:] if order_by[0] == "-" else order_by
        if test_order_by not in VALID_ORDER:
             return Response({"detail":"order_by: " + order_by + " not valid"}, status=status.HTTP_400_BAD_REQUEST)

        # sort the data returned by the queryset ;
        # cannot do in queryset because if the window function cannot be used in a when clause
        list_of_models=[]
        if order_by[0] != "-":
            list_of_models = sorted(all_results, key=lambda x: x[order_by])
        else:
            list_of_models = sorted(all_results, key=lambda x: x[test_order_by],reverse=True)

        # retrieve page slicing
        total_count = len(list_of_models)
        total_pages = math.ceil(total_count / settings.REST_FRAMEWORK["PAGE_SIZE"])

        if page > total_pages:
            return Response({"detail":"page: " + str(page) + " out of bounds"},status=status.HTTP_400_BAD_REQUEST)
        start_slice = (page - 1) * settings.REST_FRAMEWORK["PAGE_SIZE"]
        end_slice = (page * settings.REST_FRAMEWORK["PAGE_SIZE"])

        # next and previous page
        next = page + 1 if page + 1 <= total_pages else None
        previous = page - 1 if page - 1 != 0 else None

        # edit query param for page for next and previous
        FULL_URL = request.build_absolute_uri('?')
        ABSOLUTE_ROOT =  request.build_absolute_uri('/')[:-1].strip("/")
        ABSOLUTE_ROOT_URL =  request.build_absolute_uri('/').strip("/")
        url = request.build_absolute_uri()
        next_full_uri = None
        if next is not None:
            next_full_uri = set_query_params(url, next)

        prev_full_uri = None
        if previous is not None:
            prev_full_uri = set_query_params(url, previous)

        # set sliced data for page
        sliced = list_of_models[start_slice:end_slice]
        # get indicators for each article in sliced
        for i in sliced:
            i["indicator_set"] =  models.Indicator.objects.filter(articles__id=i["id"]).\
                values_list("id", flat=True)
        # replace match in serial.
        response = {
            "count": len(list_of_models),
            "results": sliced,
            "next": next_full_uri,
            "previous": prev_full_uri,

        }
        return Response(response, status=status.HTTP_200_OK)


class OrgViewSet(viewsets.ModelViewSet):

    def perform_create(self, serializer):
        serializer.save(organization = self.request.user.organization)

    def perform_update(self, serializer):
        instance = serializer.save(organization=self.request.user.organization)

class ColumnViewSet(viewsets.ModelViewSet):

    def perform_create(self, serializer):
        serializer.save(update_date=timezone.now(), organization = self.request.user.organization)

    def perform_update(self, serializer):
        instance = serializer.save(update_date=timezone.now(), organization=self.request.user.organization)


class TrainingScriptFilter(filters.FilterSet):
    class Meta:
        model = models.TrainingScript
        fields = ("id", "name", 'active')


class TrainingScriptViewSet(OrgViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyOrIsAdminIntegratorSameOrg,)
    serializer_class = serializers.TrainingScriptSerializer
    filter_backends = (DisabledHTMLFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ('id','name', 'active')
    filterset_class = TrainingScriptFilter

    def get_queryset(self):
        return models.TrainingScript.objects.filter(organization=self.request.user.organization)


class TrainingScriptVersionFilter(filters.FilterSet):
    class Meta:
        model = models.TrainingScriptVersion
        fields = ("id", 'script', "version", 'active')


class TrainingScriptVersionViewSet(OrgViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyOrIsAdminIntegratorSameOrg,)
    serializer_class = serializers.TrainingScriptVersionSerializer
    filter_backends = (DisabledHTMLFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ('id', 'script', 'version', 'active')
    filterset_class = TrainingScriptVersionFilter

    def get_queryset(self):
        # return scripts for org or where org is SYSTEM
        return models.TrainingScriptVersion.objects.filter(organization=self.request.user.organization)


class SourceViewSet(OrgViewSet):
    permission_classes = (permissions.SourcePermissions,)
    serializer_class = serializers.SourceSerializer
    filter_backends = (DisabledHTMLFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ('id','name','active','url')
    filterset_class = SourceFilter

    def get_queryset(self):
        return models.Source.objects.filter(organization=self.request.user.organization)


class NumberInFilter(filters.BaseInFilter, filters.NumberFilter):
    pass


class PredictionFilter(filters.FilterSet):
    article_id = filters.NumberFilter(field_name="article_id")
    class Meta:
        model = models.Prediction
        fields = ("target", "mlmodel", "organization", "article_id")


class PredictionViewSet(OrgViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)

    filter_backends = (DisabledHTMLFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    serializer_class = serializers.PredictionSerializer
    filterset_class = PredictionFilter

    def get_queryset(self):
        return models.Prediction.objects.filter(organization=self.request.user.organization)


class ClassificationFilter(filters.FilterSet):
    article_id_in = NumberInFilter(field_name="article_id", lookup_expr="in")
    article_id = filters.NumberFilter(field_name="article_id")

    class Meta:
        model = models.Classification
        fields = ('target', "mlmodel_id", "article_id", "article_id_in")


class ClassificationViewSet(OrgViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.ClassificationSerializer
    filterset_class = ClassificationFilter

    def get_queryset(self):
        return models.Classification.objects.filter(organization=self.request.user.organization)


class SettingsViewSet(OrgViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyStaff,)
    filter_backends = (DisabledHTMLFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    serializer_class = serializers.SettingSerializer

    def get_queryset(self):
        return models.Setting.objects.filter(organization=self.request.user.organization)


class RssFilter(filters.FilterSet):
    class Meta:
        model = models.RSSSource
        fields = ('id','name','url','active')


class RssSourceViewSet(OrgViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.RssSourceSerializer
    filter_backends = (DisabledHTMLFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ('id','name','active','url')
    filterset_class = RssFilter

    def get_queryset(self):
        return models.RSSSource.objects.filter(organization=self.request.user.organization)


class UploadSourceFilter(filters.FilterSet):
    class Meta:
        model = models.UploadSource
        fields = ('id','name','active')


class UploadSourceViewSet(OrgViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.UploadSourceSerializer
    filter_backends = (DisabledHTMLFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ('id','name','active')
    filterset_class = UploadSourceFilter

    def get_queryset(self):
        return models.UploadSource.objects.filter(organization=self.request.user.organization)


jobcols = ('id',
                  'name',
                  'active',
                  'last_run',
                  'last_status',
                  'arguments',
                  )


class JobFilter(filters.FilterSet):
    class Meta:
        model = models.Job
        fields = jobcols


class JobLogFilter(filters.FilterSet):
    class Meta:
        model = models.JobLog
        fields = ["organization", "job", "id"]


class JobLogViewSet(OrgViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.JobLogSerializer
    filter_backends = (DisabledHTMLFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ["organization", "job", "id"]
    filterset_class = JobLogFilter

    def get_queryset(self):
        return models.JobLog.objects.filter(organization=self.request.user.organization)


class IndicatorJobLogFilter(filters.FilterSet):
    class Meta:
        model = models.IndicatorJobLog
        fields = ["organization", "job", "id"]


class IndicatorJobLogViewSet(OrgViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.IndicatorJobLogSerializer
    filter_backends = (DisabledHTMLFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ["organization", "job", "id"]
    filterset_class = IndicatorJobLogFilter

    def get_queryset(self):
        return models.IndicatorJobLog.objects.filter(organization=self.request.user.organization)


class JobViewSet(OrgViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.JobSerializer
    filter_backends = (DisabledHTMLFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = jobcols
    filterset_class = JobFilter

    def get_queryset(self):
        return models.Job.objects.filter(organization=self.request.user.organization)


class JobVersionViewSet(OrgViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.JobVersionSerializer
    filter_backends = (DisabledHTMLFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ('job', 'id','version','active','job__active')

    def get_queryset(self):
        return models.JobVersion.objects.filter(organization=self.request.user.organization)

    def perform_create(self, serializer):
        instance = serializer.save(organization = self.request.user.organization)
        # todo(aj) add job id as part of the model to track the job that created the virtual env and script path
        tasks.task_create_job_script_path.delay(instance.id, create=True, organization_id=self.request.user.organization.id)
        tasks.task_create_job_virtual_env.delay(instance.id, aws_req=False, create=True, organization_id = self.request.user.organization.id)


class MLModelViewSet(OrgViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.MLModelSerializer
    filter_backends = (DisabledHTMLFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ('id','name','created_date','enabled')
    filterset_class = MLModelFilter

    def get_queryset(self):
        return models.MLModel.objects.filter(organization=self.request.user.organization)


ARTICLE_SORT_FIELDS =('id','source','title','upload_date', 'source__name')


class ArticleFilter(filters.FilterSet):
    source__name = filters.CharFilter(lookup_expr='exact')
    start_upload_date = filters.IsoDateTimeFilter(field_name='upload_date', lookup_expr='gte')
    end_upload_date = filters.IsoDateTimeFilter(field_name='upload_date', lookup_expr='lte')
    article_id_multi = filters.AllValuesMultipleFilter(field_name="id", lookup_expr="exact")
    #todo(aj) add combinedfilter https://rpkilby.github.io/django-filter/ref/groups.html

    ordering = filters.OrderingFilter(
        fields=[('source__name','source__name'),
                ('title','title'),
                ('upload_date','upload_date')]
    )

    class Meta:
        model = models.Article
        fields = ('id',
                  'source',
                  'title',
                  'upload_date',
                  'source__name',
                  'source__active',
                  "prediction__mlmodel",
                  "prediction__target",
                  "classification__mlmodel",
                  "classification__target",
                  )
        groups = [
                CombinedGroup(["prediction__mlmodel","prediction__target"]),
                CombinedGroup(["classification__mlmodel", "classification__target"])
        ]


class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.ArticleSerializer
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.OrderingFilter)
    filterset_class = ArticleFilter
    
    @action(methods=["post"],
            detail=True,
            permission_classes=[permissions.IsAuthandReadOnlyIntegrator]
            )
    def link(self, request, **kwargs):
        article_id = kwargs["pk"]
        indicator_ids = None
        indicator_ids = self.request.data.get("indicator_ids", None)
        if indicator_ids is None:
            return Response({"indicator_ids":"required"}, status=status.HTTP_400_BAD_REQUEST)
        if not isinstance(indicator_ids, list):
            return Response({"indicator_ids": "must be a list"}, status=status.HTTP_400_BAD_REQUEST)
        article = models.Article.objects.get(id=article_id)
        indicators = models.Indicator.objects.filter(id__in=indicator_ids).all()
        ids = [i.id for i in indicators]
        for i in indicators:
            article.indicator_set.add(i)
        return Response({"added": ids}, status=status.HTTP_200_OK)

    def get_queryset(self):
        return models.Article.objects.filter(organization=self.request.user.organization)


class RSSArticleFilter(filters.FilterSet):
    class Meta:
        model = models.RSSArticle
        fields = ARTICLE_SORT_FIELDS


class RSSArticleViewSet(viewsets.ModelViewSet):
    #todo(aj) delete put
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.RSSSerializer
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.OrderingFilter, rest_filters.SearchFilter)
    filterset_fields = ARTICLE_SORT_FIELDS
    filterset_class = RSSArticleFilter

    def perform_create(self, serializer):
        text = serializer.get_clean_text(serializer.instance)
        create_predict(self.request.data["source"], text, self.request.user.organization, serializer)

    def perform_update(self, serializer):
        instance = serializer.save(organization=self.request.user.organization)

    def get_queryset(self):
        return models.RSSArticle.objects.filter(organization=self.request.user.organization)


class RawArticleFilter(filters.FilterSet):
    class Meta:
        model = models.RawArticle
        fields = ARTICLE_SORT_FIELDS


class RawArticleViewSet(viewsets.ModelViewSet):
    #todo(aj) delete put
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    queryset = models.RawArticle.objects.all()
    serializer_class = serializers.RawSerializer
    filter_backends = (DisabledHTMLFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ARTICLE_SORT_FIELDS
    filterset_class = RawArticleFilter

    def perform_create(self, serializer):
        text = serializer.validated_data["text"]
        create_predict(self.request.data["source"], text, self.request.user.organization, serializer)

    def perform_update(self, serializer):
        instance = serializer.save(organization=self.request.user.organization)

    def get_queryset(self):
        return models.RawArticle.objects.filter(organization=self.request.user.organization)


class HtmlArticleFilter(filters.FilterSet):
    class Meta:
        model = models.HtmlArticle
        fields = ARTICLE_SORT_FIELDS


class HtmlArticleViewSet(viewsets.ModelViewSet):
    #todo(aj) delete put
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    queryset = models.HtmlArticle.objects.all()
    serializer_class = serializers.HtmlSerializer
    filter_backends = (DisabledHTMLFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ARTICLE_SORT_FIELDS
    filterset_class = HtmlArticleFilter

    def perform_create(self, serializer):
        instance = TXT(self.request.FILES['file'],self.request.data.encoding)
        text = instance.read()
        create_predict(self.request.data["source"], text, self.request.user.organization, serializer)

    def perform_update(self, serializer):
        instance = serializer.save(organization=self.request.user.organization)

    def get_queryset(self):
        return models.HtmlArticle.objects.filter(organization=self.request.user.organization)


class TxtArticleFilter(filters.FilterSet):
    class Meta:
        model = models.TxtArticle
        fields = ARTICLE_SORT_FIELDS


def create_predict(source, text, organization, serializer):
    source = models.Source.objects.get(id=source)
    serializer.save(source=source, text=text, organization=organization)
    clean_text = serializer.get_clean_text(serializer.instance)
    article_ids = [serializer.instance.pk]
    source_id = serializer.instance.source.id
    org_id = serializer.instance.organization.id
    tasks.predict.delay(article_ids, source_id, organization_id=org_id)
    if serializer.instance.source.extract_indicators:
        tasks.extract_indicators.delay(clean_text, serializer.instance.id, serializer.instance.organization.id)


class TxtArticleViewSet(viewsets.ModelViewSet):
    #todo(aj) delete put
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.TxtSerializer
    filter_backends = (DisabledHTMLFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ARTICLE_SORT_FIELDS
    filterset_class = TxtArticleFilter

    def perform_create(self, serializer):
        instance = TXT(self.request.FILES['file'],self.request.data.encoding)
        text = instance.read()
        create_predict(self.request.data["source"], text, self.request.user.organization, serializer)

    def perform_update(self, serializer):
        instance = serializer.save(organization=self.request.user.organization)

    def get_queryset(self):
        return models.TxtArticle.objects.filter(organization=self.request.user.organization)


class WordDocxArticleFilter(filters.FilterSet):
    class Meta:
        model = models.WordDocxArticle
        fields = ARTICLE_SORT_FIELDS


class WordDocxArticleViewSet(viewsets.ModelViewSet):
    #todo(aj) delete put
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    queryset = models.WordDocxArticle.objects.all()
    serializer_class = serializers.WordDocxSerializer
    filter_backends = (DisabledHTMLFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ARTICLE_SORT_FIELDS
    filterset_class = WordDocxArticleFilter

    def perform_create(self, serializer):
        instance = WordDocx(self.request.FILES['file'])
        text = instance.read()
        create_predict(self.request.data["source"], text, self.request.user.organization, serializer)

    def perform_update(self, serializer):
        instance = serializer.save(organization=self.request.user.organization)

    def get_queryset(self):
        return models.WordDocxArticle.objects.filter(organization=self.request.user.organization)


class PDFArticleFilter(filters.FilterSet):
    class Meta:
        model = models.PDFArticle
        fields = ARTICLE_SORT_FIELDS


class PDFArticleViewSet(viewsets.ModelViewSet):
    #todo(aj) delete put
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.PDFSerializer
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.OrderingFilter, rest_filters.SearchFilter)
    filterset_fields = ARTICLE_SORT_FIELDS
    filterset_class = PDFArticleFilter

    def perform_create(self, serializer):
        password = self.request.data.password if 'password' in self.request.data else ''
        instance = PDF(self.request.FILES['file'], password=password)
        text = instance.read()
        create_predict(self.request.data["source"], text, self.request.user.organization, serializer)

    def perform_update(self, serializer):
        instance = serializer.save(organization=self.request.user.organization)

    def get_queryset(self):
        return models.PDFArticle.objects.filter(organization=self.request.user.organization)


class ArticleTypeViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    queryset = models.ArticleType.objects.all()
    serializer_class = serializers.ArticleTypeSerializer


class UserSingleViewSet(viewsets.GenericViewSet,
                        mixins.ListModelMixin,
                        mixins.RetrieveModelMixin):
    serializer_class = serializers.UserSerializer

    @action(detail=True,methods=['post'], permission_classes=[permissions.IsAuthor])
    def set_password(self, request, pk=None):
        user = request.user
        serializer=serializers.UserSerializerUpdate(user,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'status':'password set'},status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        """
        limited to single user info only
        :return:
        """
        return models.UserIntStream.objects.filter(id=self.request.user.id)


class UserViewSet(viewsets.GenericViewSet,
                  mixins.ListModelMixin,
                  mixins.RetrieveModelMixin):
    """ userinfo on login """
    permission_classes = (permissions.IsAuthandReadOnly,)
    serializer_class = serializers.UserSerializer

    def get_queryset(self):
        return models.UserIntStream.objects.filter(id=self.request.user.id).all()


class AllUserViewSet(viewsets.ModelViewSet):
    """
    All user view for super users
    """
    permission_classes = (permissions.IsAuthandSuperUser,)
    serializer_class = serializers.UserSerializer
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ("id",
                        "username",
                        "first_name",
                        "last_name",
                        "email",
                        "is_staff",
                        "is_integrator",
                        "organization")

    def get_queryset(self):
        return models.UserIntStream.objects.all()


class OrgUserViewSet(OrgViewSet):
    # org user view for staff members
    permission_classes = (permissions.IsAuthandReadOnlyStaff,)
    serializer_class = serializers.UserSerializer
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ("id",
                        "username",
                        "first_name",
                        "last_name",
                        "email",
                        "is_staff",
                        "is_integrator",
                        "organization")

    def perform_update(self, serializer):
        user = serializer.save(organization=self.request.user.organization)
        p = user.password
        user.set_password(p)
        user.save()
        return user


    def get_queryset(self):
        return models.UserIntStream.objects.filter(organization=self.request.user.organization).all()


class OrganizationViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthandSuperUser,)
    serializer_class = serializers.OrganizationSerializer
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ("id", "name")

    def get_queryset(self):
        return models.Organization.objects.filter(id=self.request.user.organization.id).all()


class AllOrganizationViewSet(viewsets.ModelViewSet):
    permission_classese = (permissions.IsAuthandSuperUser,)
    serializer_class = serializers.OrganizationSerializer
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ("id", "name")

    def get_queryset(self):
        return models.Organization.objects.all()


class TaskResultViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.IsAuthandReadOnly,)
    serializer_class = serializers.TaskResult
    filterset_fields = ("id", )

    #todo(aj) how to limit results to your org? use submit id? create a table linking org to task_id?
    def get_queryset(self):
        return TaskResultMdl.objects.all()


class IndicatorBaseViewSet(viewsets.ModelViewSet):

    def tasks(self, instance, jobs):
        for j in jobs:
            if isinstance(instance, list):
                for i in instance:
                    tasks.indicatorjob.delay(j.id, i.value, organization_id=i.organization.id)
            else:
                tasks.indicatorjob.delay(j.id, instance.value, organization_id=instance.organization.id)


class CharInFilter(filters.BaseInFilter, filters.CharFilter):
    pass


class NumInFilter(filters.BaseInFilter, filters.NumberFilter):
    pass


class IndicatorMD5Filter(filters.FilterSet):
    value__in = CharInFilter(field_name="value", lookup_expr="in")
    start_upload_date = filters.IsoDateTimeFilter(field_name='articles__upload_date', lookup_expr='gte', distinct=True)
    end_upload_date = filters.IsoDateTimeFilter(field_name='articles__upload_date', lookup_expr='lte', distinct=True)
    source = filters.NumberFilter(field_name="articles__source", distinct=True)
    prediction__mlmodel = filters.CharFilter(field_name="articles__prediction__mlmodel", distinct=True)
    article = filters.NumberFilter(field_name="articles__id", lookup_expr="exact")

    class Meta:
        model = models.IndicatorMD5
        fields = ('id', 'value',  "article", "value__in")


class IndicatorSha1Filter(filters.FilterSet):
    value__in = CharInFilter(field_name="value", lookup_expr="in")
    start_upload_date = filters.IsoDateTimeFilter(field_name='articles__upload_date', lookup_expr='gte', distinct=True)
    end_upload_date = filters.IsoDateTimeFilter(field_name='articles__upload_date', lookup_expr='lte', distinct=True)
    source = filters.NumberFilter(field_name="articles__source", distinct=True)
    prediction__mlmodel = filters.CharFilter(field_name="articles__prediction__mlmodel", distinct=True)
    article = filters.NumberFilter(field_name="articles__id", lookup_expr="exact")

    class Meta:
        model = models.IndicatorSha1
        fields = ('id', 'value', "article", "value__in")


class IndicatorSha256Filter(filters.FilterSet):
    value__in = CharInFilter(field_name="value", lookup_expr="in")
    start_upload_date = filters.IsoDateTimeFilter(field_name='articles__upload_date', lookup_expr='gte', distinct=True)
    end_upload_date = filters.IsoDateTimeFilter(field_name='articles__upload_date', lookup_expr='lte', distinct=True)
    source = filters.NumberFilter(field_name="articles__source", distinct=True)
    prediction__mlmodel = filters.CharFilter(field_name="articles__prediction__mlmodel", distinct=True)
    article = filters.NumberFilter(field_name="articles__id", lookup_expr="exact")

    class Meta:
        model = models.IndicatorSha256
        fields = ('id', 'value',  "article", "value__in")


class IndicatorIPV4Filter(filters.FilterSet):
    value__in = CharInFilter(field_name="value",lookup_expr="in")
    start_upload_date = filters.IsoDateTimeFilter(field_name='articles__upload_date', lookup_expr='gte', distinct=True)
    end_upload_date = filters.IsoDateTimeFilter(field_name='articles__upload_date', lookup_expr='lte', distinct=True)
    source = filters.NumberFilter(field_name="articles__source", distinct=True)
    prediction__mlmodel = filters.CharFilter(field_name="articles__prediction__mlmodel", distinct=True)
    article = filters.NumberFilter(field_name="articles__id", lookup_expr="exact")

    class Meta:
        model = models.IndicatorIPV4
        fields = ('id', 'value',  "article", "value__in")


class IndicatorEmailFilter(filters.FilterSet):
    value__in = CharInFilter(field_name="value", lookup_expr="in")
    start_upload_date = filters.IsoDateTimeFilter(field_name='articles__upload_date', lookup_expr='gte', distinct=True)
    end_upload_date = filters.IsoDateTimeFilter(field_name='articles__upload_date', lookup_expr='lte', distinct=True)
    source = filters.NumberFilter(field_name="articles__source", distinct=True)
    prediction__mlmodel = filters.CharFilter(field_name="articles__prediction__mlmodel", distinct=True)
    article = filters.NumberFilter(field_name="articles__id", lookup_expr="exact")

    class Meta:
        model = models.IndicatorEmail
        fields = ('id', 'value',  "article", 'value__in')


class IndicatorIPV6Filter(filters.FilterSet):
    value__in = CharInFilter(field_name="value", lookup_expr="in")
    start_upload_date = filters.IsoDateTimeFilter(field_name='articles__upload_date', lookup_expr='gte', distinct=True)
    end_upload_date = filters.IsoDateTimeFilter(field_name='articles__upload_date', lookup_expr='lte', distinct=True)
    source = filters.NumberFilter(field_name="articles__source", distinct=True)
    prediction__mlmodel = filters.CharFilter(field_name="articles__prediction__mlmodel", distinct=True)
    article = filters.NumberFilter(field_name="articles__id", lookup_expr="exact")

    class Meta:
        model = models.IndicatorIPV6
        fields = ('id', 'value',  "article", 'value__in')


class SuffixFilter(filters.FilterSet):
    value__in = CharInFilter(field_name="value", lookup_expr="in")

    class Meta:
        model = models.Suffix
        fields = ('id', 'value', 'value__in')




class IndicatorSha1ViewSet(IndicatorBaseViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.IndicatorSha1Serializer
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.SearchFilter)
    filterset_class = IndicatorSha1Filter

    def get_queryset(self):
        ind_type = models.IndicatorType.objects.get(name=settings.SHA1)
        return models.IndicatorSha1.objects.filter(
            ind_type=ind_type,
            organization=self.request.user.organization)

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True #bulk

        return super(IndicatorSha1ViewSet, self).get_serializer(*args, **kwargs)

    def perform_create(self, serializer):
        ind_type = models.IndicatorType.objects.get(name=settings.SHA1)
        instance = serializer.save(ind_type=ind_type, organization = self.request.user.organization)
        jobs = models.IndicatorJob.objects.filter(indicator_types__name=settings.SHA1).all()
        self.tasks(instance, jobs)

    def perform_update(self, serializer):
        instance = serializer.save(organization=self.request.user.organization)
        jobs = models.IndicatorJob.objects.filter(indicator_types__name=settings.SHA1).all()
        self.tasks(instance, jobs)



class IndicatorSha256ViewSet(IndicatorBaseViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.IndicatorSha256Serializer
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.SearchFilter)
    filterset_class = IndicatorSha256Filter

    def get_queryset(self):
        ind_type = models.IndicatorType.objects.get(name=settings.SHA256)
        return models.IndicatorSha256.objects.filter(
            ind_type=ind_type,
            organization=self.request.user.organization)

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True #bulk
        return super(IndicatorSha256ViewSet, self).get_serializer(*args, **kwargs)

    def perform_create(self, serializer):
        ind_type = models.IndicatorType.objects.get(name=settings.SHA256)
        instance = serializer.save(ind_type=ind_type, organization = self.request.user.organization)
        jobs = models.IndicatorJob.objects.filter(indicator_types__name=settings.SHA256).all()
        self.tasks(instance, jobs)

    def perform_update(self, serializer):
        instance = serializer.save(organization=self.request.user.organization)
        jobs = models.IndicatorJob.objects.filter(indicator_types__name=settings.SHA256).all()
        self.tasks(instance, jobs)


class NetLocFilter(filters.FilterSet):
    start_upload_date = filters.IsoDateTimeFilter(field_name='articles__upload_date', lookup_expr='gte', distinct=True)
    end_upload_date = filters.IsoDateTimeFilter(field_name='articles__upload_date', lookup_expr='lte', distinct=True)
    source = filters.NumberFilter(field_name="articles__source", distinct=True)
    prediction__mlmodel = filters.CharFilter(field_name="articles__prediction__mlmodel", distinct=True)

    domain__in = CharInFilter(field_name="domain",lookup_expr="in")
    subdomain__in = CharInFilter(field_name="subdomain",lookup_expr="in")
    suffix__in = CharInFilter(field_name="suffix__value",lookup_expr="in")

    article = filters.NumberFilter(field_name="articles__id", lookup_expr="exact")
    class Meta:
        model = models.IndicatorNetLoc
        fields = ('id',
                  'article',
                  'source',
                  'prediction__mlmodel',
                  'domain',
                  'subdomain',
                  'suffix__value',
                  'suffix',
                  'value',
                  "domain__in",
                  "subdomain__in",
                  "suffix__in")




class IndicatorNetLocViewSet(IndicatorBaseViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.IndicatorNetLocSerializer
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_class = NetLocFilter

    def get_queryset(self):
        ind_type = models.IndicatorType.objects.get(name=settings.NETLOC)
        return models.IndicatorNetLoc.objects.filter(
            ind_type=ind_type,
            organization=self.request.user.organization)

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True  # bulk
        return super(IndicatorNetLocViewSet, self).get_serializer(*args, **kwargs)

    def get_value(self):
        suffix = models.Suffix.get(id=self.request.POST["suffix"])
        subdomain = self.request.POST["subdomain"]
        subdomain = subdomain + "." if subdomain != "" else ""
        domain = self.request.POST["domain"]
        value = subdomain + domain + "." + suffix.value
        return value

    def perform_create(self, serializer):
        ind_type = models.IndicatorType.objects.get(name=settings.NETLOC)
        value = self.get_value()

        instance = serializer.save(ind_type=ind_type,
                                   value=value,
                                   organization=self.request.user.organization)
        jobs = models.IndicatorJob.objects.filter(indicator_types__name=settings.NETLOC).all()
        self.tasks(instance, jobs)

    def perform_update(self, serializer):
        ind_type = models.IndicatorType.objects.get(name=settings.NETLOC)
        value = self.get_value()
        instance = serializer.save(ind_type=ind_type,
                                   value=value,
                                   organization=self.request.user.organization)

        jobs = models.IndicatorJob.objects.filter(indicator_types__name=settings.NETLOC).all()
        self.tasks(instance, jobs)

class SuffixViewSet(OrgViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.SuffixSerializer
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.OrderingFilter, rest_filters.SearchFilter)
    filterset_class = SuffixFilter

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True  # bulk
        return super(SuffixViewSet, self).get_serializer(*args, **kwargs)

    def get_queryset(self):
        return models.Suffix.objects.all()



class IndicatorEmailViewSet(IndicatorBaseViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.IndicatorEmailSerializer
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_class = IndicatorEmailFilter

    def get_queryset(self):
        ind_type = models.IndicatorType.objects.get(name=settings.EMAIL)
        return models.IndicatorEmail.objects.filter(
            ind_type=ind_type,
            organization=self.request.user.organization)

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True #bulk
        return super(IndicatorEmailViewSet, self).get_serializer(*args, **kwargs)

    def perform_create(self, serializer):
        ind_type = models.IndicatorType.objects.get(name=settings.EMAIL)
        instance = serializer.save(ind_type=ind_type, organization = self.request.user.organization)
        jobs = models.IndicatorJob.objects.filter(indicator_types__name=settings.EMAIL).all()
        self.tasks(instance, jobs)

    def perform_update(self, serializer):
        instance = serializer.save(organization=self.request.user.organization)
        jobs = models.IndicatorJob.objects.filter(indicator_types__name=settings.EMAIL).all()
        self.tasks(instance, jobs)



class IndicatorIPV4ViewSet(IndicatorBaseViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.IndicatorIPV4Serializer
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_class = IndicatorIPV4Filter

    def get_queryset(self):
        ind_type = models.IndicatorType.objects.get(name=settings.IPV4)
        return models.IndicatorIPV4.objects.filter(
            ind_type=ind_type,
            organization=self.request.user.organization)

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True #bulk
        return super(IndicatorIPV4ViewSet, self).get_serializer(*args, **kwargs)

    def perform_create(self, serializer):
        ind_type = models.IndicatorType.objects.get(name=settings.IPV4)
        instance = serializer.save(organization = self.request.user.organization, ind_type=ind_type)
        jobs = models.IndicatorJob.objects.filter(indicator_types__name=settings.IPV4).all()
        self.tasks(instance, jobs)

    def perform_update(self, serializer):
        instance = serializer.save(organization=self.request.user.organization)
        jobs = models.IndicatorJob.objects.filter(indicator_types__name=settings.IPV4).all()
        self.tasks(instance, jobs)



class IndicatorIPV6ViewSet(IndicatorBaseViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.IndicatorIPV6Serializer
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_class = IndicatorIPV6Filter

    def get_queryset(self):
        ind_type = models.IndicatorType.objects.get(name=settings.IPV6)
        return models.IndicatorIPV6.objects.filter(
            ind_type=ind_type,
            organization=self.request.user.organization)

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True #bulk
        return super(IndicatorIPV6ViewSet, self).get_serializer(*args, **kwargs)

    def perform_create(self, serializer):
        ind_type = models.IndicatorType.objects.get(name=settings.IPV6)
        instance = serializer.save(ind_type=ind_type, organization = self.request.user.organization)
        jobs = models.IndicatorJob.objects.filter(indicator_types__name=settings.IPV6).all()
        self.tasks(instance, jobs)

    def perform_update(self, serializer):
        instance = serializer.save(organization=self.request.user.organization)
        jobs = models.IndicatorJob.objects.filter(indicator_types__name=settings.IPV6).all()
        self.tasks(instance, jobs)


class ModelVersionViewSet(OrgViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.ModelVersionSerializer
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ("id", "version","model__active", "model", "active")

    def get_queryset(self):
        return models.ModelVersion.objects.filter(model__organization=self.request.user.organization)

    def perform_update(self, serializer):
        instance = serializer.save(organization=self.request.user.organization)
        if instance.active:
            articles = models.Article.objects.filter(upload_date_gte=instance.train_start_date).all()
            for article in articles:
                tasks.predict.delay(articles=[article.id],
                                    organization=article.organization.id,
                                    source_id=article.source.id)




class IndicatorMD5ViewSet(IndicatorBaseViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.IndicatorMD5Serializer
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.SearchFilter)
    filterset_class = IndicatorMD5Filter

    def get_queryset(self):
        ind_type = models.IndicatorType.objects.get(name=settings.MD5)
        return models.IndicatorMD5.objects.filter(
            ind_type=ind_type,
            organization=self.request.user.organization)

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True #bulk

        return super(IndicatorMD5ViewSet, self).get_serializer(*args, **kwargs)

    def perform_create(self, serializer):
        ind_type = models.IndicatorType.objects.get(name=settings.MD5)
        instance = serializer.save(ind_type=ind_type, organization = self.request.user.organization)
        jobs = models.IndicatorJob.objects.filter(indicator_types__name=settings.MD5).all()
        self.tasks(instance, jobs)

    def perform_update(self, serializer):
        instance = serializer.save(organization=self.request.user.organization)
        jobs = models.IndicatorJob.objects.filter(indicator_types__name=settings.MD5).all()
        self.tasks(instance, jobs)

        # todo(aj) run jobs


class IndicatorTextFilter(filters.FilterSet):
    indicator__in = NumberInFilter(field_name="indicator", lookup_expr="in")
    ind_type = filters.CharFilter(field_name="indicator__ind_type__name", lookup_expr="exact")
    start_upload_date = filters.IsoDateTimeFilter(field_name='indicator__articles__upload_date',
                                                  lookup_expr='gte' )
    end_upload_date = filters.IsoDateTimeFilter(field_name='indicator__articles__upload_date',
                                                lookup_expr='lte', )
    source = filters.NumberFilter(field_name="indicator__articles__source", lookup_expr="exact", )
    model = filters.NumberFilter(field_name="indicator__articles__prediction__mlmodel",
                                 lookup_expr="exact")

    class Meta:
        model = models.IndicatorTextField
        fields = ('id',
                  "value",
                  "organization",
                  "name",
                  "indicator",
                  "indicator__in",
                  "ind_type",
                  "start_upload_date",
                  "end_upload_date",
                  "source",
                  "model"
                  )


class IndicatorNumericFilter(filters.FilterSet):
    indicator__in = NumberInFilter(field_name="indicator", lookup_expr="in")
    ind_type = filters.CharFilter(field_name="indicator__ind_type__name", lookup_expr="exact")
    start_upload_date = filters.IsoDateTimeFilter(field_name='indicator__articles__upload_date',
                                                  lookup_expr='gte' )
    end_upload_date = filters.IsoDateTimeFilter(field_name='indicator__articles__upload_date',
                                                lookup_expr='lte', )
    source = filters.NumberFilter(field_name="indicator__articles__source", lookup_expr="exact", )
    model = filters.NumberFilter(field_name="indicator__articles__prediction__mlmodel",
                                 lookup_expr="exact")

    class Meta:
        model = models.IndicatorNumericField
        fields = ('id',
                  "value",
                  "name",
                  "organization",
                  "indicator",
                  "indicator__in",
                  "ind_type",
                  "start_upload_date",
                  "end_upload_date",
                  "source",
                  "model"
                  )


class IndicatorTextFilterName(filters.FilterSet):
    indicator__in = NumberInFilter(field_name="indicator", lookup_expr="in")
    ind_type = filters.CharFilter(field_name="indicator__ind_type__name", lookup_expr="exact")
    start_upload_date = filters.IsoDateTimeFilter(field_name='indicator__articles__upload_date',
                                                  lookup_expr='gte' )
    end_upload_date = filters.IsoDateTimeFilter(field_name='indicator__articles__upload_date',
                                                lookup_expr='lte', )
    source = filters.NumberFilter(field_name="indicator__articles__source", lookup_expr="exact", )
    model = filters.NumberFilter(field_name="indicator__articles__prediction__mlmodel",
                                 lookup_expr="exact")

    class Meta:
        model = models.IndicatorTextField
        fields = ("name",
                  "start_upload_date",
                  "end_upload_date",
                  "source",
                  "model",
                  "ind_type",
                  "indicator__in",
                  )


class IndicatorTextFieldNameViewSet(viewsets.ReadOnlyModelViewSet):
    """
    readonly view for distinct column names
    """
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.IndicatorTextFieldName
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.SearchFilter)
    filterset_class = IndicatorTextFilterName

    def get_queryset(self):
        return models.IndicatorTextField.objects.order_by("name").distinct("name").\
            filter(organization=self.request.user.organization)


class IndicatorNumericFilterName(filters.FilterSet):
    indicator__in = NumberInFilter(field_name="indicator", lookup_expr="in")
    start_upload_date = filters.IsoDateTimeFilter(field_name='indicator__articles__upload_date', lookup_expr='gte', )
    end_upload_date = filters.IsoDateTimeFilter(field_name='indicator__articles__upload_date', lookup_expr='lte', )
    source = filters.NumberFilter(field_name="indicator__articles__source", lookup_expr="exact", )
    model = filters.NumberFilter(field_name="indicator__articles__prediction__mlmodel", lookup_expr="exact", )
    ind_type = filters.CharFilter(field_name="indicator__ind_type__name", lookup_expr="exact")

    class Meta:
        model = models.IndicatorNumericField
        fields = ("name",
                  "indicator__in",
                  "start_upload_date",
                  "end_upload_date",
                  "source",
                  "model",
                  "ind_type"
                  )


class IndicatorNumericFieldNameViewSet(viewsets.ReadOnlyModelViewSet):
    """
    readonly view for distinct column names
    """
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.IndicatorNumericFieldName
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.SearchFilter)
    filterset_class = IndicatorNumericFilterName

    def get_queryset(self):
        return models.IndicatorNumericField.objects.order_by("name").\
            distinct("name").filter(organization=self.request.user.organization)


class IndicatorTextFieldViewSet(ColumnViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.IndicatorTextField
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.SearchFilter)
    filterset_class = IndicatorTextFilter

    def get_queryset(self):
        return models.IndicatorTextField.objects.filter(organization=self.request.user.organization)

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True #bulk

        return super(IndicatorTextFieldViewSet, self).get_serializer(*args, **kwargs)


class IndicatorJobViewSet(OrgViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.IndicatorJobSerializer
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.SearchFilter)
    filterset_fields = ('id','name', 'active')

    def get_queryset(self):
        return models.IndicatorJob.objects.filter(organization=self.request.user.organization)


class IndicatorType(filters.FilterSet):
    class Meta:
        model = models.IndicatorType
        fields = ("id", "name")


class IndicatorTypeViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthor,)
    serializer_class = serializers.IndicatorType
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.SearchFilter)
    filterset_class = IndicatorType

    def get_queryset(self):
        return models.IndicatorType.objects.all()


class IndicatorJobVersionViewSet(OrgViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.IndicatorJobVersionSerializer
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.SearchFilter)
    filterset_fields = ('id', 'job', 'version', 'active', 'job__active')

    def get_queryset(self):
        return models.IndicatorJobVersion.objects.filter(organization=self.request.user.organization)

    def perform_create(self, serializer):
        instance = serializer.save(organization=self.request.user.organization)
        # todo(aj) add task id as part of the model to track the job that created the virtual env and script path
        tasks.task_create_indicator_job_script_path.delay(instance.id, create=True, organization_id=self.request.user.organization.id)
        tasks.task_create_indicator_job_virtual_env.delay(instance.id, aws_req=False, create=True, organization_id=self.request.user.organization.id)



class IndicatorNumericFieldViewSet(ColumnViewSet):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.IndicatorNumericField
    filter_backends = (DisabledHTMLFilterBackend, rest_filters.SearchFilter)
    filterset_class = IndicatorNumericFilter

    def get_queryset(self):
        return models.IndicatorNumericField.objects.filter(organization=self.request.user.organization)

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True # bulk

        return super(IndicatorNumericFieldViewSet, self).get_serializer(*args, **kwargs)


class ResetPasswordConfirm(drpr_views.ResetPasswordConfirm):
    authentication_classes = []
    permission_classes = (drfpermissions.AllowAny,)
    throttle_classes = [CustomAnonRateThrottle]


class ResetPasswordValidateToken(drpr_views.ResetPasswordValidateToken):
    authentication_classes = []
    permission_classes = (drfpermissions.AllowAny,)
    throttle_classes = [CustomAnonRateThrottle]


class ResetPasswordRequest(drpr_views.ResetPasswordRequestToken):
    authentication_classes = []
    permission_classes = (drfpermissions.AllowAny,)
    throttle_classes = [CustomAnonRateThrottle]


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """
    # send an e-mail to the user
    context = {
        'current_user': reset_password_token.user,
        'username': reset_password_token.user.username,
        'email': reset_password_token.user.email,
        'reset_password_url': "{}?token={}".format(
            instance.request.build_absolute_uri(reverse('reset-password-confirm')),
            reset_password_token.key)
    }

    # render email text
    email_html_message = render_to_string('email/user_reset_password.html', context)
    email_plaintext_message = render_to_string('email/user_reset_password.txt', context)

    msg = EmailMultiAlternatives(
        # title:
        "Password Reset for {title}".format(title="Some website title"),
        # message:
        email_plaintext_message,
        # from:
        "noreply@somehost.local",
        # to:
        [reset_password_token.user.email]
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()
