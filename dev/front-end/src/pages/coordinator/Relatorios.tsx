import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  BarChart3, 
  Calendar,
  Users,
  FileText,
  TrendingUp,
  PieChart,
  Clock,
  GraduationCap
} from 'lucide-react';

// Mock data for statistics
const mockEstatisticas = {
  resumoGeral: {
    totalMonitores: 35,
    totalSessoes: 1247,
    horasRealizadas: 2840,
    satisfacaoMedia: 4.6,
    taxaAprovacao: 87,
    disciplinasAtivas: 18
  },
  horasPorDisciplina: [
    { disciplina: 'Cálculo I', horas: 320, monitores: 4 },
    { disciplina: 'Programação I', horas: 280, monitores: 3 },
    { disciplina: 'Física I', horas: 260, monitores: 4 },
    { disciplina: 'Estatística', horas: 200, monitores: 2 },
    { disciplina: 'Química Geral', horas: 180, monitores: 3 }
  ],
  performanceMonitores: [
    { nome: 'Maria Santos', disciplina: 'Cálculo I', sessoes: 45, avaliacao: 4.9, horas: 90 },
    { nome: 'João Silva', disciplina: 'Programação I', sessoes: 38, avaliacao: 4.8, horas: 76 },
    { nome: 'Ana Costa', disciplina: 'Física I', sessoes: 42, avaliacao: 4.7, horas: 84 },
    { nome: 'Carlos Lima', disciplina: 'Estatística', sessoes: 35, avaliacao: 4.6, horas: 70 },
    { nome: 'Paula Oliveira', disciplina: 'Química Geral', sessoes: 33, avaliacao: 4.8, horas: 66 }
  ]
};

const tiposRelatorio = [
  { value: 'geral', label: 'Relatório Geral do Programa' },
  { value: 'monitores', label: 'Performance dos Monitores' },
  { value: 'disciplinas', label: 'Relatório por Disciplina' },
  { value: 'satisfacao', label: 'Pesquisa de Satisfação' },
  { value: 'frequencia', label: 'Relatório de Frequência' },
  { value: 'candidaturas', label: 'Análise de Candidaturas' }
];

export const Relatorios = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tipoRelatorio, setTipoRelatorio] = useState('geral');
  const [dataInicio, setDataInicio] = useState('2024-11-01');
  const [dataFim, setDataFim] = useState('2024-11-30');
  const [formato, setFormato] = useState('excel');

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleProfile = () => {
    navigate('/auth/profile');
  };

  const handleGerarRelatorio = () => {
    toast({
      title: "Relatório gerado com sucesso!",
      description: `O relatório foi exportado como ${formato.toUpperCase()}. Verifique sua pasta de downloads.`,
    });
  };

  const stats = mockEstatisticas;

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
            <Button variant="outline" onClick={() => navigate('/coordinator/dashboard')}>
              ← Voltar ao Dashboard
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="wireframe-header">Relatórios e Estatísticas</h1>
          <p className="text-muted-foreground">Gere relatórios detalhados sobre o programa de monitorias</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar - Geração de Relatórios */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm wireframe-text">Gerar Relatório</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tipo" className="text-xs text-muted-foreground">Tipo de Relatório</Label>
                  <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposRelatorio.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3 grid-cols-2">
                  <div>
                    <Label htmlFor="dataInicio" className="text-xs text-muted-foreground">Data Início</Label>
                    <Input
                      id="dataInicio"
                      type="date"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataFim" className="text-xs text-muted-foreground">Data Fim</Label>
                    <Input
                      id="dataFim"
                      type="date"
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="formato" className="text-xs text-muted-foreground">Formato</Label>
                  <Select value={formato} onValueChange={setFormato}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                      <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                      <SelectItem value="csv">CSV (.csv)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleGerarRelatorio} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Gerar e Exportar
                </Button>
              </CardContent>
            </Card>

            {/* Relatórios Rápidos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm wireframe-text">Relatórios Rápidos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Resumo do Mês
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Top 10 Monitores
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Evolução Semestral
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <PieChart className="h-4 w-4 mr-2" />
                  Distribuição por Área
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Estatísticas Gerais */}
            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">Resumo Executivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-wireframe-light rounded-lg">
                    <Users className="h-8 w-8 text-wireframe-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold wireframe-text">{stats.resumoGeral.totalMonitores}</div>
                    <p className="text-sm text-muted-foreground">Monitores Ativos</p>
                  </div>
                  <div className="text-center p-4 bg-wireframe-light rounded-lg">
                    <Clock className="h-8 w-8 text-wireframe-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold wireframe-text">{stats.resumoGeral.horasRealizadas.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">Horas Realizadas</p>
                  </div>
                  <div className="text-center p-4 bg-wireframe-light rounded-lg">
                    <TrendingUp className="h-8 w-8 text-wireframe-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold wireframe-text">{stats.resumoGeral.satisfacaoMedia}</div>
                    <p className="text-sm text-muted-foreground">Satisfação Média</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="flex justify-between items-center p-3 border border-wireframe-medium rounded">
                    <span className="text-sm text-muted-foreground">Total de Sessões:</span>
                    <span className="font-medium">{stats.resumoGeral.totalSessoes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-wireframe-medium rounded">
                    <span className="text-sm text-muted-foreground">Taxa de Aprovação:</span>
                    <span className="font-medium text-green-600">{stats.resumoGeral.taxaAprovacao}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-wireframe-medium rounded">
                    <span className="text-sm text-muted-foreground">Disciplinas Ativas:</span>
                    <span className="font-medium">{stats.resumoGeral.disciplinasAtivas}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Horas por Disciplina */}
            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">Horas Realizadas por Disciplina</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.horasPorDisciplina.map((disciplina, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-wireframe-medium rounded-lg">
                      <div className="flex items-center space-x-3">
                        <GraduationCap className="h-4 w-4 text-wireframe-accent" />
                        <div>
                          <p className="font-medium wireframe-text">{disciplina.disciplina}</p>
                          <p className="text-sm text-muted-foreground">{disciplina.monitores} monitor{disciplina.monitores !== 1 ? 'es' : ''}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{disciplina.horas}h</p>
                        <div className="w-24 bg-wireframe-light rounded-full h-2 mt-1">
                          <div 
                            className="bg-wireframe-dark h-2 rounded-full" 
                            style={{ width: `${(disciplina.horas / 320) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance dos Monitores */}
            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">Top 5 Monitores por Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.performanceMonitores.map((monitor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-wireframe-medium rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-wireframe-accent text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium wireframe-text">{monitor.nome}</p>
                          <p className="text-sm text-muted-foreground">{monitor.disciplina}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-4 text-sm">
                          <div>
                            <p className="font-medium">{monitor.sessoes} sessões</p>
                            <p className="text-muted-foreground">{monitor.horas}h total</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">{monitor.avaliacao}</span>
                            <span className="text-yellow-500">★</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};