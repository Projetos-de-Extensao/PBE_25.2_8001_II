import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';

interface CandidaturaItem {
  id: number;
  aluno_nome: string;
  monitoria_titulo: string;
  disciplina_nome: string;
  status: string;
  avaliacao_professor_status?: 'pendente' | 'aprovado' | 'lista_espera' | 'reprovado';
  avaliacao_professor_observacoes?: string;
}

export const Candidaturas = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<CandidaturaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const resp = await api.candidaturas.list();
        const list: any[] = Array.isArray(resp) ? resp : (resp?.results ?? []);
        const filtered = list.filter((c: any) => ['pendente', 'reprovada', 'aprovada'].includes(c.status));
        setItems(filtered);
      } catch (e: any) {
        setError(e?.message || 'Erro ao carregar candidaturas');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (!user) { navigate('/auth/login'); return null; }

  const handleLogout = () => { logout(); navigate('/auth/login'); };
  const handleProfile = () => navigate('/auth/profile');

  const avaliar = async (id: number, status: 'aprovado' | 'lista_espera' | 'reprovado') => {
    const observacoes = notes[id] || '';
    await api.candidaturas.avaliarProfessor(id, status, observacoes);
    setItems(prev => prev.map(i => i.id === id ? { ...i, avaliacao_professor_status: status, avaliacao_professor_observacoes: observacoes } : i));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userName={user.first_name + ' ' + (user.last_name || '')} userRole={user.tipo_usuario} onLogout={handleLogout} onProfile={handleProfile} />
      <div className="academic-layout py-6">
        <div className="mb-6">
          <h1 className="wireframe-header">Avaliação de Candidaturas</h1>
          <p className="text-muted-foreground">Avalie candidatos com status padronizado e observações opcionais.</p>
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
                  <CardTitle className="wireframe-text">{item.monitoria_titulo} • {item.disciplina_nome}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">Candidato: <b>{item.aluno_nome}</b></div>
                  <div className="text-xs text-muted-foreground">Status do sistema: {item.status}</div>
                  <div className="text-xs text-muted-foreground">Avaliação do professor: {item.avaliacao_professor_status || 'pendente'}</div>
                  <Textarea placeholder="Observações (opcional)" value={notes[item.id] || ''} onChange={e => setNotes({ ...notes, [item.id]: e.target.value })} />
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => avaliar(item.id, 'aprovado')}>Aprovar</Button>
                    <Button variant="outline" onClick={() => avaliar(item.id, 'lista_espera')}>Lista de Espera</Button>
                    <Button variant="outline" onClick={() => avaliar(item.id, 'reprovado')}>Reprovar</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {items.length === 0 && <div className="text-sm text-muted-foreground">Sem candidaturas no momento.</div>}
          </div>
        )}
      </div>
    </div>
  );
};
