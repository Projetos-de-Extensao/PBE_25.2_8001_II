from rest_framework import viewsets
from .models import Aluno, Professor, Monitor, Coordenador
from .serializers import (
    AlunoSerializer,
    ProfessorSerializer,
    MonitorSerializer,
    CoordenadorSerializer
)

class AlunoViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite que alunos sejam visualizados ou editados.
    """
    queryset = Aluno.objects.all().order_by('nome')
    serializer_class = AlunoSerializer

class ProfessorViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite que professores sejam visualizados ou editados.
    """
    queryset = Professor.objects.all().order_by('nome')
    serializer_class = ProfessorSerializer

class MonitorViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite que monitores sejam visualizados ou editados.
    """
    queryset = Monitor.objects.all().order_by('nome')
    serializer_class = MonitorSerializer

class CoordenadorViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite que coordenadores sejam visualizados ou editados.
    """
    queryset = Coordenador.objects.all().order_by('nome')
    serializer_class = CoordenadorSerializer