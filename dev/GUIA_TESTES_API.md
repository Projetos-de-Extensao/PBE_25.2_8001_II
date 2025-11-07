# 🧪 Guia de Testes da API

## ✅ Backend Está Rodando

Servidor: **http://localhost:8000**

## 🔐 Credenciais de Teste

| Tipo | Email | Senha | Matrícula |
|------|-------|-------|-----------|
| **Coordenador** | coord@ibmec.edu.br | senha123 | COORD001 |
| **Aluno 1** | joao.silva@ibmec.edu.br | senha123 | 2023001 |
| **Aluno 2** | maria.santos@ibmec.edu.br | senha123 | 2023002 |
| **Aluno 3** | pedro.costa@ibmec.edu.br | senha123 | 2023003 |
| **Monitor** | ana.oliveira@ibmec.edu.br | senha123 | 2022001 |

## 📋 Dados Existentes no Banco

### Disciplinas
1. **INF101** - Programação Orientada a Objetos
2. **INF102** - Estrutura de Dados
3. **INF201** - Banco de Dados
4. **INF301** - Desenvolvimento Web

### Monitorias
1. **Monitoria de POO - Noturno** (Aberta, 2 vagas)
2. **Monitoria de Estrutura de Dados** (Aberta, 1 vaga)
3. **Monitoria de Banco de Dados** (Fechada)
4. **Monitoria de Desenvolvimento Web** (Aberta, 2 vagas)

### Candidaturas
1. João → POO (Pendente)
2. Maria → POO (Aprovada + Monitoria Ativa)
3. Pedro → Estrutura de Dados (Reprovada)
4. João → Desenvolvimento Web (Pendente)

## 🧪 Testes com cURL ou Postman

### 1. Login (Obter Token)

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email_institucional": "coord@ibmec.edu.br",
    "password": "senha123"
  }'
```

**Resposta esperada:**
```json
{
  "user": {
    "id": 1,
    "email_institucional": "coord@ibmec.edu.br",
    "first_name": "Carlos",
    "last_name": "Lima",
    "tipo_usuario": "coordenador",
    ...
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### 2. Listar Monitorias (Público)

```bash
curl http://localhost:8000/api/monitorias/ \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 3. Listar Monitorias Abertas

```bash
curl http://localhost:8000/api/monitorias/abertas/ \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 4. Criar Candidatura (Como Aluno)

Primeiro, faça login como aluno para obter o token:

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email_institucional": "pedro.costa@ibmec.edu.br",
    "password": "senha123"
  }'
```

Depois, crie a candidatura:

```bash
curl -X POST http://localhost:8000/api/candidaturas/ \
  -H "Authorization: Bearer TOKEN_DO_ALUNO" \
  -H "Content-Type: application/json" \
  -d '{
    "monitoria": 4,
    "observacoes_aluno": "Tenho interesse em monitoria de Web"
  }'
```

### 5. Listar Minhas Candidaturas (Como Aluno)

```bash
curl http://localhost:8000/api/candidaturas/ \
  -H "Authorization: Bearer TOKEN_DO_ALUNO"
```

### 6. Avaliar Candidatura (Como Coordenador)

```bash
curl -X POST http://localhost:8000/api/candidaturas/1/avaliar/ \
  -H "Authorization: Bearer TOKEN_DO_COORDENADOR" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "aprovada",
    "observacoes_coordenador": "Aluno qualificado, aprovado!"
  }'
```

### 7. Criar Nova Monitoria (Como Coordenador)

```bash
curl -X POST http://localhost:8000/api/monitorias/ \
  -H "Authorization: Bearer TOKEN_DO_COORDENADOR" \
  -H "Content-Type: application/json" \
  -d '{
    "disciplina": 1,
    "titulo": "Monitoria de POO - Vespertino",
    "descricao": "Horário vespertino para alunos",
    "requisitos": "Média >= 7.0",
    "vagas": 1,
    "data_limite": "2025-12-31",
    "status": "aberta"
  }'
