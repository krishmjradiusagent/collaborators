import { CollaboratorType } from "../../types";
import { Badge } from "../../../../../components/ui/Badge";

interface TypeBadgeProps {
  type: CollaboratorType;
}

const TYPE_CONFIG = {
  tc: {
    label: "Transaction Coordinator",
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
    label: "Virtual Assistant",
    variant: "amber" as const,
  },
} as const;

export function TypeBadge({ type }: TypeBadgeProps) {
  const config = TYPE_CONFIG[type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.tc;
  
  return (
    <Badge variant={config.variant} className="rounded-md px-1.5 h-4 text-[9px]">
      {config.label}
    </Badge>
  );
}
