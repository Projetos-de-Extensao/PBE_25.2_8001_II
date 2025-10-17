from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Cria um roteador e registra nosso viewset com ele.
router = DefaultRouter()
router.register(r'alunos', views.AlunoViewSet)
router.register(r'professores', views.ProfessorViewSet)
router.register(r'monitores', views.MonitorViewSet)
router.register(r'coordenadores', views.CoordenadorViewSet)

# As URLs da API são determinadas automaticamente pelo roteador.
urlpatterns = router.urls