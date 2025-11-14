import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/portal/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Loader2, Eye } from 'lucide-react';

export const VagaCandidatos = () => {
  const { vagaId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [candidaturas, setCandidaturas] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!vagaId) return;
      try {
        const data = await api.candidaturas.list({ monitoria: Number(vagaId) });
        setCandidaturas(data.results || data);
      } catch (e) {
        toast({ title: 'Erro', description: 'Falha ao carregar candidaturas.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [vagaId]);

  const handleLogout = () => { logout(); navigate('/auth/login'); };
  const handleProfile = () => { navigate('/auth/profile'); };

  if (!user) { navigate('/auth/login'); return null; }

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
          <Button variant="outline" onClick={() => navigate('/coordinator/vagas')}>← Voltar</Button>
        </div>
        <div className="mb-6">
          <h1 className="wireframe-header">Candidaturas da Vaga</h1>
          <p className="text-muted-foreground">Monitoria ID: {vagaId}</p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="wireframe-text">Candidatos ({candidaturas.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[60vh] overflow-y-auto">
              {candidaturas.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma candidatura registrada para esta vaga.</p>
              )}
              {candidaturas.map(c => {
                const nome = c.aluno_nome || 'Aluno';
                const iniciais = nome.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase();
                return (
                  <div key={c.id} className="p-3 border border-wireframe-medium rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-wireframe-medium text-wireframe-text text-xs">{iniciais}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium wireframe-text">{nome}</p>
                        <p className="text-xs text-muted-foreground">Status: {c.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{c.status}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => navigate('/coordinator/candidatos')}> 
                        <Eye className="h-4 w-4 mr-1" /> Detalhar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VagaCandidatos;
