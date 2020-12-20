from django.shortcuts import render
from django.urls import path,include
from rest_framework.schemas import get_schema_view as g_schema
from rest_framework import permissions as drfpermissions
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView,TokenVerifyView
from . import views

HTMLARTICLES = 'htmlarticles'
PDFARTICLES = "pdfarticles"
TXTARTICLES = "txtarticles"
DOCXARTICLES = 'docxarticles'
RSSARTICLES = 'rssarticles'
RAWRTICLES = 'rawarticles'
JOBSOURCE = "jobsource" # do not remove used in migrations

router = routers.DefaultRouter()
#models
router.register('mlmodels',views.MLModelViewSet, basename="mlmodels")

# articles
router.register('articletypes',views.ArticleTypeViewSet)

router.register('articles',views.ArticleViewSet, basename="articles")
router.register(TXTARTICLES,views.TxtArticleViewSet, basename="txtarticles")
router.register(HTMLARTICLES,views.HtmlArticleViewSet, basename="htmlarticles")
router.register(PDFARTICLES,views.PDFArticleViewSet, basename="pdfarticles")
router.register(DOCXARTICLES,views.WordDocxArticleViewSet, basename="docxarticles")
router.register(RSSARTICLES,views.RSSArticleViewSet, basename="rssarticles")
router.register(RAWRTICLES,views.RawArticleViewSet, basename="rawarticles")

# sources
router.register('sourcetypes',views.SourceTypeViewSet)

UPLOADSOURCE = 'sourcesupload'
RSSSOURCE = 'sourcesrss'
SOURCE = 'sources'

router.register("indicatortype", views.IndicatorTypeViewSet, basename="indicatotype")
router.register(UPLOADSOURCE, views.UploadSourceViewSet, basename="uploadsource")
router.register(RSSSOURCE, views.RssSourceViewSet, basename="rsssource")
router.register("job", views.JobViewSet, basename="job")
router.register("jobversion", views.JobVersionViewSet, basename="jobversion")
router.register("indicatorjob", views.IndicatorJobViewSet, basename="indicatorjob")
router.register("indicatorjobversion", views.IndicatorJobVersionViewSet, basename="indicatorjobversion")
router.register(SOURCE, views.SourceViewSet,basename="source")
router.register("homefilter",views.HomeFilter, basename="homefilter")
router.register("classiffilter",views.ClassifPageFilter, basename="classiffilter")

router.register("userinfo",views.UserViewSet, basename="userinfo") # single user info
router.register("alluserinfo",views.AllUserViewSet, basename="alluserinfo") # all users; super user only
router.register("orguserinfo",views.OrgUserViewSet, basename="orguserinfo") # org users; staff user only
router.register("usersingle",views.UserSingleViewSet, basename="usersingle") # single user for password reset
#classifications
router.register("classifications",views.ClassificationViewSet, basename="classifications")
router.register("predictions",views.PredictionViewSet, basename="predictions")

router.register("organization",views.OrganizationViewSet, basename="organization")
router.register("allorganization",views.AllOrganizationViewSet, basename="allorganization")

router.register("taskresult", views.TaskResultViewSet, basename="taskresult")
router.register("modelversion", views.ModelVersionViewSet, basename="modelversion")

router.register("indicatormd5", views.IndicatorMD5ViewSet, basename="indicatormd5")
router.register("indicatorsha1", views.IndicatorSha1ViewSet, basename="indicatorsha1")
router.register("indicatorsha256", views.IndicatorSha256ViewSet, basename="indicatorsha256")
router.register("indicatornetloc", views.IndicatorNetLocViewSet, basename="indicatornetloc")
router.register("indicatoremail", views.IndicatorEmailViewSet, basename="indicatoremail")
router.register("indicatoripv4", views.IndicatorIPV4ViewSet, basename="indicatoripv4")
router.register("indicatoripv6", views.IndicatorIPV6ViewSet, basename="indicatoripv6")
router.register("indicatorsuffix", views.SuffixViewSet, basename="suffix")

router.register("indicatornumericfield", views.IndicatorNumericFieldViewSet, basename="indicatornumericfield")
router.register("indicatortextfield", views.IndicatorTextFieldViewSet, basename="indicatortextfield")
router.register("indicatortextfieldname", views.IndicatorTextFieldNameViewSet, basename="indicatortextfieldname")
router.register("indicatornumericfieldname", views.IndicatorNumericFieldNameViewSet, basename="indicatornumericfieldname")

SETTINGS = "setting"
router.register(SETTINGS,views.SettingsViewSet, basename="setting")

router.register("trainingscriptversion", views.TrainingScriptVersionViewSet, basename="trainingscriptversion")
router.register("trainingscript", views.TrainingScriptViewSet, basename="trainingscript")

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
schema_view = get_schema_view(
   openapi.Info(
      title="Intstream API",
      default_version='v1',
      description="Intstream",
      terms_of_service="",
      contact=openapi.Contact(email="aaron.jonen@cypherint.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

# Create your views here.
urlpatterns=[
    path("register/",views.SignUpView.as_view()),
    path("activate/<str:uidb64>/<str:token>",views.Activate.as_view(), name="activate"),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('',include(router.urls)),
    path('password-reset/validate_token/', views.ResetPasswordValidateToken.as_view(), name="reset-password-validate"),
    path('password-reset/confirm/', views.ResetPasswordConfirm.as_view(), name="reset-password-confirm"),
    path('password-reset/', views.ResetPasswordRequest.as_view(), name="reset-password-request"),
    path('token-auth/', TokenObtainPairView.as_view()),
    path('token-refresh/', TokenRefreshView.as_view()),
    path('token-verify/', TokenVerifyView.as_view()),
    path('auth', include('rest_framework.urls')),
    path('unclass/',views.RandomUnclassified.as_view()),
    path("homearticles/",views.HomePage.as_view()),
    path("train/",views.Train.as_view()),
    path("upload-docs/",views.Upload.as_view()),
    path('schema/', g_schema(title="IntStream API")),
]