import { Status } from "../../types";
import { cn } from "../../../../../lib/utils";
import { Clock, CheckCircle2, PauseCircle, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: Status;
  expiryDays?: number;
}

const STATUS_CONFIG = {
  invited: {
    label: "Invited",
    icon: Clock,
    className: "bg-blue-50 text-blue-600 border-blue-100",
  },
  active: {
    label: "Active",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  paused: {
    label: "Paused",
    icon: PauseCircle,
    className: "bg-slate-50 text-slate-500 border-slate-200",
  },
  removed: {
    label: "Removed",
    icon: XCircle,
    className: "bg-red-50 text-red-600 border-red-100",
  },
} as const;

export function StatusBadge({ status, expiryDays }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.active;
  const Icon = config.icon;

  return (
    <div className="flex flex-col gap-1">
      <div className={cn(
        "inline-flex items-center gap-1.5 px-2 h-5 rounded-full text-[10px] font-bold border uppercase tracking-tight transition-colors",
        config.className
      )}>
        <Icon className="h-3 w-3" />
        {config.label}
      </div>
      {status === "invited" && expiryDays && (
        <span className="text-[10px] text-slate-500 font-medium px-1">Expires in {expiryDays} days</span>
      )}
    </div>
  );
}
