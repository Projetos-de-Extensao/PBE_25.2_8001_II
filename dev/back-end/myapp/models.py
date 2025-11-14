from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

class UsuarioManager(BaseUserManager):
    def create_user(self, email_institucional, password=None, **extra_fields):
        if not email_institucional:
            raise ValueError('O Email Institucional é obrigatório')
        email_institucional = self.normalize_email(email_institucional)
        user = self.model(email_institucional=email_institucional, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email_institucional, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('tipo_usuario', 'coordenador')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email_institucional, password, **extra_fields)

class Usuario(AbstractUser):
    TIPO_USUARIO_CHOICES = [
        ('aluno', 'Aluno'),
        ('monitor', 'Monitor'),
        ('professor', 'Professor'),
        ('coordenador', 'Coordenador'),
    ]
    
    tipo_usuario = models.CharField(max_length=20, choices=TIPO_USUARIO_CHOICES, default='aluno')
    cpf = models.CharField(max_length=14, blank=True, null=True, unique=True)
    matricula = models.CharField(max_length=20, unique=True)
    email_institucional = models.EmailField(unique=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    ativo = models.BooleanField(default=True)
    
    username = None
    email = None
    
    USERNAME_FIELD = 'email_institucional'
    REQUIRED_FIELDS = ['matricula', 'first_name', 'last_name']
    
    objects = UsuarioManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.tipo_usuario})"

class Disciplina(models.Model):
    nome = models.CharField(max_length=100)
    codigo = models.CharField(max_length=10, unique=True)
    descricao = models.TextField(blank=True, null=True)
    ativo = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.codigo} - {self.nome}"

class Monitoria(models.Model):
    STATUS_CHOICES = [
        ('aberta', 'Aberta para Candidaturas'),
        ('fechada', 'Fechada'),
        ('cancelada', 'Cancelada'),
    ]
    
    disciplina = models.ForeignKey(Disciplina, on_delete=models.CASCADE)
    coordenador = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        limit_choices_to={'tipo_usuario': 'coordenador'},
        related_name='monitorias_criadas'
    )
    professor_responsavel = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'tipo_usuario': 'professor'},
        related_name='monitorias_supervisionadas'
    )
    titulo = models.CharField(max_length=200)
    descricao = models.TextField()
    requisitos = models.TextField(blank=True, null=True)
    vagas = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_limite = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='aberta')
    ativo = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Monitoria: {self.titulo} - {self.disciplina.nome}"

class Candidatura(models.Model):
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('aprovada', 'Aprovada'),
        ('reprovada', 'Reprovada'),
        ('cancelada', 'Cancelada'),
    ]
    
    aluno = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        limit_choices_to={'tipo_usuario': 'aluno'},
        related_name='minhas_candidaturas'
    )
    monitoria = models.ForeignKey(Monitoria, on_delete=models.CASCADE, related_name='candidaturas')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')
    data_candidatura = models.DateTimeField(auto_now_add=True)
    data_avaliacao = models.DateTimeField(blank=True, null=True)
    observacoes_aluno = models.TextField(blank=True, null=True)
    observacoes_coordenador = models.TextField(blank=True, null=True)
    # Avaliação do professor (prévia à decisão do coordenador)
    AVALIACAO_PROFESSOR_CHOICES = [
        ('pendente', 'Pendente'),
        ('aprovado', 'Aprovado'),
        ('lista_espera', 'Lista de Espera'),
        ('reprovado', 'Reprovado'),
    ]
    avaliacao_professor_status = models.CharField(max_length=20, choices=AVALIACAO_PROFESSOR_CHOICES, default='pendente')
    avaliacao_professor_observacoes = models.TextField(blank=True, null=True)
    avaliacao_professor_data = models.DateTimeField(blank=True, null=True)
    avaliacao_professor = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'tipo_usuario': 'professor'},
        related_name='avaliacoes_candidaturas'
    )
    
    class Meta:
        unique_together = ['aluno', 'monitoria']
    
    def __str__(self):
        return f"Candidatura: {self.aluno} para {self.monitoria}"

class MonitoriaAtiva(models.Model):
    """
    Representa uma monitoria em andamento após aprovação de candidatura.
    Monitor define horários de disponibilidade (HorarioMonitoria).
    Alunos visualizam esses horários mas NÃO fazem agendamentos.
    """
    candidatura = models.OneToOneField(
        Candidatura,
        on_delete=models.CASCADE,
        related_name='monitoria_ativa',
        null=True,  # Permite nulo inicialmente
        blank=True  # Permite em branco no admin
    )
    data_inicio = models.DateField(auto_now_add=True)
    data_fim = models.DateField(blank=True, null=True)
    ativo = models.BooleanField(default=True)
    
    def __str__(self):
        if self.candidatura:
            return f"Monitoria Ativa: {self.candidatura.aluno} - {self.candidatura.monitoria.disciplina}"
        return "Monitoria Ativa (sem candidatura)"

class HorarioMonitoria(models.Model):
    """
    Horários de disponibilidade definidos pelo MONITOR.
    Alunos apenas VISUALIZAM esses horários (não há agendamento/reserva).
    """
    DIAS_SEMANA = [
        ('segunda', 'Segunda-feira'),
        ('terca', 'Terça-feira'),
        ('quarta', 'Quarta-feira'),
        ('quinta', 'Quinta-feira'),
        ('sexta', 'Sexta-feira'),
        ('sabado', 'Sábado'),
    ]
    
    monitoria_ativa = models.ForeignKey(
        MonitoriaAtiva, 
        on_delete=models.CASCADE, 
        related_name='horarios'
    )
    dia_semana = models.CharField(max_length=10, choices=DIAS_SEMANA)
    hora_inicio = models.TimeField()
    hora_fim = models.TimeField()
    local = models.CharField(max_length=100, default='Laboratório de Informática')
    ativo = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.dia_semana} - {self.hora_inicio} às {self.hora_fim}"

class RegistroAtividadeMonitor(models.Model):
    """
    Registro de horas/atividades realizadas pelo monitor, para validação pelo professor supervisor.
    """
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('validado', 'Validado'),
        ('rejeitado', 'Rejeitado'),
    ]

    monitoria_ativa = models.ForeignKey(
        MonitoriaAtiva,
        on_delete=models.CASCADE,
        related_name='registros_atividade'
    )
    data = models.DateField(default=timezone.now)
    descricao = models.TextField()
    horas = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0)])
    registrado_por = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='registros_lancados',
        limit_choices_to={'tipo_usuario': 'monitor'}
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')
    observacao_validacao = models.TextField(blank=True, null=True)
    validado_por = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='registros_validados',
        limit_choices_to={'tipo_usuario': 'professor'}
    )
    data_validacao = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Registro {self.id} - {self.data} - {self.horas}h ({self.get_status_display()})"