import { Status } from "../../types";
import { Badge } from "../../../../../components/ui/Badge";
import { Clock, CheckCircle2, PauseCircle, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: Status;
  expiryDays?: number;
}

const STATUS_CONFIG = {
  invited: {
    label: "Invited",
    icon: Clock,
    variant: "indigo" as const,
  },
  active: {
    label: "Active",
    icon: CheckCircle2,
    variant: "emerald" as const,
  },
  paused: {
    label: "Paused",
    icon: PauseCircle,
    variant: "slate" as const,
  },
  removed: {
    label: "Removed",
    icon: XCircle,
    variant: "rose" as const,
  },
} as const;

export function StatusBadge({ status, expiryDays }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.active;
  const Icon = config.icon;

  return (
    <div className="flex flex-col gap-1.5 min-w-[90px]">
      <Badge variant={config.variant} className="gap-1.5 h-6 px-2.5">
        <Icon className="h-3.5 w-3.5" />
        {config.label}
      </Badge>
      {status === "invited" && expiryDays && (
        <span className="text-[10px] text-zinc-400 font-bold px-1 flex items-center gap-1">
           Expires in {expiryDays} days
        </span>
      )}
    </div>
  );
}
