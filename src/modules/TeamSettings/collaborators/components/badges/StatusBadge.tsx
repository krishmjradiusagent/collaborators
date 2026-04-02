import { Status } from "../../types";
import { Badge } from "../../../../../components/ui/Badge";

interface StatusBadgeProps {
  status: Status;
  expiryDays?: number;
}

const STATUS_CONFIG = {
  invited: {
    label: "Invited",
    variant: "indigo" as const,
  },
  active: {
    label: "Active",
    variant: "emerald" as const,
  },
  paused: {
    label: "Paused",
    variant: "amber" as const,
  },
  removed: {
    label: "Removed",
    variant: "rose" as const,
  },
} as const;

export function StatusBadge({ status, expiryDays }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.active;

  return (
    <div className="flex flex-col gap-1 items-center">
      <Badge variant={config.variant} className="h-5 px-2 text-[10px] font-bold uppercase tracking-tight">
        {config.label}
      </Badge>
      {status === "invited" && expiryDays && (
        <Badge variant="outline" className="h-4 px-1.5 text-[8px] font-bold text-slate-500 uppercase tracking-tighter border-slate-200">
           EXP {expiryDays}D
        </Badge>
      )}
    </div>
  );
}
