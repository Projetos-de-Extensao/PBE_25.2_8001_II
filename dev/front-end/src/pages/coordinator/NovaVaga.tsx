import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/portal/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Loader2, Plus } from 'lucide-react';

export const NovaVaga = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);

  const [disciplinaNome, setDisciplinaNome] = useState('');
  const [disciplinaCodigo, setDisciplinaCodigo] = useState('');
  const [preRequisito, setPreRequisito] = useState('');
  const [responsabilidade, setResponsabilidade] = useState('');
  const [vagas, setVagas] = useState(1);
  const [horario, setHorario] = useState('');
  const [descricaoOpcional, setDescricaoOpcional] = useState('');

  useEffect(() => {
    const loadDisciplinas = async () => {
      try {
        const data = await api.disciplinas.list();
        setDisciplinas(data.results || data);
      } catch (e) {
        // Silencioso
      }
    };
    loadDisciplinas();
  }, []);

  const handleLogout = () => { logout(); navigate('/auth/login'); };
  const handleProfile = () => { navigate('/auth/profile'); };

  if (!user) { navigate('/auth/login'); return null; }
  if (user.tipo_usuario !== 'coordenador') { navigate('/home'); return null; }

  const findOrCreateDisciplina = async (nome: string, codigo: string) => {
    const existente = disciplinas.find(d => d.codigo.toLowerCase() === codigo.toLowerCase());
    if (existente) return existente.id;
    // criar
    const nova = await api.disciplinas.create({ nome, codigo });
    // atualizar cache local
    setDisciplinas(prev => [...prev, nova]);
    return nova.id;
  };

  const handleSubmit = async () => {
    if (!disciplinaNome.trim()) {
      toast({ title: 'Disciplina obrigatória', description: 'Informe o nome da disciplina.' , variant:'destructive'});
      return;
    }
    if (!disciplinaCodigo.trim()) {
      toast({ title: 'Código obrigatório', description: 'Informe o código da disciplina.' , variant:'destructive'});
      return;
    }
    if (vagas < 1) {
      toast({ title: 'Número de vagas inválido', description: 'Mínimo de 1 vaga.' , variant:'destructive'});
      return;
    }

    setLoading(true);
    try {
      const disciplinaId = await findOrCreateDisciplina(disciplinaNome.trim(), disciplinaCodigo.trim());
      const titulo = disciplinaNome.trim();
      const partesDescricao: string[] = [];
      if (responsabilidade.trim()) partesDescricao.push(`Responsabilidades: ${responsabilidade.trim()}`);
      if (horario.trim()) partesDescricao.push(`Horário: ${horario.trim()}`);
      if (descricaoOpcional.trim()) partesDescricao.push(descricaoOpcional.trim());
      const descricaoFinal = partesDescricao.join('\n');
      const requisitos = preRequisito.trim();

      await api.monitorias.create({
        disciplina: disciplinaId,
        titulo,
        descricao: descricaoFinal || 'Sem descrição adicional',
        requisitos,
        vagas,
        status: 'aberta'
      });

      toast({ title: 'Monitoria criada', description: 'A vaga foi registrada com sucesso.' });
      navigate('/coordinator/vagas');
    } catch (error:any) {
      toast({ title: 'Erro ao criar', description: 'Não foi possível criar a monitoria.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="wireframe-header">Nova Vaga de Monitoria</h1>
          <p className="text-muted-foreground">Preencha os dados para registrar uma nova monitoria.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">Dados Principais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground">Nome da Disciplina</label>
                    <Input value={disciplinaNome} onChange={e => setDisciplinaNome(e.target.value)} placeholder="Ex: Cálculo Diferencial" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Código da Disciplina</label>
                    <Input value={disciplinaCodigo} onChange={e => setDisciplinaCodigo(e.target.value.toUpperCase())} placeholder="Ex: CALC101" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground">Pré-requisito</label>
                    <Input value={preRequisito} onChange={e => setPreRequisito(e.target.value)} placeholder="Ex: Ter cursado Cálculo I" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Número de Vagas</label>
                    <Input type="number" min={1} value={vagas} onChange={e => setVagas(Number(e.target.value))} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Responsabilidades</label>
                  <Textarea rows={3} value={responsabilidade} onChange={e => setResponsabilidade(e.target.value)} placeholder="Ex: Preparar listas, tirar dúvidas em laboratório" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Horário (texto livre)</label>
                  <Input value={horario} onChange={e => setHorario(e.target.value)} placeholder="Ex: Quartas 14h-16h" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Descrição Opcional</label>
                  <Textarea rows={4} value={descricaoOpcional} onChange={e => setDescricaoOpcional(e.target.value)} placeholder="Observações adicionais da monitoria" />
                </div>
                <div className="pt-2">
                  <Button className="w-full" onClick={handleSubmit} disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    Criar Monitoria
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Help box removed per new requirement */}
        </div>
      </div>
    </div>
  );
};

export default NovaVaga;
