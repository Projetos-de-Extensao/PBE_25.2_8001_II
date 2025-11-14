import { useEffect, useState } from 'react';
import { Header } from '@/components/portal/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Search } from 'lucide-react';
import { api } from '@/lib/api';

interface MonitoriaItem {
  id: number;
  disciplina: number; // id
  disciplina_nome: string;
  coordenador: number; // id
  coordenador_nome: string;
  titulo: string;
  descricao: string;
  requisitos?: string;
  vagas: number;
  status: string;
}

export const MonitoriasKanban = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [monitorias, setMonitorias] = useState<MonitoriaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!user) {
      console.log('[Kanban] No user, redirecting to login');
      return;
    }
    
    const fetchData = async () => {
      console.log('[Kanban] Starting fetch...');
      setLoading(true);
      setError(null);
      
      try {
        console.log('[Kanban] Calling api.monitorias.abertas()...');
        let response: any = await api.monitorias.abertas();
        console.log('[Kanban] API Response:', response);
        console.log('[Kanban] Response type:', typeof response);
        console.log('[Kanban] Is array?', Array.isArray(response));
        
        let processedData: MonitoriaItem[] = [];
        
        if (Array.isArray(response)) {
          processedData = response;
        } else if (response && typeof response === 'object' && 'results' in response) {
          processedData = response.results || [];
        } else if (response && typeof response === 'object') {
          // Pode ser um objeto paginado sem results
          processedData = [];
        }
        
        console.log('[Kanban] Processed data:', processedData);
        console.log('[Kanban] Count:', processedData.length);
        setMonitorias(processedData);
        
      } catch (e: any) {
        console.warn('[Kanban] Abertas() failed, trying list() as fallback');
        try {
          const response = await api.monitorias.list();
          let processedData: MonitoriaItem[] = Array.isArray(response)
            ? response
            : (response?.results ?? []);
          setMonitorias(processedData);
        } catch (e2: any) {
          console.error('[Kanban] Fetch error:', e2);
          setError(`Erro ao carregar: ${e2?.message || 'Desconhecido'}`);
        }
      } finally {
        setLoading(false);
        console.log('[Kanban] Fetch complete');
      }
    };
    
    fetchData();
  }, [user]);

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleProfile = () => navigate('/auth/profile');

  const normalized = Array.isArray(monitorias) ? monitorias.filter(m => {
    if (!filter.trim()) return true;
    const term = filter.toLowerCase();
    return (
      m.disciplina_nome?.toLowerCase().includes(term) ||
      m.coordenador_nome?.toLowerCase().includes(term) ||
      m.titulo?.toLowerCase().includes(term)
    );
  }) : [];

  // Separar em colunas: Abertas vs Encerradas vs Em Andamento (exemplo)
  const colAbertas = normalized.filter(m => m.status && ['aberta','open','ABERTA'].includes(m.status.toLowerCase()));
  const colEncerradas = normalized.filter(m => m.status && ['fechada','encerrada','closed'].includes(m.status.toLowerCase()));
  const colOutras = normalized.filter(m => !colAbertas.includes(m) && !colEncerradas.includes(m));

  console.log('[Kanban] Render - Columns:', {
    total: normalized.length,
    abertas: colAbertas.length,
    encerradas: colEncerradas.length,
    outras: colOutras.length
  });

  const Column = ({ title, items }: { title: string; items: MonitoriaItem[] }) => (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold tracking-wide">{title}</h3>
      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground">Nenhuma monitoria</p>
        )}
        {items.map(item => (
          <Card key={item.id} className="border-wireframe-medium">
            <CardHeader className="py-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>{item.titulo}</span>
                <Badge variant="secondary">{item.vagas} vagas</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <p className="text-muted-foreground">Disciplina: {item.disciplina_nome || 'N/D'}</p>
              <p className="text-muted-foreground">Coordenador: {item.coordenador_nome || 'N/D'}</p>
              {item.descricao && (
                <p className="line-clamp-3 text-muted-foreground">{item.descricao}</p>
              )}
              <Button size="sm" variant="outline" onClick={() => navigate(`/student/vaga/${item.id}`)}>Detalhes</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

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
            <h1 className="wireframe-header">Monitorias Disponíveis</h1>
            <p className="text-muted-foreground text-sm">Visualização somente. Para candidatar-se use os detalhes da vaga.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2 top-2.5 text-muted-foreground" />
              <input
                placeholder="Filtrar por disciplina ou professor"
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
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
            {error}
          </div>
        )}
        {loading && <p className="text-sm text-muted-foreground">Carregando monitorias...</p>}

        {!loading && !error && monitorias.length === 0 && (
          <div className="p-6 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200">
            <p className="font-semibold">Nenhuma monitoria encontrada</p>
            <p className="text-xs mt-1">Verifique se o backend está rodando e se há dados no banco.</p>
          </div>
        )}

        {!loading && monitorias.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 text-xs rounded">
            Total de {monitorias.length} monitoria(s) carregada(s) | Abertas: {colAbertas.length} | Encerradas: {colEncerradas.length} | Outras: {colOutras.length}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <Column title="Abertas" items={colAbertas} />
          <Column title="Encerradas" items={colEncerradas} />
          <Column title="Outras" items={colOutras} />
        </div>
      </div>
    </div>
  );
};
