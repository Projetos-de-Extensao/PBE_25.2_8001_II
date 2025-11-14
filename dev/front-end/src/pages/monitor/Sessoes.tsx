import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Clock, 
  Save, 
  FileText,
  CheckSquare,
  CalendarDays
} from 'lucide-react';

export const Sessoes = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessoes, setSessoes] = useState([]);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<string | null>('1');

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleProfile = () => {
    navigate('/auth/profile');
  };

  const handlePresencaChange = (sessaoId: string, alunoId: string, presente: boolean) => {
    setSessoes(sessoes.map(sessao => 
      sessao.id === sessaoId 
        ? {
            ...sessao,
            alunos: sessao.alunos.map(aluno =>
              aluno.id === alunoId ? { ...aluno, presente } : aluno
            )
          }
        : sessao
    ));
  };

  const handleTopicosChange = (sessaoId: string, topicos: string) => {
    setSessoes(sessoes.map(sessao =>
      sessao.id === sessaoId ? { ...sessao, topicosAbordados: topicos } : sessao
    ));
  };

  const handleObservacoesChange = (sessaoId: string, observacoes: string) => {
    setSessoes(sessoes.map(sessao =>
      sessao.id === sessaoId ? { ...sessao, observacoes } : sessao
    ));
  };

  const handleSalvarRegistro = (sessaoId: string) => {
    setSessoes(sessoes.map(sessao =>
      sessao.id === sessaoId ? { ...sessao, status: 'concluida' } : sessao
    ));
    
    toast({
      title: "Registro salvo com sucesso!",
      description: "As informações da sessão foram salvas.",
    });
  };

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  const sessoesPendentes = sessoes.filter(s => s.status === 'pendente');
  const sessoesConcluidas = sessoes.filter(s => s.status === 'concluida');
  const sessaoAtual = sessoes.find(s => s.id === sessaoSelecionada);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userName={user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.email_institucional}
        userRole={user.tipo_usuario}
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
          <h1 className="wireframe-header">Gestão de Sessões e Presença</h1>
          <p className="text-muted-foreground">Registre a presença dos alunos e os tópicos abordados</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar - Lista de Sessões */}
          <div className="space-y-6">
            {/* Sessões Pendentes */}
            {sessoesPendentes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm wireframe-text">Sessões Pendentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sessoesPendentes.map((sessao) => (
                    <div 
                      key={sessao.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        sessaoSelecionada === sessao.id 
                          ? 'border-wireframe-dark bg-wireframe-light'
                          : 'border-wireframe-medium hover:bg-wireframe-light'
                      }`}
                      onClick={() => setSessaoSelecionada(sessao.id)}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <CalendarDays className="h-3 w-3 text-wireframe-accent" />
                        <span className="text-xs font-medium">{sessao.data}</span>
                        <Badge variant="outline" className="text-xs">Pendente</Badge>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{sessao.horario}</span>
                      </div>
                      <p className="text-xs font-medium mt-1">{sessao.disciplina}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Sessões Concluídas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm wireframe-text">Sessões Concluídas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sessoesConcluidas.map((sessao) => (
                  <div 
                    key={sessao.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      sessaoSelecionada === sessao.id 
                        ? 'border-wireframe-dark bg-wireframe-light'
                        : 'border-wireframe-medium hover:bg-wireframe-light'
                    }`}
                    onClick={() => setSessaoSelecionada(sessao.id)}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <CalendarDays className="h-3 w-3 text-wireframe-accent" />
                      <span className="text-xs font-medium">{sessao.data}</span>
                      <Badge className="bg-wireframe-success text-white text-xs">Concluída</Badge>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{sessao.horario}</span>
                    </div>
                    <p className="text-xs font-medium mt-1">{sessao.disciplina}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Detalhes da Sessão */}
          <div className="lg:col-span-2">
            {sessaoAtual ? (
              <Card>
                <CardHeader>
                  <CardTitle className="wireframe-text">
                    Sessão - {sessaoAtual.disciplina}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>{sessaoAtual.data}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{sessaoAtual.horario}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Lista de Presença */}
                  <div>
                    <h3 className="wireframe-subheader mb-3">Controle de Presença</h3>
                    <div className="space-y-3">
                      {sessaoAtual.alunos.map((aluno) => (
                        <div key={aluno.id} className="flex items-center space-x-3 p-3 border border-wireframe-medium rounded-lg">
                          <Checkbox
                            id={`aluno-${aluno.id}`}
                            checked={aluno.presente}
                            onCheckedChange={(checked) => 
                              handlePresencaChange(sessaoAtual.id, aluno.id, !!checked)
                            }
                            disabled={sessaoAtual.status === 'concluida'}
                          />
                          <div className="flex-1">
                            <Label htmlFor={`aluno-${aluno.id}`} className="text-sm font-medium">
                              {aluno.nome}
                            </Label>
                          </div>
                          {aluno.presente && <CheckSquare className="h-4 w-4 text-wireframe-success" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tópicos Abordados */}
                  <div>
                    <Label htmlFor="topicos" className="wireframe-subheader">
                      Tópicos Abordados na Sessão
                    </Label>
                    <Textarea
                      id="topicos"
                      placeholder="Descreva os principais tópicos e conceitos trabalhados..."
                      value={sessaoAtual.topicosAbordados}
                      onChange={(e) => handleTopicosChange(sessaoAtual.id, e.target.value)}
                      rows={4}
                      className="mt-2"
                      disabled={sessaoAtual.status === 'concluida'}
                    />
                  </div>

                  {/* Observações */}
                  <div>
                    <Label htmlFor="observacoes" className="wireframe-subheader">
                      Observações Adicionais (opcional)
                    </Label>
                    <Textarea
                      id="observacoes"
                      placeholder="Anote observações sobre o progresso dos alunos, dificuldades encontradas, etc..."
                      value={sessaoAtual.observacoes}
                      onChange={(e) => handleObservacoesChange(sessaoAtual.id, e.target.value)}
                      rows={3}
                      className="mt-2"
                      disabled={sessaoAtual.status === 'concluida'}
                    />
                  </div>

                  {/* Botão de Salvar */}
                  {sessaoAtual.status === 'pendente' && (
                    <Button 
                      onClick={() => handleSalvarRegistro(sessaoAtual.id)}
                      className="w-full"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Registro da Sessão
                    </Button>
                  )}

                  {sessaoAtual.status === 'concluida' && (
                    <div className="text-center p-4 bg-wireframe-light rounded-lg border border-wireframe-medium">
                      <CheckSquare className="h-8 w-8 text-wireframe-success mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Sessão registrada com sucesso</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Selecione uma sessão para gerenciar</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};