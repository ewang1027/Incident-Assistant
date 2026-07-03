import { cn } from "@/lib/utils";
import type { Severity } from "@/types";

/**
 * Severity as a mono glyph + text mark, no background pill. Only sev1
 * carries the signal color; everything below it steps down in ink.
 */
const SEVERITY_CONFIG: Record<Severity, { glyph: string; label: string; className: string }> = {
  sev1: { glyph: "▲", label: "SEV1", className: "font-semibold text-primary" },
  sev2: { glyph: "▲", label: "SEV2", className: "font-medium text-foreground" },
  sev3: { glyph: "△", label: "SEV3", className: "text-muted-foreground" },
  sev4: { glyph: "△", label: "SEV4", className: "text-muted-foreground" },
};

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  const config = SEVERITY_CONFIG[severity];
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
