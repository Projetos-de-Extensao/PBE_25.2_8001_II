# 🔐 Credenciais de Admin - Projeto Django

## 👤 Credenciais do Superuser

- **Usuário:** `admin`
- **Email:** `admin@example.com`  
- **Senha:** `admin123`

## 🌐 Como acessar

1. **Inicie o servidor:**
   ```bash
   cd src/intro
   python manage.py runserver
   ```

2. **Acesse o admin:**
   - URL: http://127.0.0.1:8000/admin/
   - Faça login com as credenciais acima

## 📊 Funcionalidades disponíveis

- ✅ **Gerenciar Produtos** - Criar, editar, excluir produtos
- ✅ **Buscar produtos** - Por nome ou descrição  
- ✅ **Filtrar por preço**
- ✅ **Visualizar lista** - Nome, preço e estoque

## 🔄 Para recriar o superuser (se necessário)

```bash
python create_superuser.py
```

## 📝 Padrões para desenvolvimento

- **Senha padrão:** `admin123` (fácil de lembrar para demos)
- **Email padrão:** `admin@example.com` (formato válido)
- **Username:** `admin` (simples e direto)

> **⚠️ Importante:** Essas são credenciais de desenvolvimento. Em produção, use senhas fortes e únnicas!