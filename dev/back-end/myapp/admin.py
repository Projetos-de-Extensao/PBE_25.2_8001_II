from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Disciplina, Monitoria, Candidatura, MonitoriaAtiva, HorarioMonitoria

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ['email_institucional', 'first_name', 'last_name', 'matricula', 'tipo_usuario', 'ativo']
    list_filter = ['tipo_usuario', 'ativo']
    search_fields = ['email_institucional', 'first_name', 'last_name', 'matricula']
    
    ordering = ['email_institucional']
    
    fieldsets = (
        (None, {'fields': ('email_institucional', 'password')}),
        ('Informações Pessoais', {'fields': ('first_name', 'last_name', 'matricula', 'cpf')}),
        ('Tipo de Usuário', {'fields': ('tipo_usuario',)}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Datas Importantes', {'fields': ('last_login', 'data_criacao')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email_institucional', 'first_name', 'last_name', 'matricula', 'tipo_usuario', 'password1', 'password2'),
        }),
    )
    
    readonly_fields = ['data_criacao']

@admin.register(Disciplina)
class DisciplinaAdmin(admin.ModelAdmin):
    list_display = ['nome', 'codigo', 'ativo']
    list_filter = ['ativo']
    search_fields = ['nome', 'codigo']

@admin.register(Monitoria)
class MonitoriaAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'disciplina', 'coordenador', 'status', 'data_limite', 'ativo']
    list_filter = ['status', 'ativo', 'data_criacao']
    search_fields = ['titulo', 'disciplina__nome']

@admin.register(Candidatura)
class CandidaturaAdmin(admin.ModelAdmin):
    list_display = ['aluno', 'monitoria', 'status', 'data_candidatura']
    list_filter = ['status', 'data_candidatura']
    search_fields = ['aluno__first_name', 'aluno__last_name', 'monitoria__titulo']

@admin.register(MonitoriaAtiva)
class MonitoriaAtivaAdmin(admin.ModelAdmin):
    list_display = ['candidatura', 'data_inicio', 'ativo']
    list_filter = ['ativo', 'data_inicio']
    search_fields = ['candidatura__aluno__first_name', 'candidatura__aluno__last_name']

@admin.register(HorarioMonitoria)
class HorarioMonitoriaAdmin(admin.ModelAdmin):
    list_display = ['monitoria_ativa', 'dia_semana', 'hora_inicio', 'hora_fim', 'local', 'ativo']
    list_filter = ['dia_semana', 'ativo']
    search_fields = ['monitoria_ativa__candidatura__aluno__first_name']