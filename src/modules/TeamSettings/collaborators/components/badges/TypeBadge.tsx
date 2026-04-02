import { CollaboratorType } from "../../types";
import { Badge } from "../../../../../components/ui/Badge";
import { cn } from "../../../../../lib/utils";

interface TypeBadgeProps {
  type: CollaboratorType;
  className?: string;
}

const TYPE_CONFIG = {
  tc: {
    label: "T.C.",
    variant: "indigo" as const,
  },
  lender: {
    label: "Lender",
    variant: "emerald" as const,
  },
  vendor: {
    label: "Vendor",
    variant: "purple" as const,
  },
  va: {
    label: "V.A.",
    variant: "amber" as const,
  },
} as const;

export function TypeBadge({ type, className }: TypeBadgeProps) {
  const config = TYPE_CONFIG[type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.tc;
  
  return (
    <Badge variant={config.variant} className={cn("h-5 px-2 text-[10px] font-bold uppercase tracking-tight", className)}>
      {config.label}
    </Badge>
  );
}
