import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/portal/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // retained for future optional use (not used after change)
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Loader2, Trash2, Save, Calendar, BookOpen } from 'lucide-react';

interface MonitoriaData {
  id: number;
  disciplina: number; // id
  disciplina_nome?: string;
  coordenador: number;
  coordenador_nome?: string;
  titulo: string;
  descricao: string;
  requisitos?: string;
  vagas: number;
  status: string;
  data_criacao?: string;
}

export const EditarVaga = () => {
  const { vagaId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [monitoria, setMonitoria] = useState<MonitoriaData | null>(null);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);

  // Form fields
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [requisitos, setRequisitos] = useState('');
  // Disciplina agora é texto livre; convertemos em ID na hora de salvar (create ou reuse)
  const [disciplinaNome, setDisciplinaNome] = useState<string>('');
  const [disciplinaCodigo, setDisciplinaCodigo] = useState<string>('');
  const [vagas, setVagas] = useState<number>(1);
  const [status, setStatus] = useState('aberta');

  // Helpers para disciplina (entrada livre)
  const findOrCreateDisciplina = async (nome: string, codigo: string) => {
    const trimmedNome = nome.trim();
    const trimmedCodigo = codigo.trim();
    if (!trimmedNome) throw new Error('Nome da disciplina vazio');
    if (!trimmedCodigo) throw new Error('Código da disciplina vazio');
    const existente = disciplinas.find(d => d.codigo.toLowerCase() === trimmedCodigo.toLowerCase());
    if (existente) return existente.id;
    const nova = await api.disciplinas.create({ nome: trimmedNome, codigo: trimmedCodigo });
    setDisciplinas(prev => [...prev, nova]);
    return nova.id;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!vagaId) return;
        const data = await api.monitorias.get(Number(vagaId));
        setMonitoria(data);
        setTitulo(data.titulo);
        setDescricao(data.descricao);
        setRequisitos(data.requisitos || '');
        setDisciplinaNome(data.disciplina_nome || '');
        setVagas(data.vagas);
        setStatus(data.status);
        const discList = await api.disciplinas.list();
        setDisciplinas(discList.results || discList);
        // Find discipline code
        const disc = (discList.results || discList).find((d: any) => d.id === data.disciplina);
        if (disc) setDisciplinaCodigo(disc.codigo || '');
      } catch (error:any) {
        toast({
          title: 'Erro ao carregar vaga',
          description: 'Verifique se a vaga existe.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [vagaId]);

  const handleLogout = () => { logout(); navigate('/auth/login'); };
  const handleProfile = () => { navigate('/auth/profile'); };

  const handleSave = async () => {
    if (!monitoria || !vagaId) return;
    setSaving(true);
    try {
      // Encontrar ou criar disciplina pelo nome e código digitados
      const disciplinaId = await findOrCreateDisciplina(disciplinaNome.trim(), disciplinaCodigo.trim());
      const payload = {
        titulo,
        descricao,
        requisitos,
        disciplina: disciplinaId,
        vagas,
        status
      };
      await api.monitorias.update(Number(vagaId), payload);
      toast({ title: 'Vaga atualizada', description: 'As alterações foram salvas com sucesso.' });
      navigate('/coordinator/vagas');
    } catch (error:any) {
      toast({ title: 'Erro ao salvar', description: 'Não foi possível atualizar a vaga.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
      // Utiliza lista de disciplinas para sugerir, mas entrada é livre
      const gerarCodigoDisciplina = (nome: string) => {
        const base = nome.replace(/[^A-Za-z]/g,'').slice(0,6).toUpperCase();
        const sufixo = Math.floor(Math.random()*900+100);
        return (base || 'DISC') + sufixo;
      };

      const findOrCreateDisciplina = async (nome: string) => {
        if (!nome) {
          throw new Error('Nome da disciplina vazio');
        }
        const existente = disciplinas.find(d => d.nome.toLowerCase() === nome.toLowerCase());
        if (existente) return existente.id;
        const nova = await api.disciplinas.create({ nome, codigo: gerarCodigoDisciplina(nome) });
        setDisciplinas(prev => [...prev, nova]);
        return nova.id;
      };
    if (!vagaId) return;
    if (!confirm('Tem certeza que deseja excluir esta monitoria? Esta ação é permanente.')) return;
    setDeleting(true);
    try {
      // Helpers para disciplina (entrada livre)
      const gerarCodigoDisciplina = (nome: string) => {
        const base = nome.replace(/[^A-Za-z]/g,'').slice(0,6).toUpperCase();
        const sufixo = Math.floor(Math.random()*900+100);
        return (base || 'DISC') + sufixo;
      };

      const findOrCreateDisciplina = async (nome: string) => {
        const trimmed = nome.trim();
        if (!trimmed) throw new Error('Nome da disciplina vazio');
        const existente = disciplinas.find(d => d.nome.toLowerCase() === trimmed.toLowerCase());
        if (existente) return existente.id;
        const nova = await api.disciplinas.create({ nome: trimmed, codigo: gerarCodigoDisciplina(trimmed) });
        setDisciplinas(prev => [...prev, nova]);
        return nova.id;
      };
      await api.monitorias.delete(Number(vagaId));
      toast({ title: 'Vaga excluída', description: 'A monitoria foi removida.' });
      navigate('/coordinator/vagas');
    } catch (error:any) {
      toast({ title: 'Erro ao excluir', description: 'Não foi possível excluir a vaga.', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

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
          <Button variant="outline" onClick={() => navigate('/coordinator/vagas')}>
            ← Voltar
          </Button>
        </div>

        <div className="mb-6">
          <h1 className="wireframe-header">Editar Vaga de Monitoria</h1>
          <p className="text-muted-foreground">Altere os dados da vaga ou exclua se necessário.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : monitoria ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Formulário Principal */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="wireframe-text">Dados Gerais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground">Título</label>
                    <Input value={titulo} onChange={e => setTitulo(e.target.value)} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground">Disciplina</label>
                      <Input
                        value={disciplinaNome}
                        onChange={e => setDisciplinaNome(e.target.value)}
                        placeholder="Ex: Álgebra Linear"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Código da Disciplina</label>
                      <Input
                        value={disciplinaCodigo}
                        onChange={e => setDisciplinaCodigo(e.target.value.toUpperCase())}
                        placeholder="Ex: ALG101"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground">Vagas</label>
                      <Input type="number" min={1} value={vagas} onChange={e => setVagas(Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Status</label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aberta">Aberta</SelectItem>
                          <SelectItem value="fechada">Fechada</SelectItem>
                          <SelectItem value="cancelada">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Descrição</label>
                    <Textarea value={descricao} onChange={e => setDescricao(e.target.value)} rows={4} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Requisitos</label>
                    <Textarea value={requisitos} onChange={e => setRequisitos(e.target.value)} rows={3} />
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button onClick={handleSave} disabled={saving} className="flex-1">
                      {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      <Save className="h-4 w-4 mr-2" /> Salvar Alterações
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                      {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      <Trash2 className="h-4 w-4 mr-2" /> Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Informações Complementares */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm wireframe-text">Informações Atuais</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-2">
                  <p><strong>Coordenador:</strong> {monitoria.coordenador_nome}</p>
                  <p><strong>Disciplina:</strong> {monitoria.disciplina_nome}</p>
                  <p><strong>Data Criação:</strong> {new Date(monitoria.data_criacao).toLocaleDateString('pt-BR')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm wireframe-text">Monitor & Horários</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-2">
                  <p>Associação de monitor ocorre após aprovação de candidatura.</p>
                  <p>Horários de monitoria são definidos junto ao monitor após aprovação. (Ajuste futuro)</p>
                  <p className="text-wireframe-accent">Funcionalidade de edição de horários/monitor será integrada posteriormente.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Vaga não encontrada.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EditarVaga;
