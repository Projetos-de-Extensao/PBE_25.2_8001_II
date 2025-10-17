# Django Project Setup

Este é o projeto Django localizado em `src/intro/`.

## Como executar

### 1. Ativar ambiente virtual (da raiz do projeto)
```bash
# Na raiz do projeto (PBE_25.2_8001_II/)
.\.venv\Scripts\Activate.ps1
```

### 2. Navegar para o diretório do projeto
```bash
cd src\intro
```

### 3. Executar o servidor
```bash
python manage.py runserver
```

### 4. Acessar o projeto
Abra seu navegador em: http://127.0.0.1:8000/

## Estrutura do projeto
```
PBE_25.2_8001_II/           # Raiz do repositório
├── .venv/                  # Ambiente virtual (compartilhado)
├── requirements.txt        # Dependências Python
└── src/
    └── intro/              # Projeto Django
        ├── myproject/      # Configurações Django
        ├── manage.py       # Script de gerenciamento
        └── db.sqlite3      # Banco de dados
```

## Comandos úteis
```bash
# Instalar dependências
pip install -r requirements.txt

# Criar migrations
python manage.py makemigrations

# Aplicar migrations
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser
```