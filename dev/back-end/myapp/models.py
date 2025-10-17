from django.db import models

class Aluno(models.Model):
    nome = models.CharField(max_length=100, verbose_name="Nome Completo")
    matricula = models.CharField(max_length=20, unique=True, verbose_name="Matrícula")
    email = models.EmailField(unique=True, verbose_name="E-mail")

    def __str__(self):
        return f"{self.nome} ({self.matricula})"

class Professor(models.Model):
    nome = models.CharField(max_length=100, verbose_name="Nome Completo")
    email = models.EmailField(unique=True, verbose_name="E-mail")
    # Ex: "Departamento de Ciência da Computação"
    departamento = models.CharField(max_length=100, verbose_name="Departamento")

    def __str__(self):
        return self.nome

class Monitor(models.Model):
    nome = models.CharField(max_length=100, verbose_name="Nome Completo")
    email = models.EmailField(unique=True, verbose_name="E-mail")
    disciplina = models.CharField(max_length=100, verbose_name="Disciplina")

    def __str__(self):
        return f"{self.nome} - Monitor de {self.disciplina}"

class Coordenador(models.Model):
    nome = models.CharField(max_length=100, verbose_name="Nome Completo")
    email = models.EmailField(unique=True, verbose_name="E-mail")
    curso = models.CharField(max_length=100, verbose_name="Curso Coordenado")

    def __str__(self):
        return f"{self.nome} - Coordenador de {self.curso}"