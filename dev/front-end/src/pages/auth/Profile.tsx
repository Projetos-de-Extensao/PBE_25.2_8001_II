import { Header } from '@/components/portal/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, User } from 'lucide-react';

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) { navigate('/auth/login'); return null; }
  const displayName = user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : (user.email_institucional || user.email);
  const initials = displayName.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase();
  const handleLogout = () => { logout(); navigate('/auth/login'); };
  const handleHome = () => navigate('/home');

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userName={user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.email_institucional}
        userRole={user.tipo_usuario}
        onLogout={handleLogout}
        onProfile={() => {}}
      />

      <div className="academic-layout py-6">
        <div className="mb-6 flex justify-between items-center">
          <Button variant="outline" onClick={handleHome}>← Voltar</Button>
          <Button variant="outline" onClick={handleLogout}>Sair</Button>
        </div>
        <Card className="max-w-xl">
          <CardHeader className="flex flex-row items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="" alt={displayName} />
              <AvatarFallback className="bg-wireframe-medium text-wireframe-text text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="wireframe-text text-xl">{displayName}</CardTitle>
              <p className="text-sm text-muted-foreground">Perfil do Usuário</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{displayName}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email_institucional || user.email}</span>
            </div>
            {user.matricula && (
              <div className="text-xs text-muted-foreground">Matrícula: {user.matricula}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};