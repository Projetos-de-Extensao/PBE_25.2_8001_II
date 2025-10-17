import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Star, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  User,
  BarChart3
} from 'lucide-react';

// Mock data - in real app would fetch from API
const mockFeedbacks = [
  {
    id: '1',
    aluno: 'Anônimo',
    nota: 5,
    comentario: 'Excelente monitora! Muito didática e paciente. Me ajudou bastante com derivadas e sempre estava disponível para tirar dúvidas. Recomendo muito!',
    data: '2024-11-18',
    disciplina: 'Cálculo I'
  },
  {
    id: '2',
    aluno: 'Anônimo',
    nota: 5,
    comentario: 'Explica muito bem e sempre tira todas as dúvidas com muita paciência. As sessões são produtivas e bem organizadas.',
    data: '2024-11-15',
    disciplina: 'Cálculo I'
  },
  {
    id: '3',
    aluno: 'Anônimo',
    nota: 4,
    comentario: 'Boa monitora, mas às vezes um pouco rápida nas explicações. No geral, muito competente e prestativa.',
    data: '2024-11-12',
    disciplina: 'Cálculo I'
  },
  {
    id: '4',
    aluno: 'Anônimo',
    nota: 5,
    comentario: 'Metodologia excelente! Consegue explicar conceitos complexos de forma simples e clara. Muito profissional.',
    data: '2024-11-10',
    disciplina: 'Cálculo I'
  },
  {
    id: '5',
    aluno: 'Anônimo',
    nota: 4,
    comentario: 'Monitoria muito útil. Gostaria apenas de mais exemplos práticos, mas no geral muito bom atendimento.',
    data: '2024-11-08',
    disciplina: 'Cálculo I'
  },
  {
    id: '6',
    aluno: 'Anônimo',
    nota: 5,
    comentario: 'Simplesmente perfeita! Salvou meu semestre em Cálculo. Muito obrigado pela dedicação e paciência.',
    data: '2024-11-05',
    disciplina: 'Cálculo I'
  }
];

const estatisticas = {
  notaMedia: 4.8,
  totalFeedbacks: mockFeedbacks.length,
  distribuicao: {
    5: mockFeedbacks.filter(f => f.nota === 5).length,
    4: mockFeedbacks.filter(f => f.nota === 4).length,
    3: mockFeedbacks.filter(f => f.nota === 3).length,
    2: mockFeedbacks.filter(f => f.nota === 2).length,
    1: mockFeedbacks.filter(f => f.nota === 1).length,
  }
};

export const Feedbacks = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [filtroNota, setFiltroNota] = useState('todas');
  const [ordenacao, setOrdenacao] = useState('recente');

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleProfile = () => {
    navigate('/auth/profile');
  };

  let feedbacksFiltrados = [...mockFeedbacks];

  // Filtro por nota
  if (filtroNota !== 'todas') {
    feedbacksFiltrados = feedbacksFiltrados.filter(f => f.nota === parseInt(filtroNota));
  }

  // Ordenação
  if (ordenacao === 'recente') {
    feedbacksFiltrados.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  } else if (ordenacao === 'antigo') {
    feedbacksFiltrados.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  } else if (ordenacao === 'nota-alta') {
    feedbacksFiltrados.sort((a, b) => b.nota - a.nota);
  } else if (ordenacao === 'nota-baixa') {
    feedbacksFiltrados.sort((a, b) => a.nota - b.nota);
  }

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userName={user.nome} 
        userRole={user.role}
        onLogout={handleLogout}
        onProfile={handleProfile}
      />

      <div className="academic-layout py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button variant="outline" onClick={() => navigate('/monitor/dashboard')}>
              ← Voltar ao Dashboard
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="wireframe-header">Meus Feedbacks</h1>
          <p className="text-muted-foreground">Veja as avaliações dos alunos sobre suas monitorias</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar - Estatísticas e Filtros */}
          <div className="space-y-6">
            {/* Estatísticas Gerais */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm wireframe-text">Estatísticas Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Star className="h-5 w-5 fill-wireframe-dark text-wireframe-dark" />
                    <span className="text-2xl font-bold wireframe-text">{estatisticas.notaMedia}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Baseado em {estatisticas.totalFeedbacks} avaliações
                  </p>
                </div>
                
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((nota) => (
                    <div key={nota} className="flex items-center space-x-2">
                      <span className="text-xs w-4">{nota}</span>
                      <Star className="h-3 w-3 fill-wireframe-dark text-wireframe-dark" />
                      <div className="flex-1 bg-wireframe-light rounded-full h-2">
                        <div 
                          className="bg-wireframe-dark h-2 rounded-full" 
                          style={{ 
                            width: `${(estatisticas.distribuicao[nota as keyof typeof estatisticas.distribuicao] / estatisticas.totalFeedbacks) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-xs w-4">{estatisticas.distribuicao[nota as keyof typeof estatisticas.distribuicao]}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm wireframe-text">Filtros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground">Filtrar por nota</label>
                  <Select value={filtroNota} onValueChange={setFiltroNota}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as notas</SelectItem>
                      <SelectItem value="5">5 estrelas</SelectItem>
                      <SelectItem value="4">4 estrelas</SelectItem>
                      <SelectItem value="3">3 estrelas</SelectItem>
                      <SelectItem value="2">2 estrelas</SelectItem>
                      <SelectItem value="1">1 estrela</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Ordenar por</label>
                  <Select value={ordenacao} onValueChange={setOrdenacao}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recente">Mais recente</SelectItem>
                      <SelectItem value="antigo">Mais antigo</SelectItem>
                      <SelectItem value="nota-alta">Nota mais alta</SelectItem>
                      <SelectItem value="nota-baixa">Nota mais baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm wireframe-text">Insights</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>• {Math.round((estatisticas.distribuicao[5] / estatisticas.totalFeedbacks) * 100)}% dos alunos deram nota máxima</p>
                <p>• Você tem uma excelente reputação como monitor</p>
                <p>• Continue mantendo sua didática e paciência</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Lista de Feedbacks */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="wireframe-text">
                    Avaliações dos Alunos
                    <Badge variant="outline" className="ml-2">
                      {feedbacksFiltrados.length} resultado{feedbacksFiltrados.length !== 1 ? 's' : ''}
                    </Badge>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {feedbacksFiltrados.length > 0 ? (
                  <div className="space-y-4">
                    {feedbacksFiltrados.map((feedback) => (
                      <div key={feedback.id} className="p-4 border border-wireframe-medium rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">{feedback.aluno}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {feedback.disciplina}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 mb-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= feedback.nota 
                                      ? 'fill-wireframe-dark text-wireframe-dark' 
                                      : 'text-wireframe-medium'
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{feedback.data}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          "{feedback.comentario}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Nenhum feedback encontrado com os filtros aplicados
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};