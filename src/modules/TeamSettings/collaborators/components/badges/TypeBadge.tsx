import { CollaboratorType } from "../../types";
import { cn } from "../../../../../lib/utils";

interface TypeBadgeProps {
  type: CollaboratorType;
}

const TYPE_CONFIG = {
  tc: {
    label: "Transaction Coordinator",
    className: "bg-blue-100/50 text-blue-700 border-blue-200/50",
  },
  lender: {
    label: "Lender",
    className: "bg-emerald-100/50 text-emerald-700 border-emerald-200/50",
  },
  vendor: {
    label: "Vendor",
    className: "bg-purple-100/50 text-purple-700 border-purple-200/50",
  },
  va: {
    label: "Virtual Assistant",
    className: "bg-amber-100/50 text-amber-700 border-amber-200/50",
  },
} as const;

export function TypeBadge({ type }: TypeBadgeProps) {
  const config = TYPE_CONFIG[type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.tc;
  
  return (
    <div className={cn(
      "inline-flex items-center px-1.5 h-4 rounded-md text-[9px] font-bold uppercase tracking-tighter border shadow-sm",
      config.className
    )}>
      {config.label}
    </div>
  );
}
