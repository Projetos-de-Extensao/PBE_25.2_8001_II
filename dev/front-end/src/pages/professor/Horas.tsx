import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

interface Registro {
  id: number;
  monitoria_ativa: number;
  data: string;
  descricao: string;
  horas: number;
  status: 'pendente' | 'validado' | 'rejeitado';
  monitor_nome?: string;
  disciplina_nome?: string;
}

export const Horas = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const list = await api.registrosAtividade.list();
        setItems(Array.isArray(list) ? list : (list?.results ?? []));
      } catch (e: any) {
        setError(e?.message || 'Erro ao carregar registros');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (!user) { navigate('/auth/login'); return null; }

  const handleLogout = () => { logout(); navigate('/auth/login'); };
  const handleProfile = () => navigate('/auth/profile');

  const validar = async (id: number) => {
    await api.registrosAtividade.validar(id, notes[id] || '');
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'validado' } as any : i));
  };
  const rejeitar = async (id: number) => {
    await api.registrosAtividade.rejeitar(id, notes[id] || '');
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'rejeitado' } as any : i));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userName={user.first_name + ' ' + (user.last_name || '')} userRole={user.tipo_usuario} onLogout={handleLogout} onProfile={handleProfile} />
      <div className="academic-layout py-6">
        <div className="mb-6">
          <h1 className="wireframe-header">Validação de Horas</h1>
          <p className="text-muted-foreground">Aprove ou rejeite registros enviados pelos monitores.</p>
        </div>
        {loading ? (
          <div>Carregando...</div>
        ) : error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : (
          <div className="grid gap-4">
            {items.map(item => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="wireframe-text">{item.disciplina_nome || 'Disciplina'} • {item.monitor_nome || 'Monitor'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">{item.data} • {item.horas}h</div>
                  <div className="text-sm">{item.descricao}</div>
                  <div className="text-xs text-muted-foreground">Status: {item.status}</div>
                  {item.status === 'pendente' && (
                    <div className="flex gap-2">
                      <input className="border rounded px-2 py-1 text-sm flex-1" placeholder="Observação (opcional)" value={notes[item.id] || ''} onChange={e => setNotes({ ...notes, [item.id]: e.target.value })} />
                      <Button variant="outline" onClick={() => validar(item.id)}>Validar</Button>
                      <Button variant="outline" onClick={() => rejeitar(item.id)}>Rejeitar</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {items.length === 0 && <div className="text-sm text-muted-foreground">Sem registros no momento.</div>}
          </div>
        )}
      </div>
    </div>
  );
};
