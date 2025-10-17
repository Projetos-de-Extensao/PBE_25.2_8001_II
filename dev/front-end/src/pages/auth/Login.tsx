import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock } from 'lucide-react';
import ibmecLogo from '@/assets/ibmec-logo.png';

// Mock users for redirect logic - should be imported from AuthContext in real app
const mockUsers = [
  {
    id: '1',
    nome: 'João Silva', 
    email: 'joao.silva@ibmec.edu.br',
    matricula: '2023001',
    role: 'student'
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria.santos@ibmec.edu.br', 
    matricula: '2022001',
    role: 'monitor'
  },
  {
    id: '3',
    nome: 'Prof. Carlos Lima',
    email: 'carlos.lima@ibmec.edu.br',
    role: 'coordinator'
  }
];

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Redirecionando para o portal...",
        });
        
        // Redireciona para área específica baseada no papel do usuário
        const loggedUser = mockUsers.find(u => u.email === email);
        if (loggedUser?.role === 'monitor') {
          navigate('/monitor/dashboard');
        } else if (loggedUser?.role === 'coordinator') {
          navigate('/coordinator/dashboard');
        } else {
          navigate('/home');
        }
      } else {
        toast({
          title: "Erro no login",
          description: "E-mail ou senha incorretos. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no sistema",
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
          <h1 className="wireframe-header">Portal de Monitorias Ibmec</h1>
          <p className="text-muted-foreground">Faça login com sua conta institucional</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center wireframe-text">Entrar</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail Institucional (@ibmec.edu.br)</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@ibmec.edu.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="space-y-2 mt-4 text-center">
              <Link to="/auth/forgot-password" className="text-sm text-wireframe-accent hover:underline">
                Esqueceu sua senha?
              </Link>
              <div className="text-sm text-muted-foreground">
                Não tem uma conta?{' '}
                <Link to="/auth/register" className="text-wireframe-accent hover:underline">
                  Cadastre-se
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo credentials */}
        <div className="wireframe-section text-center text-sm">
          <p className="wireframe-subheader">Credenciais de Demonstração:</p>
          <div className="space-y-1 text-muted-foreground">
            <p><strong>Aluno:</strong> joao.silva@ibmec.edu.br</p>
            <p><strong>Monitor:</strong> maria.santos@ibmec.edu.br</p>
            <p><strong>Coordenador:</strong> carlos.lima@ibmec.edu.br</p>
            <p><em>(Qualquer senha funciona)</em></p>
          </div>
        </div>
      </div>
    </div>
  );
};