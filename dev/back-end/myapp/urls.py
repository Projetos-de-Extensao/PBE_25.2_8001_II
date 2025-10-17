# myapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.login_view, name='login'),
    path('cadastro/', views.cadastro_view, name='cadastro'),
    path('logout/', views.logout_view, name='logout'),
    
    path('monitoria/<int:monitoria_id>/', views.detalhes_monitoria, name='detalhes_monitoria'),
    path('monitoria/<int:monitoria_id>/candidatar/', views.candidatar_monitoria, name='candidatar_monitoria'),
    path('minhas-candidaturas/', views.minhas_candidaturas, name='minhas_candidaturas'),
    
    path('coordenador/dashboard/', views.dashboard_coordenador, name='dashboard_coordenador'),
    path('coordenador/criar-monitoria/', views.criar_monitoria, name='criar_monitoria'),
    path('coordenador/candidatura/<int:candidatura_id>/avaliar/', views.avaliar_candidatura, name='avaliar_candidatura'),
]