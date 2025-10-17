import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = "recebida" | "em-analise" | "aprovada" | "rejeitada" | "ativa" | "encerrada" | "agendada" | "concluida" | "cancelada";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case "recebida":
        return { label: "Recebida", variant: "secondary" as const };
      case "em-analise":
        return { label: "Em Análise", variant: "outline" as const };
      case "aprovada":
        return { label: "Aprovada", variant: "default" as const };
      case "rejeitada":
        return { label: "Rejeitada", variant: "secondary" as const };
      case "ativa":
        return { label: "Ativa", variant: "default" as const };
      case "encerrada":
        return { label: "Encerrada", variant: "secondary" as const };
      case "agendada":
        return { label: "Agendada", variant: "outline" as const };
      case "concluida":
        return { label: "Concluída", variant: "default" as const };
      case "cancelada":
        return { label: "Cancelada", variant: "secondary" as const };
      default:
        return { label: status, variant: "outline" as const };
    }
  };

  const { label, variant } = getStatusConfig(status);

  return (
    <Badge variant={variant} className={cn("text-xs", className)}>
      {label}
    </Badge>
  );
};