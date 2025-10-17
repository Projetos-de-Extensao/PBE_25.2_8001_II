from rest_framework import serializers
from .models import Aluno, Professor, Monitor, Coordenador

class AlunoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aluno
        fields = ['id', 'nome', 'matricula', 'email']

class ProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professor
        fields = ['id', 'nome', 'email', 'departamento']

class MonitorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Monitor
        fields = ['id', 'nome', 'email', 'disciplina']

class CoordenadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coordenador
        fields = ['id', 'nome', 'email', 'curso']