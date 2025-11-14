# 🚀 Sistema de Monitorias - PRONTO PARA USAR!

## ✅ Status da Integração

**Backend**: ✅ Configurado e Funcionando  
**API REST**: ✅ Completa com JWT  
**Banco de Dados**: ✅ Populado com dados de teste  
**Documentação**: ✅ Swagger disponível  
**Frontend**: ⚠️ Necessita instalação de dependências

---

## 🎯 COMO EXECUTAR AGORA

### 1️⃣ Backend (PRONTO!)

O backend JÁ ESTÁ RODANDO em: **http://localhost:8000**

**Documentação da API:**
- Swagger: http://localhost:8000/api/docs/
- ReDoc: http://localhost:8000/api/redoc/
- Admin Django: http://localhost:8000/admin/

**Se precisar reiniciar:**
```bash
cd dev/back-end
python manage.py runserver
```

### 2️⃣ Frontend (Executar pela primeira vez)

```bash
cd dev/front-end

# Instalar dependências (PRIMEIRA VEZ)
npm install
# ou
bun install

# Rodar o servidor de desenvolvimento
npm run dev
# ou
bun dev
```

O frontend estará em: **http://localhost:5173**

---

## 🔐 CREDENCIAIS DE TESTE

| Tipo | Email | Senha |
|------|-------|-------|
| **Coordenador** | coord@ibmec.edu.br | senha123 |
| **Aluno** | joao.silva@ibmec.edu.br | senha123 |
| **Monitor** | ana.oliveira@ibmec.edu.br | senha123 |

---

## 📊 BANCO DE DADOS JÁ POPULADO

O banco contém:

- ✅ 6 usuários (coordenador, alunos, monitor)
- ✅ 4 disciplinas (POO, Estrutura de Dados, BD, Web)
- ✅ 4 monitorias (3 abertas, 1 fechada)
- ✅ 4 candidaturas (pendentes, aprovadas, reprovadas)
- ✅ 1 monitoria ativa com horários

**Para repovoar o banco:**

```bash
cd dev/back-end
python populate_database.py
```

---

## 🧪 TESTANDO A API

### Opção 1: Swagger UI (Recomendado)
1. Acesse: http://localhost:8000/api/docs/
2. Clique em "POST /api/auth/login/"
3. Clique em "Try it out"
4. Cole este JSON:
```json
{
  "email_institucional": "coord@ibmec.edu.br",
  "password": "senha123"
}
```
5. Clique em "Execute"
6. Copie o `access` token da resposta
7. Clique no botão "Authorize" no topo
8. Cole: `Bearer SEU_TOKEN`
9. Agora pode testar todos endpoints!

### Opção 2: cURL
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email_institucional": "coord@ibmec.edu.br", "password": "senha123"}'

# Listar monitorias
curl http://localhost:8000/api/monitorias/ \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Opção 3: Frontend (Após instalar dependências)
1. Acesse: http://localhost:5173
2. Clique em "Entrar"
3. Use as credenciais acima
4. Navegue pelo sistema!

---

## 📁 ESTRUTURA DO PROJETO

```
dev/
├── back-end/              # Django REST API
│   ├── myapp/            # App principal
│   │   ├── models.py     # Modelos do banco
│   │   ├── serializers.py # Serializers da API
│   │   ├── api_views.py  # ViewSets e endpoints
│   │   ├── api_urls.py   # URLs da API
│   │   └── admin.py      # Admin do Django
│   ├── myproject/        # Configurações
│   │   ├── settings.py   # Settings (CORS, JWT, etc)
│   │   └── urls.py       # URLs principais
│   ├── db.sqlite3        # Banco de dados
│   ├── manage.py         # Gerenciador Django
│   ├── populate_database.py # Script de população
│   └── requirements.txt  # Dependências Python
│
└── front-end/            # React + Vite
    ├── src/
    │   ├── lib/
    │   │   └── api.ts    # Serviço de API integrado
    │   ├── contexts/
    │   │   └── AuthContext.tsx # Contexto de autenticação
    │   ├── pages/        # Páginas da aplicação
    │   └── components/   # Componentes reutilizáveis
    ├── package.json      # Dependências Node
    └── .env              # Configurações (API_URL)
```

---

## 🔧 ENDPOINTS PRINCIPAIS DA API

