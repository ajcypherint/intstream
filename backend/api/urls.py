from django.shortcuts import render
from django.urls import path,include
from rest_framework.schemas import get_schema_view
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView,TokenVerifyView
from . import views
router = routers.DefaultRouter()
router.register('mlmodels',views.MLModelViewSet)
router.register('txtarticles',views.TxtArticleViewSet)
router.register('sourcesupload',views.UploadSourceViewSet)
router.register('sourcesrss',views.RssSourceViewSet)
router.register('categories',views.CategoriesViewSet)


# Create your views here.
urlpatterns=[
    path('',include(router.urls)),
    path('token-auth/', TokenObtainPairView.as_view()),
    path('token-refresh/', TokenRefreshView.as_view()),
    path('token-verify/', TokenVerifyView.as_view()),
    path('auth', include('rest_framework.urls')),
    path('docs', include_docs_urls('IntStream')),
    path('schema/', get_schema_view(title="IntStream API"))
]