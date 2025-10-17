import { Header } from '@/components/portal/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, MapPin } from 'lucide-react';

// Mock data
const mockAgendamentos = [
  {
    id: '1',
    monitor: 'Maria Santos',
    disciplina: 'Cálculo I',
    data: '2024-01-15',
    horario: '14:00',
    local: 'Sala 205',
    status: 'Confirmado',
  },
  {
    id: '2',
    monitor: 'João Silva',
    disciplina: 'Programação',
    data: '2024-01-18',
    horario: '16:00',
    local: 'Laboratório 3',
    status: 'Pendente',
  },
];

export const Agendamentos = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Meus Agendamentos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas sessões de monitoria agendadas
          </p>
        </div>

        <div className="space-y-6">
          {mockAgendamentos.map((agendamento) => (
            <Card key={agendamento.id} className="w-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{agendamento.disciplina}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <User className="w-4 h-4" />
                      <span>Monitor: {agendamento.monitor}</span>
                    </div>
                  </div>
                  <Badge variant={agendamento.status === 'Confirmado' ? 'default' : 'secondary'}>
                    {agendamento.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{new Date(agendamento.data).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{agendamento.horario}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{agendamento.local}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {agendamento.status === 'Confirmado' && (
                    <Button variant="outline" size="sm">
                      Cancelar
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Reagendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {mockAgendamentos.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Nenhum agendamento encontrado</h3>
                <p className="text-muted-foreground">
                  Você ainda não tem sessões de monitoria agendadas.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};