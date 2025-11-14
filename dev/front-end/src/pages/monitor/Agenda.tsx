import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  CalendarDays
} from 'lucide-react';

export const Agenda = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agenda, setAgenda] = useState([]);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleProfile = () => {
    navigate('/auth/profile');
  };

  const getStatusBadge = (horario: any) => {
    return <Badge className="bg-wireframe-success text-white">Disponível</Badge>;
  };

  if (!user) {
    navigate('/auth/login');
    return null;
  }

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
          <h1 className="wireframe-header">Meus Horários de Monitoria</h1>
          <p className="text-muted-foreground">Visualize os horários das suas monitorias cadastradas pelo coordenador</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">Horários da Semana</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {agenda.map((dia, diaIndex) => (
                    <div key={dia.dia}>
                      <h3 className="wireframe-subheader mb-3">{dia.dia}</h3>
                      {dia.horarios.length > 0 ? (
                        <div className="space-y-3">
                          {dia.horarios.map((horario) => (
                            <div key={horario.id} className="p-4 border border-wireframe-medium rounded-lg">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-wireframe-accent" />
                                  <span className="font-medium wireframe-text">{horario.periodo}</span>
                                </div>
                                {getStatusBadge(horario)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 border-2 border-dashed border-wireframe-medium rounded-lg text-center text-muted-foreground">
                          Nenhum horário configurado para {dia.dia.toLowerCase()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">Resumo da Agenda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total de horários:</span>
                  <span className="text-sm font-medium">
                    {agenda.reduce((total, dia) => total + dia.horarios.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Horários disponíveis:</span>
                  <span className="text-sm font-medium">
                    {agenda.reduce((total, dia) => 
                      total + dia.horarios.filter(h => h.alunosAgendados < h.maxAlunos).length, 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Alunos agendados:</span>
                  <span className="text-sm font-medium">
                    {agenda.reduce((total, dia) => 
                      total + dia.horarios.reduce((subtotal, h) => subtotal + h.alunosAgendados, 0), 0
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm wireframe-text">Informações</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>• Os horários são definidos pelo coordenador ao criar a vaga de monitoria</p>
                <p>• Para alterar horários, entre em contato com o coordenador responsável</p>
                <p>• O status é atualizado automaticamente</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};