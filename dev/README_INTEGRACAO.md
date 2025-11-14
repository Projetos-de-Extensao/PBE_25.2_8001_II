# Sistema de Monitorias - Integração Frontend + Backend


## 📋 Visão Geral (Novembro/2025)

### Principais mudanças recentes:
- **Landing page pública**: qualquer usuário pode ver as vagas abertas sem login.
- **Fluxo de aprovação**: agora, o professor avalia o candidato primeiro; só após o parecer do professor o coordenador pode aprovar/reprovar.
- **Disciplinas**: criação livre, com código manual e reuso automático.
- **Remoção de métricas e relatórios**: satisfação dos alunos, relatórios e dashboards extras foram removidos.
- **Box de validação de horas**: removido do dashboard do professor.
- **UI simplificada**: perfil só mostra nome/email, sem métricas extras; menus e botões de recursos removidos não aparecem mais.

Este projeto integra:
- **Backend**: Django REST Framework com JWT Authentication
- **Frontend**: React + TypeScript + Vite + Shadcn/UI
- **Banco de Dados**: SQLite (desenvolvimento)

## 🚀 Como Rodar o Projeto

### Backend (Django)

1. **Ativar ambiente virtual**:
   ```bash
   cd dev/back-end
   # No Windows:
   ..\..\.venv\Scripts\activate
   ```

2. **Instalar dependências** (se necessário):
   ```bash
   pip install -r requirements.txt
   ```

3. **Executar migrações**:
   ```bash
   python manage.py migrate
   ```

4. **Criar superusuário** (para acessar o admin):
   ```bash
   python manage.py createsuperuser
   ```

5. **Iniciar servidor**:
   ```bash
   python manage.py runserver
   ```

   O backend estará rodando em: `http://localhost:8000`

### Frontend (React + Vite)

1. **Navegar para pasta do frontend**:
   ```bash
   cd dev/front-end
   ```

2. **Instalar dependências**:
   ```bash
   npm install
   # ou
   bun install
   ```

3. **Iniciar servidor de desenvolvimento**:
   ```bash
   npm run dev
   # ou
   bun dev
   ```

   O frontend estará rodando em: `http://localhost:5173`

## 📚 Documentação da API

Com o backend rodando, acesse:
- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **Admin Django**: http://localhost:8000/admin/

## 🔐 Endpoints da API

### Autenticação
- `POST /api/auth/register/` - Registro de novos usuários
- `POST /api/auth/login/` - Login
- `POST /api/auth/token/refresh/` - Renovar token
- `GET /api/auth/me/` - Dados do usuário logado

### Monitorias
- `GET /api/monitorias/` - Listar monitorias
- `POST /api/monitorias/` - Criar monitoria (coordenador)
- `GET /api/monitorias/{id}/` - Detalhes da monitoria
- `PATCH /api/monitorias/{id}/` - Atualizar monitoria
- `DELETE /api/monitorias/{id}/` - Deletar monitoria
- `GET /api/monitorias/abertas/` - Monitorias abertas
- `GET /api/monitorias/minhas/` - Minhas monitorias (coordenador)

### Candidaturas
- `GET /api/candidaturas/` - Listar candidaturas
- `POST /api/candidaturas/` - Criar candidatura (aluno)
- `GET /api/candidaturas/{id}/` - Detalhes da candidatura
- `POST /api/candidaturas/{id}/avaliar/` - Avaliar candidatura (coordenador)
- `POST /api/candidaturas/{id}/cancelar/` - Cancelar candidatura (aluno)

### Disciplinas
- `GET /api/disciplinas/` - Listar disciplinas
- `POST /api/disciplinas/` - Criar disciplina (coordenador)
- `GET /api/disciplinas/{id}/` - Detalhes da disciplina

### Monitorias Ativas
- `GET /api/monitorias-ativas/` - Listar monitorias ativas
- `GET /api/monitorias-ativas/minhas/` - Minhas monitorias (monitor)