```

### 8. Listar Disciplinas

```bash
curl http://localhost:8000/api/disciplinas/ \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 9. Usuário Atual (Me)

```bash
curl http://localhost:8000/api/auth/me/ \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 10. Registrar Novo Usuário

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email_institucional": "novo.aluno@ibmec.edu.br",
    "matricula": "2024001",
    "first_name": "Novo",
    "last_name": "Aluno",
    "tipo_usuario": "aluno",
    "cpf": "555.666.777-88",
    "password": "senha123",
    "password2": "senha123"
  }'
```

## 🌐 Documentação Interativa

Acesse a documentação Swagger da API:
- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/

Na interface do Swagger, você pode:
1. Testar todos os endpoints
2. Ver exemplos de requisições
3. Fazer login e obter token
4. Usar o botão "Authorize" para adicionar o token

## 🔒 Testando Autenticação

### Fluxo Completo de Autenticação:

1. **Login**:
   - POST `/api/auth/login/`
   - Recebe `access_token` e `refresh_token`

2. **Usar Token**:
   - Incluir header: `Authorization: Bearer {access_token}`

3. **Renovar Token** (quando expirar):
   - POST `/api/auth/token/refresh/`
   - Body: `{"refresh": "seu_refresh_token"}`

4. **Ver Dados do Usuário**:
   - GET `/api/auth/me/`

## 🎯 Testando Permissões

### Como Aluno:
- ✅ Listar monitorias
- ✅ Ver detalhes de monitoria
- ✅ Criar candidatura
- ✅ Ver minhas candidaturas
- ✅ Cancelar minha candidatura
- ❌ Criar monitoria
- ❌ Avaliar candidatura

### Como Coordenador:
- ✅ Tudo que aluno pode
- ✅ Criar monitoria
- ✅ Editar monitoria
- ✅ Ver candidaturas das suas monitorias
- ✅ Avaliar candidaturas
- ❌ Candidatar-se a monitoria

### Como Monitor:
- ✅ Ver monitorias ativas
- ✅ Ver horários
- ✅ Gerenciar seus horários

## 📊 Admin Django

Acesse: **http://localhost:8000/admin/**

**Superusuário** (criar se necessário):
```bash
python manage.py createsuperuser
```

No admin você pode:
- Ver todos os usuários
- Gerenciar disciplinas
- Ver monitorias e candidaturas
- Modificar dados diretamente

## 🔍 Verificar Dados no Banco

### Via Django Shell:
```bash
python manage.py shell
```

```python
from myapp.models import *

# Ver usuários
Usuario.objects.all()

# Ver monitorias abertas
Monitoria.objects.filter(status='aberta')

# Ver candidaturas pendentes
Candidatura.objects.filter(status='pendente')
```

## 🐛 Troubleshooting

### Erro 401 (Unauthorized)
- Verifique se o token está correto
- Token pode ter expirado (1h de validade)
- Use refresh token para renovar

### Erro 403 (Forbidden)
- Usuário não tem permissão para a ação
- Ex: Aluno tentando criar monitoria

### Erro 404
- Verifique se a URL está correta
- Verifique se o ID do recurso existe

### Erro 400 (Bad Request)
- Verifique os dados enviados
- Campos obrigatórios faltando
- Formato de dados incorreto

## ✅ Checklist de Funcionalidades

- [x] Login funcional
- [x] Registro de usuários
- [x] Listagem de monitorias
- [x] Criação de candidaturas
- [x] Avaliação de candidaturas
- [x] Criação de monitorias (coordenador)
- [x] Listagem de disciplinas
- [x] Monitorias ativas
- [x] Horários de monitoria
- [x] Permissões por tipo de usuário
- [x] Renovação automática de tokens
- [x] Documentação Swagger
- [x] CORS configurado

## 🚀 Próximos Passos

1. Instalar dependências do frontend: `npm install`
2. Rodar frontend: `npm run dev`
3. Testar integração completa
4. Implementar hooks customizados para React Query
5. Adicionar mais validações
6. Implementar testes automatizados
