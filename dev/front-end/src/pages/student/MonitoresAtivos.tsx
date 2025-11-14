import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Search } from 'lucide-react';
import { api } from '@/lib/api';

interface HorarioItem {
  id: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fim: string;
  local: string;
}

interface MonitoriaAtivaItem {
  id: number;
  monitor_nome: string;
  disciplina_nome: string;
  data_inicio: string;
  data_fim?: string | null;
  horarios: HorarioItem[];
}

export const MonitoresAtivos = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<MonitoriaAtivaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const resp = await api.monitoriasAtivas.list();
        const list: MonitoriaAtivaItem[] = Array.isArray(resp) ? resp : (resp?.results ?? []);
        setItems(list);
      } catch (e: any) {
        setError(e?.message || 'Erro ao carregar monitores ativos');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (!user) { navigate('/auth/login'); return null; }

  const handleLogout = () => { logout(); navigate('/auth/login'); };
  const handleProfile = () => navigate('/auth/profile');

  const filtered = useMemo(() => {
    if (!filter.trim()) return items;
    const term = filter.toLowerCase();
    return items.filter(i =>
      (i.disciplina_nome || '').toLowerCase().includes(term) ||
      (i.monitor_nome || '').toLowerCase().includes(term)
    );
  }, [items, filter]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        userName={user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.email_institucional}
        userRole={user.tipo_usuario}
        onLogout={handleLogout}
        onProfile={handleProfile}
      />

      <div className="academic-layout py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="wireframe-header">Monitores Disponíveis</h1>
            <p className="text-muted-foreground text-sm">Visualize monitorias com monitores já aprovados e ativos.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2 top-2.5 text-muted-foreground" />
              <input
                placeholder="Filtrar por disciplina ou monitor"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-wireframe-dark"
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => setFilter('')}>Limpar</Button>
          </div>
        </div>

        <Separator />

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">{error}</div>
        )}
        {loading && <p className="text-sm text-muted-foreground">Carregando monitores...</p>}

        {!loading && !error && filtered.length === 0 && (
          <div className="p-6 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200">
            <p className="font-semibold">Nenhuma monitoria ativa encontrada</p>
            <p className="text-xs mt-1">Tente novamente mais tarde ou verifique as vagas abertas.</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(item => (
            <Card key={item.id} className="border-wireframe-medium">
              <CardHeader className="py-3">
                <CardTitle className="text-sm">
                  {item.disciplina_nome}
                  <span className="block text-xs text-muted-foreground">Monitor: {item.monitor_nome}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {item.horarios && item.horarios.length > 0 ? (
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Horários de atendimento:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {item.horarios.slice(0,5).map(h => (
                        <li key={h.id}>{h.dia_semana} • {h.hora_inicio.slice(0,5)} - {h.hora_fim.slice(0,5)} • {h.local}</li>
                      ))}
                    </ul>
                    {item.horarios.length > 5 && (
                      <p className="text-[11px] text-muted-foreground">...e mais {item.horarios.length - 5} horário(s)</p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Horários ainda não cadastrados</p>
                )}
                <Button size="sm" variant="outline" onClick={() => navigate('/student/vagas')}>Ver Vagas também</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
