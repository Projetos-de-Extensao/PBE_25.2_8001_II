// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Tipos de autenticação
interface AuthTokens {
  access: string;
  refresh: string;
}

interface User {
  id: number;
  email_institucional: string;
  matricula: string;
  first_name: string;
  last_name: string;
  tipo_usuario: 'aluno' | 'monitor' | 'professor' | 'coordenador';
  cpf?: string;
  ativo: boolean;
}

// Classe para gerenciar o token
class TokenManager {
  private static ACCESS_TOKEN_KEY = 'access_token';
  private static REFRESH_TOKEN_KEY = 'refresh_token';
  private static USER_KEY = 'user_data';

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.access);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refresh);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
}

// Função auxiliar para fazer requisições
async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = TokenManager.getAccessToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // Se o token expirou, tenta renovar
  if (response.status === 401 && token) {
    const refreshToken = TokenManager.getRefreshToken();
    
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          TokenManager.setTokens({ access: data.access, refresh: refreshToken });
          
          // Refaz a requisição original com o novo token
          headers['Authorization'] = `Bearer ${data.access}`;
          response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers,
          });
        } else {
          // Refresh token inválido, faz logout
          TokenManager.clearTokens();
          window.location.href = '/auth/login';
        }
      } catch (error) {
        TokenManager.clearTokens();
        window.location.href = '/auth/login';
      }
    }
  }

  return response;
}

