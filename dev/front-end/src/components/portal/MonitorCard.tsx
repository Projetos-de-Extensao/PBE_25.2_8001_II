import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Clock, Calendar } from "lucide-react";

interface MonitorCardProps {
  nome: string;
  disciplina: string;
  avaliacao: number;
  totalAvaliacoes: number;
  bio?: string;
  horariosDisponiveis?: string[];
  onClick?: () => void;
}

export const MonitorCard = ({ 
  nome, 
  disciplina, 
  avaliacao, 
  totalAvaliacoes,
  bio = "Monitor experiente na disciplina",
  horariosDisponiveis = [],
  onClick 
}: MonitorCardProps) => {
  return (
    <Card className="cursor-pointer hover:bg-wireframe-light transition-colors" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="" alt={nome} />
            <AvatarFallback className="bg-wireframe-medium text-wireframe-text">
              {nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg wireframe-text">{nome}</CardTitle>
            <p className="text-sm text-muted-foreground">{disciplina}</p>
            <div className="flex items-center space-x-1 mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.floor(avaliacao) 
                        ? 'fill-wireframe-dark text-wireframe-dark' 
                        : 'text-wireframe-medium'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {avaliacao.toFixed(1)} ({totalAvaliacoes} {totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'})
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{bio}</p>
          
          {horariosDisponiveis.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-sm text-wireframe-accent mb-2">
                <Clock className="h-4 w-4" />
                <span>Próximos horários disponíveis:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {horariosDisponiveis.slice(0, 3).map((horario, index) => (
                  <span key={index} className="text-xs bg-wireframe-light px-2 py-1 rounded border border-wireframe-medium">
                    {horario}
                  </span>
                ))}
                {horariosDisponiveis.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{horariosDisponiveis.length - 3} mais
                  </span>
                )}
              </div>
            </div>
          )}
          
          <Button size="sm" className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            Ver Agenda
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};