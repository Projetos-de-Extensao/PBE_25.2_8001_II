from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Usuario, Disciplina, Monitoria, Candidatura, 
    MonitoriaAtiva, HorarioMonitoria, RegistroAtividadeMonitor
)

User = get_user_model()

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Usuario
        fields = [
            'id', 'email_institucional', 'matricula', 'first_name', 
            'last_name', 'tipo_usuario', 'cpf', 'password', 
            'data_criacao', 'ativo', 'is_staff', 'is_superuser'
        ]
        read_only_fields = ['id', 'data_criacao', 'is_staff', 'is_superuser']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = Usuario.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

class UsuarioListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagens"""
    nome_completo = serializers.SerializerMethodField()
    
    class Meta:
        model = Usuario
        fields = ['id', 'email_institucional', 'matricula', 'nome_completo', 'tipo_usuario', 'ativo']
    
    def get_nome_completo(self, obj):
        return f"{obj.first_name} {obj.last_name}"

class DisciplinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disciplina
        fields = ['id', 'nome', 'codigo', 'descricao', 'ativo']

class MonitoriaSerializer(serializers.ModelSerializer):
    disciplina_nome = serializers.CharField(source='disciplina.nome', read_only=True)
    coordenador_nome = serializers.SerializerMethodField()
    candidaturas_count = serializers.SerializerMethodField()
    professor_responsavel_nome = serializers.SerializerMethodField()
    
    class Meta:
        model = Monitoria
        fields = [
            'id', 'disciplina', 'disciplina_nome', 'coordenador', 
            'coordenador_nome', 'titulo', 'descricao', 'requisitos', 
            'vagas', 'data_criacao', 'data_limite', 'status', 'ativo',
            'candidaturas_count', 'professor_responsavel', 'professor_responsavel_nome'
        ]
        read_only_fields = ['id', 'data_criacao', 'coordenador']
    
    def get_coordenador_nome(self, obj):
        return f"{obj.coordenador.first_name} {obj.coordenador.last_name}"
    
    def get_candidaturas_count(self, obj):
        return obj.candidaturas.count()
    
    def get_professor_responsavel_nome(self, obj):
        if obj.professor_responsavel:
            return f"{obj.professor_responsavel.first_name} {obj.professor_responsavel.last_name}"
        return None

class MonitoriaDetailSerializer(MonitoriaSerializer):
    disciplina_detail = DisciplinaSerializer(source='disciplina', read_only=True)
    coordenador_detail = UsuarioListSerializer(source='coordenador', read_only=True)
    candidaturas = serializers.SerializerMethodField()
    
    class Meta(MonitoriaSerializer.Meta):
        fields = MonitoriaSerializer.Meta.fields + ['disciplina_detail', 'coordenador_detail', 'candidaturas']
    
    def get_candidaturas(self, obj):
        candidaturas = obj.candidaturas.all()
        return CandidaturaListSerializer(candidaturas, many=True).data

class CandidaturaSerializer(serializers.ModelSerializer):
    aluno_nome = serializers.SerializerMethodField()
    monitoria_titulo = serializers.CharField(source='monitoria.titulo', read_only=True)
    disciplina_nome = serializers.CharField(source='monitoria.disciplina.nome', read_only=True)
    
    class Meta:
        model = Candidatura
        fields = [
            'id', 'aluno', 'aluno_nome', 'monitoria', 'monitoria_titulo',
            'disciplina_nome', 'status', 'data_candidatura', 'data_avaliacao',
            'observacoes_aluno', 'observacoes_coordenador',
            'avaliacao_professor_status', 'avaliacao_professor_observacoes',
            'avaliacao_professor_data'
        ]
        read_only_fields = ['id', 'data_candidatura', 'data_avaliacao', 'aluno', 'avaliacao_professor_data']
    
    def get_aluno_nome(self, obj):
        return f"{obj.aluno.first_name} {obj.aluno.last_name}"

class CandidaturaListSerializer(serializers.ModelSerializer):
    aluno = UsuarioListSerializer(read_only=True)
    
    class Meta:
        model = Candidatura
        fields = ['id', 'aluno', 'status', 'data_candidatura', 'observacoes_aluno']

class CandidaturaDetailSerializer(CandidaturaSerializer):
    aluno_detail = UsuarioSerializer(source='aluno', read_only=True)
    monitoria_detail = MonitoriaSerializer(source='monitoria', read_only=True)
    
    class Meta(CandidaturaSerializer.Meta):
        fields = CandidaturaSerializer.Meta.fields + ['aluno_detail', 'monitoria_detail']

class HorarioMonitoriaSerializer(serializers.ModelSerializer):
    """
    Horários de disponibilidade do monitor (somente visualização para alunos).
    """
    class Meta:
        model = HorarioMonitoria
        fields = [
            'id', 'monitoria_ativa', 'dia_semana', 'hora_inicio', 
            'hora_fim', 'local', 'ativo'
        ]

class MonitoriaAtivaSerializer(serializers.ModelSerializer):
    horarios = HorarioMonitoriaSerializer(many=True, read_only=True)
    monitor_nome = serializers.SerializerMethodField()
    disciplina_nome = serializers.SerializerMethodField()
    
    class Meta:
        model = MonitoriaAtiva
        fields = [
            'id', 'candidatura', 'monitor_nome', 'disciplina_nome',
            'data_inicio', 'data_fim', 'ativo', 'horarios'
        ]
        read_only_fields = ['id', 'data_inicio']
    
    def get_monitor_nome(self, obj):
        if obj.candidatura and obj.candidatura.aluno:
            return f"{obj.candidatura.aluno.first_name} {obj.candidatura.aluno.last_name}"
        return "N/A"
    
    def get_disciplina_nome(self, obj):
        if obj.candidatura and obj.candidatura.monitoria:
            return obj.candidatura.monitoria.disciplina.nome
        return "N/A"

class RegistroAtividadeMonitorSerializer(serializers.ModelSerializer):
    monitor_nome = serializers.SerializerMethodField()
    disciplina_nome = serializers.SerializerMethodField()
    
    class Meta:
        model = RegistroAtividadeMonitor
        fields = [
            'id', 'monitoria_ativa', 'data', 'descricao', 'horas', 'status',
            'observacao_validacao', 'validado_por', 'data_validacao',
            'monitor_nome', 'disciplina_nome', 'registrado_por'
        ]
        read_only_fields = ['id', 'status', 'validado_por', 'data_validacao', 'registrado_por']
    
    def get_monitor_nome(self, obj):
        if obj.monitoria_ativa and obj.monitoria_ativa.candidatura and obj.monitoria_ativa.candidatura.aluno:
            m = obj.monitoria_ativa.candidatura.aluno
            return f"{m.first_name} {m.last_name}"
        return None
    
    def get_disciplina_nome(self, obj):
        if obj.monitoria_ativa and obj.monitoria_ativa.candidatura and obj.monitoria_ativa.candidatura.monitoria:
            return obj.monitoria_ativa.candidatura.monitoria.disciplina.nome
        return None

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'}, label='Confirmar Senha')
    
    class Meta:
        model = Usuario
        fields = [
            'email_institucional', 'matricula', 'first_name', 
            'last_name', 'tipo_usuario', 'cpf', 'password', 'password2'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "As senhas não coincidem."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = Usuario.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user