// API Service
export const api = {
  // Autenticação
  auth: {
    async login(email_institucional: string, password: string) {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_institucional, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao fazer login');
      }

      const data = await response.json();
      TokenManager.setTokens(data.tokens);
      TokenManager.setUser(data.user);
      return data.user;
    },

    async register(userData: {
      email_institucional: string;
      matricula: string;
      first_name: string;
      last_name: string;
      tipo_usuario: string;
      cpf?: string;
      password: string;
      password2: string;
    }) {
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(JSON.stringify(error));
      }

      const data = await response.json();
      TokenManager.setTokens(data.tokens);
      TokenManager.setUser(data.user);
      return data.user;
    },

    async getCurrentUser() {
      const response = await fetchWithAuth('/auth/me/');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar usuário atual');
      }

      const user = await response.json();
      TokenManager.setUser(user);
      return user;
    },

    logout() {
      TokenManager.clearTokens();
    },

    isAuthenticated(): boolean {
      return !!TokenManager.getAccessToken();
    },

    getUser(): User | null {
      return TokenManager.getUser();
    },
  },

  // Monitorias
  monitorias: {
    async list(params?: { status?: string; disciplina?: number; search?: string }) {
      const queryParams = new URLSearchParams(params as any).toString();
      const url = `/monitorias/${queryParams ? `?${queryParams}` : ''}`;
      const response = await fetchWithAuth(url);
      
      if (!response.ok) throw new Error('Erro ao buscar monitorias');
      return response.json();
    },

    async get(id: number) {
      const response = await fetchWithAuth(`/monitorias/${id}/`);
      if (!response.ok) throw new Error('Erro ao buscar monitoria');
      return response.json();
    },

    async create(data: any) {
      const response = await fetchWithAuth('/monitorias/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(JSON.stringify(error));
      }
      return response.json();
    },

    async update(id: number, data: any) {
      const response = await fetchWithAuth(`/monitorias/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Erro ao atualizar monitoria');
      return response.json();
    },

    async delete(id: number) {
      const response = await fetchWithAuth(`/monitorias/${id}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Erro ao deletar monitoria');
    },

    async abertas() {
      const response = await fetchWithAuth('/monitorias/abertas/');
      if (!response.ok) throw new Error('Erro ao buscar monitorias abertas');
      return response.json();
    },

    async minhas() {
      const response = await fetchWithAuth('/monitorias/minhas/');
      if (!response.ok) throw new Error('Erro ao buscar minhas monitorias');
      return response.json();
    },
  },

  // Candidaturas
  candidaturas: {
    async list(params?: { status?: string; monitoria?: number }) {
      const queryParams = new URLSearchParams(params as any).toString();
      const url = `/candidaturas/${queryParams ? `?${queryParams}` : ''}`;
      const response = await fetchWithAuth(url);
      
      if (!response.ok) throw new Error('Erro ao buscar candidaturas');
      return response.json();
    },

    async get(id: number) {
      const response = await fetchWithAuth(`/candidaturas/${id}/`);
      if (!response.ok) throw new Error('Erro ao buscar candidatura');
      return response.json();
    },

    async create(data: { monitoria: number; observacoes_aluno?: string }) {
      const response = await fetchWithAuth('/candidaturas/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          const error = await response.json();
          throw new Error(error.error || error.detail || JSON.stringify(error));
        } else {
          const text = await response.text();
          throw new Error(`Erro no servidor (${response.status}): ${text.slice(0, 100)}`);
        }
      }
      return response.json();
    },

    async avaliar(id: number, status: 'aprovada' | 'reprovada', observacoes?: string) {
      const response = await fetchWithAuth(`/candidaturas/${id}/avaliar/`, {
        method: 'POST',
        body: JSON.stringify({ status, observacoes_coordenador: observacoes }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao avaliar candidatura');
      }
      return response.json();
    },

    async avaliarProfessor(id: number, status: 'aprovado' | 'lista_espera' | 'reprovado', observacoes?: string) {
      const response = await fetchWithAuth(`/candidaturas/${id}/avaliar_professor/`, {
        method: 'POST',
        body: JSON.stringify({ status, observacoes }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao avaliar (professor)');
      }
      return response.json();
    },

    async cancelar(id: number) {
      const response = await fetchWithAuth(`/candidaturas/${id}/cancelar/`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao cancelar candidatura');
      }
      return response.json();
    },
  },

  // Registros de Atividade (Horas)
  registrosAtividade: {
    async list() {
      const response = await fetchWithAuth('/registros-atividade/');
      if (!response.ok) throw new Error('Erro ao buscar registros');
      return response.json();
    },
    async create(data: { monitoria_ativa: number; data: string; descricao: string; horas: number }) {
      const response = await fetchWithAuth('/registros-atividade/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao registrar atividade');
      }
      return response.json();
    },
    async validar(id: number, observacao?: string) {
      const response = await fetchWithAuth(`/registros-atividade/${id}/validar/`, {
        method: 'POST',
        body: JSON.stringify({ observacao }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao validar atividade');
      }
      return response.json();
    },
    async rejeitar(id: number, observacao?: string) {
      const response = await fetchWithAuth(`/registros-atividade/${id}/rejeitar/`, {
        method: 'POST',
        body: JSON.stringify({ observacao }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao rejeitar atividade');
      }
      return response.json();
    },
  },

  // Disciplinas
  disciplinas: {
    async list() {
      const response = await fetchWithAuth('/disciplinas/');
      if (!response.ok) throw new Error('Erro ao buscar disciplinas');
      return response.json();
    },

    async get(id: number) {
      const response = await fetchWithAuth(`/disciplinas/${id}/`);
      if (!response.ok) throw new Error('Erro ao buscar disciplina');
      return response.json();
    },

    async create(data: { nome: string; codigo: string; descricao?: string }) {
      const response = await fetchWithAuth('/disciplinas/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Erro ao criar disciplina');
      return response.json();
    },
  },

  // Monitorias Ativas
  monitoriasAtivas: {
    async list(params?: { disciplina?: number }) {
      const queryParams = new URLSearchParams(params as any).toString();
      const url = `/monitorias-ativas/${queryParams ? `?${queryParams}` : ''}`;
      const response = await fetchWithAuth(url);
      
      if (!response.ok) throw new Error('Erro ao buscar monitorias ativas');
      return response.json();
    },

    async minhas() {
      const response = await fetchWithAuth('/monitorias-ativas/minhas/');
      if (!response.ok) throw new Error('Erro ao buscar minhas monitorias ativas');
      return response.json();
    },
  },

  // Horários
  horarios: {
    async list(monitoriaAtivaId?: number) {
      const url = monitoriaAtivaId 
        ? `/horarios/?monitoria_ativa=${monitoriaAtivaId}`
        : '/horarios/';
      const response = await fetchWithAuth(url);
      
      if (!response.ok) throw new Error('Erro ao buscar horários');
      return response.json();
    },

    async create(data: any) {
      const response = await fetchWithAuth('/horarios/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Erro ao criar horário');
      return response.json();
    },

    async update(id: number, data: any) {
      const response = await fetchWithAuth(`/horarios/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Erro ao atualizar horário');
      return response.json();
    },

    async delete(id: number) {
      const response = await fetchWithAuth(`/horarios/${id}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Erro ao deletar horário');
    },
  },

  // Usuários
  usuarios: {
    async list(params?: { tipo_usuario?: string }) {
      const queryParams = new URLSearchParams(params as any).toString();
      const url = `/usuarios/${queryParams ? `?${queryParams}` : ''}`;
      const response = await fetchWithAuth(url);
      
      if (!response.ok) throw new Error('Erro ao buscar usuários');
      return response.json();
    },

    async get(id: number) {
      const response = await fetchWithAuth(`/usuarios/${id}/`);
      if (!response.ok) throw new Error('Erro ao buscar usuário');
      return response.json();
    },
  },
};

export default api;
