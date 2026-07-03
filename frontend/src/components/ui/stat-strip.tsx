import { cn } from "@/lib/utils";

export interface StatSegment {
  label: string;
  value: string;
  hint?: string;
}

/**
 * Full-width ruled stat strip: segments separated by hairline rules, each
 * with a micro-label on top and a large mono tabular numeral below. The
 * hint sits inline after the numeral. No icons, no cards, no elevation.
 */
export function StatStrip({
  segments,
  className,
}: {
  segments: StatSegment[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col border border-border sm:flex-row", className)}>
      {segments.map((segment) => (
        <div
          key={segment.label}
          className="flex-1 border-b border-border px-4 py-3 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
        >
          <p className="font-mono text-[10px] font-medium tracking-[0.1em] text-muted-foreground uppercase">
            {segment.label}
          </p>
          <p className="mt-1 font-mono text-2xl font-medium tracking-tight text-foreground tabular-nums">
            {segment.value}
            {segment.hint && (
              <span className="ml-2 align-baseline font-mono text-xs font-normal tracking-normal text-muted-foreground">
                {segment.hint}
              </span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
