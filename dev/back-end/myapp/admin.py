from django.contrib import admin
from .models import Aluno, Professor, Monitor, Coordenador

@admin.register(Aluno)
class AlunoAdmin(admin.ModelAdmin):
    """Configuração do Admin para o modelo Aluno."""
    list_display = ('nome', 'matricula', 'email')
    search_fields = ('nome', 'matricula', 'email')

@admin.register(Professor)
class ProfessorAdmin(admin.ModelAdmin):
    """Configuração do Admin para o modelo Professor."""
    list_display = ('nome', 'email', 'departamento')
    search_fields = ('nome', 'email', 'departamento')
    list_display = ('nome', 'email', 'cpf')
    search_fields = ('nome', 'email', 'cpf')

@admin.register(Monitor)
class MonitorAdmin(admin.ModelAdmin):
    """Configuração do Admin para o modelo Monitor."""
    list_display = ('nome', 'email', 'disciplina')
    search_fields = ('nome', 'email', 'disciplina')
    list_display = ('nome', 'email', 'disciplina', 'matricula')
    search_fields = ('nome', 'email', 'disciplina', 'matricula')

@admin.register(Coordenador)
class CoordenadorAdmin(admin.ModelAdmin):
    """Configuração do Admin para o modelo Coordenador."""
    list_display = ('nome', 'email', 'curso')
    search_fields = ('nome', 'email', 'curso')
    list_display = ('nome', 'email', 'curso', 'cpf')
    search_fields = ('nome', 'email', 'curso', 'cpf')