### Autenticação
- `POST /api/auth/register/` - Registrar usuário
- `POST /api/auth/login/` - Login
- `POST /api/auth/token/refresh/` - Renovar token
- `GET /api/auth/me/` - Dados do usuário logado

### Monitorias
- `GET /api/monitorias/` - Listar todas
- `GET /api/monitorias/abertas/` - Listar abertas
- `GET /api/monitorias/minhas/` - Minhas monitorias (coordenador)
- `POST /api/monitorias/` - Criar (coordenador)
- `GET /api/monitorias/{id}/` - Detalhes
- `PATCH /api/monitorias/{id}/` - Atualizar (coordenador)

### Candidaturas
- `GET /api/candidaturas/` - Listar (filtradas por usuário)
- `POST /api/candidaturas/` - Criar (aluno)
- `POST /api/candidaturas/{id}/avaliar/` - Avaliar (coordenador)
- `POST /api/candidaturas/{id}/cancelar/` - Cancelar (aluno)

### Disciplinas
- `GET /api/disciplinas/` - Listar todas
- `POST /api/disciplinas/` - Criar (coordenador)

### Monitorias Ativas
- `GET /api/monitorias-ativas/` - Listar
- `GET /api/monitorias-ativas/minhas/` - Minhas (monitor)

### Horários
- `GET /api/horarios/` - Listar
- `POST /api/horarios/` - Criar

---

## 🎓 FLUXO DE USO DO SISTEMA

### Como Aluno:
1. Login → `joao.silva@ibmec.edu.br` / `senha123`
2. Ver monitorias disponíveis
3. Candidatar-se a uma monitoria
4. Acompanhar status da candidatura
5. Se aprovado → vira monitor

### Como Coordenador:
1. Login → `coord@ibmec.edu.br` / `senha123`
2. Criar novas monitorias
3. Ver candidaturas recebidas
4. Aprovar/reprovar candidatos
5. Gerenciar disciplinas

### Como Monitor:
1. Login → `ana.oliveira@ibmec.edu.br` / `senha123`
2. Ver suas monitorias ativas
3. Gerenciar horários de atendimento

---

## 🛠️ TECNOLOGIAS UTILIZADAS

### Backend
- **Django 5.2.7** - Framework web
- **Django REST Framework** - API REST
- **SimpleJWT** - Autenticação JWT
- **django-cors-headers** - CORS
- **drf-yasg** - Documentação Swagger
- **SQLite** - Banco de dados

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **React Router** - Navegação
- **TanStack Query** - State management
- **Shadcn/UI** - Componentes
- **Tailwind CSS** - Estilização

---

## 📚 DOCUMENTAÇÃO ADICIONAL

- **Guia de Testes da API**: `dev/GUIA_TESTES_API.md`
- **Integração Backend/Frontend**: `dev/README_INTEGRACAO.md`

---

## ✅ CHECKLIST DE FUNCIONALIDADES

### Backend
- [x] API REST completa
- [x] Autenticação JWT
- [x] CORS configurado
- [x] Permissões por tipo de usuário
- [x] Banco de dados com migrations
- [x] Admin Django funcional
- [x] Documentação Swagger
- [x] Dados de teste populados

### Frontend
- [x] Serviço de API criado
- [x] AuthContext atualizado
- [x] Login integrado
- [x] Gerenciamento de tokens
- [ ] Componentes consumindo API (em progresso)
- [ ] Rotas protegidas
- [ ] Tratamento de erros

---

## 🐛 TROUBLESHOOTING

### Backend não inicia
```bash
cd dev/back-end
python manage.py check
python manage.py migrate
```

### Erro de CORS no frontend
- Verifique se o backend está rodando
- Confirme a URL no `.env`: `VITE_API_URL=http://localhost:8000/api`

### Token expirado
- Tokens duram 1 hora
- Use `/api/auth/token/refresh/` para renovar
- Ou faça login novamente

### Frontend não instala dependências
```bash
cd dev/front-end
rm -rf node_modules package-lock.json
npm install
```

---

## 🎉 PRONTO!

O sistema está **100% funcional** no backend!

**Próximos passos:**
1. Instalar dependências do frontend: `cd dev/front-end && npm install`
2. Rodar frontend: `npm run dev`
3. Testar integração completa
4. Customizar componentes conforme necessário

**Dúvidas?** Consulte a documentação Swagger ou os arquivos de guia!

---

**Desenvolvido com ❤️ para o Ibmec**
