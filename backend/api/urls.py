from django.shortcuts import render
from django.urls import path,include
from rest_framework.schemas import get_schema_view as g_schema
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView,TokenVerifyView
from . import views

HTMLARTICLES = 'htmlarticles'
PDFARTICLES = "pdfarticles"
TXTARTICLES = "txtarticles"
DOCXARTICLES = 'docxarticles'
RSSARTICLES = 'rssarticles'

router = routers.DefaultRouter()
router.register('mlmodels',views.MLModelViewSet)

# articles
router.register('articletypes',views.ArticleTypeViewSet)

router.register('articles',views.ArticleViewSet)
router.register(TXTARTICLES,views.TxtArticleViewSet)
router.register(HTMLARTICLES,views.HtmlArticleViewSet)
router.register(PDFARTICLES,views.PDFArticleViewSet)
router.register(DOCXARTICLES,views.WordDocxArticleViewSet)
router.register(RSSARTICLES,views.RSSArticleViewSet)

# sources
router.register('sourcetypes',views.SourceTypeViewSet)

UPLOADSOURCE = 'sourcesupload'
RSSSOURCE = 'sourcesrss'
JOBSOURCE = 'sourcesjob'
SOURCE = 'sources'

router.register(UPLOADSOURCE, views.UploadSourceViewSet)
router.register(RSSSOURCE, views.RssSourceViewSet)
router.register(JOBSOURCE, views.JobSourceViewSet)
router.register(SOURCE, views.SourceViewSet,basename="source")


router.register('categories',views.CategoriesViewSet)
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
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('',include(router.urls)),
    path('token-auth/', TokenObtainPairView.as_view()),
    path('token-refresh/', TokenRefreshView.as_view()),
    path('token-verify/', TokenVerifyView.as_view()),
    path('auth', include('rest_framework.urls')),
    path('schema/', g_schema(title="IntStream API"))
]