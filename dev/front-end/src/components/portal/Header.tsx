import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ibmecLogo from '@/assets/ibmec-logo.png';

interface HeaderProps {
  userName?: string;
  userRole?: "aluno" | "monitor" | "coordenador" | "professor";
  onLogout?: () => void;
  onProfile?: () => void;
}

export const Header = ({ userName = "Usuário", userRole = "aluno", onLogout, onProfile }: HeaderProps) => {
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "monitor": return "Monitor";
      case "coordenador": return "Coordenador";
      case "professor": return "Professor";
      default: return "Aluno";
    }
  };

  return (
    <header className="border-b border-wireframe-medium bg-card px-4 py-3">
      <div className="academic-layout flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={ibmecLogo} alt="Ibmec" className="h-10" />
          <div>
            <h1 className="text-xl font-bold wireframe-text">Portal de Monitorias</h1>
            <p className="text-sm text-muted-foreground">Instituto Brasileiro de Mercado de Capitais</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium wireframe-text">{userName}</p>
            <p className="text-xs text-muted-foreground">{getRoleLabel(userRole)}</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={userName} />
                  <AvatarFallback className="bg-wireframe-medium text-wireframe-text">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={onProfile}>
                <User className="mr-2 h-4 w-4" />
                <span>Meu Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};