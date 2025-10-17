from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.db.models import Q
from django.utils import timezone
from .models import Usuario, Disciplina, Monitoria, Candidatura, MonitoriaAtiva
from .forms import LoginForm, CadastroForm, CandidaturaForm

# Página inicial - monitorias públicas
def home(request):
    monitorias_abertas = Monitoria.objects.filter(
        status='aberta', 
        ativo=True,
        data_limite__gte=timezone.now().date()
    ).select_related('disciplina', 'coordenador')
    
    context = {
        'monitorias': monitorias_abertas,
        'total_monitorias': monitorias_abertas.count()
    }
    return render(request, 'myapp/home.html', context)

# Detalhes de uma monitoria
def detalhes_monitoria(request, monitoria_id):
    monitoria = get_object_or_404(Monitoria, id=monitoria_id, ativo=True)
    
    # Verificar se o usuário logado já se candidatou
    candidatura_existente = None
    if request.user.is_authenticated and request.user.tipo_usuario == 'aluno':
        candidatura_existente = Candidatura.objects.filter(
            aluno=request.user, 
            monitoria=monitoria
        ).first()
    
    context = {
        'monitoria': monitoria,
        'candidatura_existente': candidatura_existente,
    }
    return render(request, 'myapp/detalhes_monitoria.html', context)

# Login
def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email_institucional']
            password = form.cleaned_data['password']
            user = authenticate(request, email_institucional=email, password=password)
            
            if user is not None:
                login(request, user)
                messages.success(request, f'Bem-vindo, {user.first_name}!')
                
                # Redirecionar para a página que tentava acessar ou home
                next_url = request.GET.get('next', 'home')
                return redirect(next_url)
            else:
                messages.error(request, 'Email ou senha incorretos.')
    else:
        form = LoginForm()
    
    return render(request, 'myapp/login.html', {'form': form})

# Cadastro
def cadastro_view(request):
    if request.method == 'POST':
        form = CadastroForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.tipo_usuario = 'aluno'  # Todos começam como alunos
            user.save()
            
            login(request, user)
            messages.success(request, 'Cadastro realizado com sucesso!')
            return redirect('home')
    else:
        form = CadastroForm()
    
    return render(request, 'myapp/cadastro.html', {'form': form})

# Logout
def logout_view(request):
    logout(request)
    messages.info(request, 'Você saiu do sistema.')
    return redirect('home')

# Candidatar-se à monitoria (requer login)
@login_required
def candidatar_monitoria(request, monitoria_id):
    monitoria = get_object_or_404(Monitoria, id=monitoria_id, status='aberta', ativo=True)
    
    # Verificar se é aluno
    if request.user.tipo_usuario != 'aluno':
        messages.error(request, 'Apenas alunos podem se candidatar à monitoria.')
        return redirect('detalhes_monitoria', monitoria_id=monitoria_id)
    
    # Verificar se já existe candidatura
    candidatura_existente = Candidatura.objects.filter(
        aluno=request.user, 
        monitoria=monitoria
    ).exists()
    
    if candidatura_existente:
        messages.warning(request, 'Você já se candidatou a esta monitoria.')
        return redirect('detalhes_monitoria', monitoria_id=monitoria_id)
    
    if request.method == 'POST':
        form = CandidaturaForm(request.POST)
        if form.is_valid():
            candidatura = form.save(commit=False)
            candidatura.aluno = request.user
            candidatura.monitoria = monitoria
            candidatura.save()
            
            messages.success(request, 'Candidatura enviada com sucesso!')
            return redirect('minhas_candidaturas')
    else:
        form = CandidaturaForm()
    
    context = {
        'form': form,
        'monitoria': monitoria
    }
    return render(request, 'myapp/candidatar_monitoria.html', context)

