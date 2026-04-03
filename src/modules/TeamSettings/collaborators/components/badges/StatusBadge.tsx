import { Status } from "../../types";
import { Badge } from "../../../../../components/ui/Badge";

interface StatusBadgeProps {
  status: Status;
  onResend?: () => void;
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

export function StatusBadge({ status, onResend }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.active;

  return (
    <div className="flex flex-col items-center gap-1.5 min-w-max">
      <Badge variant={config.variant} className="h-5 px-2 text-[10px] font-bold uppercase tracking-tight shrink-0">
        {config.label}
      </Badge>
      
      {status === "invited" && (
        <div className="flex flex-row items-center justify-center gap-2.5 shrink-0">

          {onResend && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onResend();
              }}
              className="text-[10px] font-semibold text-[#5A5FF2] underline underline-offset-2 hover:text-[#5A5FF2]/80 transition-all leading-none shrink-0"
            >
              Resend invite
            </button>
          )}
        </div>
      )}
    </div>
  );
}