### Horários
- `GET /api/horarios/` - Listar horários
- `POST /api/horarios/` - Criar horário
- `PATCH /api/horarios/{id}/` - Atualizar horário
- `DELETE /api/horarios/{id}/` - Deletar horário

## 🔧 Estrutura de Autenticação

O sistema usa **JWT (JSON Web Tokens)** para autenticação:

1. **Login**: Envia email e senha para `/api/auth/login/`
2. **Resposta**: Recebe `access_token` e `refresh_token`
3. **Requisições**: Inclui `Authorization: Bearer {access_token}` no header
4. **Renovação**: Quando o access_token expira, usa o refresh_token

O serviço `api.ts` gerencia automaticamente:
- Armazenamento de tokens no localStorage
- Renovação automática de tokens expirados
- Redirect para login quando refresh_token expira

## 📦 Tipos de Usuário

- **aluno**: Pode se candidatar a monitorias
- **monitor**: Aluno aprovado em uma monitoria
- **professor**: Avalia candidaturas e valida horas dos monitores
- **coordenador**: Cria e gerencia monitorias, aprova candidaturas (após parecer do professor)

## 🗂️ Estrutura de Dados

### Usuário
```typescript
{
  id: number;
  email_institucional: string;
  matricula: string;
  first_name: string;
  last_name: string;
  tipo_usuario: 'aluno' | 'monitor' | 'professor' | 'coordenador';
  cpf?: string;
  ativo: boolean;
}
```

### Monitoria
```typescript
{
  id: number;
  disciplina: number;
  coordenador: number;
  titulo: string;
  descricao: string;
  requisitos?: string;
  vagas: number;
  data_limite: string;
  status: 'aberta' | 'fechada' | 'cancelada';
}
```

### Candidatura
```typescript
{
   id: number;
   aluno: number;
   monitoria: number;
   status: 'pendente' | 'aprovada' | 'reprovada' | 'cancelada';
   data_candidatura: string;
   observacoes_aluno?: string;
   observacoes_coordenador?: string;
   avaliacao_professor_status?: 'pendente' | 'aprovado' | 'lista_espera';
   avaliacao_professor_observacoes?: string;
}
```

## 🎨 Uso do Serviço API no Frontend

```typescript
import { api } from '@/lib/api';

// Login
try {
  const user = await api.auth.login('email@ibmec.edu.br', 'senha');
  console.log('Usuário logado:', user);
} catch (error) {
  console.error('Erro no login:', error);
}

// Listar monitorias
const monitorias = await api.monitorias.list({ status: 'aberta' });

// Criar candidatura
await api.candidaturas.create({
   monitoria: 1,
   observacoes_aluno: 'Tenho experiência na disciplina'
});

// Aprovação de candidatura (novo fluxo)
// 1. Professor avalia (aprovado ou lista_espera)
// 2. Coordenador só pode aprovar após parecer do professor

// Logout
api.auth.logout();
```

## 🔒 CORS

O backend está configurado para aceitar requisições de:
- `http://localhost:5173` (Vite dev server)
- `http://127.0.0.1:5173`

## 🐛 Troubleshooting

### Erro de CORS
- Certifique-se de que o backend está rodando
- Verifique se a URL da API está correta no `.env`

### Token inválido
- Faça logout e login novamente
- Verifique se o SECRET_KEY do Django não mudou

### Erro 404 na API
- Confirme que está usando `/api/` no início das rotas
- Verifique a documentação em `/api/docs/`


## 📝 Observações Finais

- Relatórios, satisfação dos alunos e dashboards extras foram removidos do escopo.
- O fluxo de aprovação agora exige avaliação do professor antes do coordenador.
- Landing page é pública e mostra vagas abertas sem login.

## 🤝 Contribuindo

Para adicionar novos endpoints:
1. Crie/atualize os serializers em `myapp/serializers.py`
2. Adicione views em `myapp/api_views.py`
3. Registre as rotas em `myapp/api_urls.py`
4. Atualize o serviço em `front-end/src/lib/api.ts`
5. Use nos componentes do frontend
