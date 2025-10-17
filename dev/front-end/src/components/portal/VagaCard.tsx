import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, User } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface VagaCardProps {
  disciplina: string;
  professor: string;
  vagas: number;
  prazo: string;
  cargaHoraria?: string;
  area?: string;
  campus?: string;
  status?: "ativa" | "encerrada";
  onClick?: () => void;
  showActions?: boolean;
  onEdit?: () => void;
  onViewCandidates?: () => void;
}

export const VagaCard = ({ 
  disciplina, 
  professor, 
  vagas, 
  prazo, 
  cargaHoraria = "8h/semana",
  area = "Exatas",
  campus = "RJ",
  status = "ativa",
  onClick,
  showActions = false,
  onEdit,
  onViewCandidates
}: VagaCardProps) => {
  return (
    <Card className="cursor-pointer hover:bg-wireframe-light transition-colors" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg wireframe-text">{disciplina}</CardTitle>
          <StatusBadge status={status} />
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>Prof. {professor}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{vagas} {vagas === 1 ? 'vaga' : 'vagas'}</span>
            </div>
            <span className="text-wireframe-accent">{cargaHoraria}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Prazo: {prazo}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Área: {area}</span>
            <span>Campus: {campus}</span>
          </div>
          
          {showActions && (
            <div className="flex space-x-2 pt-2">
              <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onEdit?.(); }}>
                Editar
              </Button>
              <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onViewCandidates?.(); }}>
                Ver Candidatos
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};