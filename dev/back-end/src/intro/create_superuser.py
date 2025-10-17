#!/usr/bin/env python
"""
Script para criar superuser com credenciais padrão
"""
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from django.contrib.auth.models import User

def create_superuser():
    username = 'admin'
    email = 'admin@example.com'
    password = 'admin123'
    
    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username, email, password)
        print(f"✅ Superuser criado com sucesso!")
        print(f"👤 Usuário: {username}")
        print(f"📧 Email: {email}")
        print(f"🔑 Senha: {password}")
        print(f"🌐 Acesse: http://127.0.0.1:8000/admin/")
    else:
        print(f"⚠️  Superuser '{username}' já existe!")

if __name__ == '__main__':
    create_superuser()