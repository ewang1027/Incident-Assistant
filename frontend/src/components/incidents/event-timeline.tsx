import { formatDateTime, formatShortClock } from "@/lib/format";
import type { IncidentEvent } from "@/types";

/**
 * Ruled ledger timeline: fixed-width mono HH:MM column, a hairline left
 * rule with square tick markers, event text in sans.
 */
export function EventTimeline({ events }: { events: IncidentEvent[] }) {
  const sorted = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return (
    <ol className="border-l border-border">
      {sorted.map((event) => (
        <li key={event.id} className="relative flex gap-4 py-2.5 pl-4">
          <span
            className="absolute top-[15px] -left-[3px] size-[5px] bg-foreground"
            aria-hidden
          />
          <span className="w-11 shrink-0 pt-px font-mono text-xs text-muted-foreground tabular-nums">
            {formatShortClock(event.timestamp)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-sans text-sm leading-relaxed text-foreground">{event.message}</p>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
              {event.actor} · {formatDateTime(event.timestamp)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
