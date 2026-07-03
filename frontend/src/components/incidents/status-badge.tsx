import { cn } from "@/lib/utils";
import type { Status } from "@/types";

/**
 * Status as a mono glyph + text mark. The glyph encodes progress
 * (● → ◐ → ◑ → ○); only "open" carries the signal color.
 */
const STATUS_CONFIG: Record<Status, { glyph: string; label: string; className: string }> = {
  open: { glyph: "●", label: "OPEN", className: "font-medium text-primary" },
  investigating: { glyph: "◐", label: "INVESTIGATING", className: "text-foreground" },
  mitigated: { glyph: "◑", label: "MITIGATED", className: "text-muted-foreground" },
  resolved: { glyph: "○", label: "RESOLVED", className: "text-muted-foreground" },
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-baseline gap-1 font-mono text-[11px] tracking-wide whitespace-nowrap",
        config.className,
        className,
      )}
    >
      <span aria-hidden>{config.glyph}</span>
      {config.label}
    </span>
  );
}
