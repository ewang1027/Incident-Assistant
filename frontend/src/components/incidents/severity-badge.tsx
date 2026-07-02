import { cn } from "@/lib/utils";
import type { Severity } from "@/types";

const SEVERITY_CONFIG: Record<Severity, { label: string; className: string }> = {
  sev1: {
    label: "SEV1",
    className:
      "bg-red-500/15 text-red-400 border-red-500/30 dark:bg-red-500/15 dark:text-red-400",
  },
  sev2: {
    label: "SEV2",
    className:
      "bg-orange-500/15 text-orange-400 border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-400",
  },
  sev3: {
    label: "SEV3",
    className:
      "bg-amber-500/15 text-amber-400 border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400",
  },
  sev4: {
    label: "SEV4",
    className:
      "bg-slate-500/15 text-slate-400 border-slate-500/30 dark:bg-slate-500/15 dark:text-slate-400",
  },
};

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  const config = SEVERITY_CONFIG[severity];
  return (
    <span
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center justify-center rounded-md border px-1.5 font-mono text-[11px] font-semibold tracking-wide",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
