import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowLeft } from 'lucide-react';
import ibmecLogo from '@/assets/ibmec-logo.png';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email.endsWith('@ibmec.edu.br')) {
      toast({
        title: "E-mail inválido",
        description: "Use seu e-mail institucional (@ibmec.edu.br).",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Mock email sending - in real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmailSent(true);
      toast({
        title: "E-mail enviado com sucesso!",
        description: "Verifique sua caixa de entrada e spam.",
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar e-mail",
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
          <h1 className="wireframe-header">Recuperar Senha</h1>
          <p className="text-muted-foreground">
            {emailSent 
              ? "Enviamos um link de recuperação para seu e-mail" 
              : "Digite seu e-mail para receber o link de recuperação"
            }
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center wireframe-text">
              {emailSent ? "E-mail Enviado" : "Recuperação de Senha"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail Institucional</Label>
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

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
                </Button>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <div className="wireframe-placeholder h-16 w-16 mx-auto rounded-full">
                  <Mail className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Enviamos um link para <strong>{email}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Não esquece de verificar a pasta de spam também!
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setEmailSent(false)}
                  className="w-full"
                >
                  Tentar com outro e-mail
                </Button>
              </div>
            )}

            <div className="text-center mt-4">
              <Link 
                to="/auth/login" 
                className="inline-flex items-center text-sm text-wireframe-accent hover:underline"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar para o login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};