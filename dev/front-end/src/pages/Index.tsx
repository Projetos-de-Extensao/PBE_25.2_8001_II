import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Search } from 'lucide-react';
import { api } from '@/lib/api';

type MonitoriaItem = {
  id: number;
  disciplina_nome: string;
  coordenador_nome: string;
  titulo: string;
  descricao?: string;
  vagas: number;
  status: string;
};

const Index = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<MonitoriaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const resp = await api.monitorias.abertas();
        const list: MonitoriaItem[] = Array.isArray(resp) ? resp : (resp?.results ?? []);
        setItems(list);
      } catch (e: any) {
        setError(e?.message || 'Erro ao carregar monitorias');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!filter.trim()) return items;
    const term = filter.toLowerCase();
    return items.filter(m =>
      (m.disciplina_nome || '').toLowerCase().includes(term) ||
      (m.coordenador_nome || '').toLowerCase().includes(term) ||
      (m.titulo || '').toLowerCase().includes(term)
    );
  }, [items, filter]);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="wireframe-text font-semibold">Portal de Monitorias Ibmec</div>
          <div>
            <Button variant="outline" onClick={() => navigate('/auth/login')}>Entrar</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="wireframe-header">Vagas de Monitoria</h1>
            <p className="text-muted-foreground text-sm">Visualização pública das vagas abertas.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2 top-2.5 text-muted-foreground" />
              <input
                placeholder="Filtrar por disciplina, coordenador ou título"
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
        {loading && <p className="text-sm text-muted-foreground">Carregando vagas...</p>}

        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map(m => (
              <Card key={m.id} className="border-wireframe-medium">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>{m.titulo}</span>
                    <span className="text-xs text-muted-foreground">{m.vagas} vagas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <p className="text-muted-foreground">Disciplina: {m.disciplina_nome || 'N/D'}</p>
                  <p className="text-muted-foreground">Coordenador: {m.coordenador_nome || 'N/D'}</p>
                  {m.descricao && <p className="line-clamp-3 text-muted-foreground">{m.descricao}</p>}
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <div className="p-6 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200">
                <p className="font-semibold">Nenhuma vaga encontrada</p>
                <p className="text-xs mt-1">Tente limpar o filtro ou volte mais tarde.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
