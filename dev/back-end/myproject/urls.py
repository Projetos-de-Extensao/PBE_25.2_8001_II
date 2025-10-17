# myproject/urls.py
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

# View simples para a raiz
def home(request):
    return HttpResponse("""
    <h1>Sistema de Monitorias</h1>
    <p>Backend funcionando!</p>
    <ul>
        <li><a href="/admin/">Admin</a></li>
        <li><a href="/">App Principal</a></li>
    </ul>
    """)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('myapp.urls')),  # Todas as URLs da app
]