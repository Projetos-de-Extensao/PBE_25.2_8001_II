# myproject/urls.py
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Swagger/OpenAPI Schema
schema_view = get_schema_view(
   openapi.Info(
      title="Sistema de Monitorias API",
      default_version='v1',
      description="API para gerenciamento de monitorias acadêmicas",
      contact=openapi.Contact(email="contato@monitorias.com"),
      license=openapi.License(name="MIT License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

# View simples para a raiz
def home(request):
    return HttpResponse("""
    <h1>Sistema de Monitorias - API</h1>
    <p>Backend funcionando!</p>
    <ul>
        <li><a href="/admin/">Admin Django</a></li>
        <li><a href="/api/">API Endpoints</a></li>
        <li><a href="/api/docs/">Documentação API (Swagger)</a></li>
        <li><a href="/api/redoc/">Documentação API (ReDoc)</a></li>
    </ul>
    """)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    
    # API URLs
    path('api/', include('myapp.api_urls')),
    
    # Swagger/OpenAPI Documentation
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
]