import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Lock, Hash } from 'lucide-react';
import ibmecLogo from '@/assets/ibmec-logo.png';

export const Register = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    matricula: '',
    password: '',
    confirmPassword: '',
    userType: 'aluno'
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro na validação",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!formData.email.endsWith('@ibmec.edu.br')) {
      toast({
        title: "E-mail inválido",
        description: "Use seu e-mail institucional (@ibmec.edu.br).",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Mock registration - in real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu e-mail para ativar a conta.",
      });
      navigate('/auth/login');
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <img src={ibmecLogo} alt="Ibmec" className="h-16 mx-auto mb-4" />
          <h1 className="wireframe-header">Criar Conta</h1>
          <p className="text-muted-foreground">Cadastre-se no Portal de Monitorias</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center wireframe-text">Cadastro</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nome"
                    placeholder="Digite seu nome completo"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail Institucional</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.nome@ibmec.edu.br"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="matricula">Matrícula (para alunos)</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="matricula"
                    placeholder="Digite sua matrícula"
                    value={formData.matricula}
                    onChange={(e) => handleInputChange('matricula', e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Criar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite uma senha segura"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Meu perfil é:</Label>
                <RadioGroup 
                  value={formData.userType} 
                  onValueChange={(value) => handleInputChange('userType', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="aluno" id="aluno" />
                    <Label htmlFor="aluno">Aluno</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="professor" id="professor" />
                    <Label htmlFor="professor">Professor/Coordenador</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </form>

            <div className="text-center mt-4">
              <div className="text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <Link to="/auth/login" className="text-wireframe-accent hover:underline">
                  Fazer login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};