# Minhas candidaturas (aluno)
@login_required
def minhas_candidaturas(request):
    if request.user.tipo_usuario != 'aluno':
        messages.error(request, 'Apenas alunos podem acessar esta página.')
        return redirect('home')
    
    candidaturas = Candidatura.objects.filter(aluno=request.user).select_related('monitoria', 'monitoria__disciplina')
    
    context = {
        'candidaturas': candidaturas
    }
    return render(request, 'myapp/minhas_candidaturas.html', context)

# Dashboard do coordenador
@login_required
def dashboard_coordenador(request):
    if request.user.tipo_usuario != 'coordenador':
        messages.error(request, 'Acesso restrito a coordenadores.')
        return redirect('home')
    
    # Monitorias criadas pelo coordenador
    minhas_monitorias = Monitoria.objects.filter(coordenador=request.user)
    
    # Candidaturas pendentes para as monitorias do coordenador
    candidaturas_pendentes = Candidatura.objects.filter(
        monitoria__coordenador=request.user,
        status='pendente'
    ).select_related('aluno', 'monitoria', 'monitoria__disciplina')
    
    context = {
        'minhas_monitorias': minhas_monitorias,
        'candidaturas_pendentes': candidaturas_pendentes,
        'total_pendentes': candidaturas_pendentes.count()
    }
    return render(request, 'myapp/dashboard_coordenador.html', context)

# Aprovar/reprovar candidatura (coordenador)
@login_required
def avaliar_candidatura(request, candidatura_id):
    if request.user.tipo_usuario != 'coordenador':
        messages.error(request, 'Acesso restrito a coordenadores.')
        return redirect('home')
    
    candidatura = get_object_or_404(
        Candidatura, 
        id=candidatura_id, 
        monitoria__coordenador=request.user
    )
    
    if request.method == 'POST':
        acao = request.POST.get('acao')
        observacoes = request.POST.get('observacoes', '')
        
        if acao == 'aprovar':
            candidatura.status = 'aprovada'
            
            # Criar monitoria ativa
            MonitoriaAtiva.objects.create(candidatura=candidatura)
            
            # Mudar tipo de usuário para monitor
            candidatura.aluno.tipo_usuario = 'monitor'
            candidatura.aluno.save()
            
            messages.success(request, 'Candidatura aprovada! Aluno agora é monitor.')
        
        elif acao == 'reprovar':
            candidatura.status = 'reprovada'
            messages.info(request, 'Candidatura reprovada.')
        
        candidatura.observacoes_coordenador = observacoes
        candidatura.data_avaliacao = timezone.now()
        candidatura.save()
        
        return redirect('dashboard_coordenador')
    
    context = {
        'candidatura': candidatura
    }
    return render(request, 'myapp/avaliar_candidatura.html', context)

# Criar nova monitoria (coordenador)
@login_required
def criar_monitoria(request):
    if request.user.tipo_usuario != 'coordenador':
        messages.error(request, 'Acesso restrito a coordenadores.')
        return redirect('home')
    
    if request.method == 'POST':
        titulo = request.POST.get('titulo')
        disciplina_id = request.POST.get('disciplina')
        descricao = request.POST.get('descricao')
        requisitos = request.POST.get('requisitos')
        vagas = request.POST.get('vagas')
        data_limite = request.POST.get('data_limite')
        
        disciplina = get_object_or_404(Disciplina, id=disciplina_id)
        
        Monitoria.objects.create(
            titulo=titulo,
            disciplina=disciplina,
            coordenador=request.user,
            descricao=descricao,
            requisitos=requisitos,
            vagas=vagas,
            data_limite=data_limite
        )
        
        messages.success(request, 'Monitoria criada com sucesso!')
        return redirect('dashboard_coordenador')
    
    disciplinas = Disciplina.objects.filter(ativo=True)
    context = {
        'disciplinas': disciplinas
    }
    return render(request, 'myapp/criar_monitoria.html', context)

# Página simples para templates que ainda não existem
def template_placeholder(request, template_name):
    return render(request, f'myapp/{template_name}', {})