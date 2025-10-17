from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Router para gerar URLs automaticamente
router = DefaultRouter()
router.register(r'produtos', views.ProdutoViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]