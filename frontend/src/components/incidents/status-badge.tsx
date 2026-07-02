import { cn } from "@/lib/utils";
import type { Status } from "@/types";

const STATUS_CONFIG: Record<Status, { label: string; dotClassName: string; textClassName: string }> = {
  open: {
    label: "Open",
    dotClassName: "bg-rose-500",
    textClassName: "text-rose-400",
  },
  investigating: {
    label: "Investigating",
    dotClassName: "bg-amber-500",
    textClassName: "text-amber-400",
  },
  mitigated: {
    label: "Mitigated",
    dotClassName: "bg-blue-500",
    textClassName: "text-blue-400",
  },
  resolved: {
    label: "Resolved",
    dotClassName: "bg-emerald-500",
    textClassName: "text-emerald-400",
  },
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const config = STATUS_CONFIG[status];
  const isLive = status === "open" || status === "investigating";
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", config.textClassName, className)}>
      <span className="relative flex size-1.5">
        {isLive && (
          <span
            className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", config.dotClassName)}
          />
        )}
        <span className={cn("relative inline-flex size-1.5 rounded-full", config.dotClassName)} />
      </span>
      {config.label}
    </span>
  );
}
