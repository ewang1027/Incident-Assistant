import {
  Radar,
  BellRing,
  CheckCheck,
  ArrowRightLeft,
  Wrench,
  StickyNote,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/format";
import type { EventKind, IncidentEvent } from "@/types";

const EVENT_CONFIG: Record<EventKind, { icon: React.ElementType; className: string }> = {
  detected: { icon: Radar, className: "bg-rose-500/15 text-rose-400" },
  paged: { icon: BellRing, className: "bg-amber-500/15 text-amber-400" },
  acknowledged: { icon: CheckCheck, className: "bg-blue-500/15 text-blue-400" },
  status_change: { icon: ArrowRightLeft, className: "bg-violet-500/15 text-violet-400" },
  action: { icon: Wrench, className: "bg-indigo-500/15 text-indigo-400" },
  note: { icon: StickyNote, className: "bg-slate-500/15 text-slate-400" },
  resolved: { icon: Flag, className: "bg-emerald-500/15 text-emerald-400" },
};

export function EventTimeline({ events }: { events: IncidentEvent[] }) {
  const sorted = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return (
    <ol className="relative space-y-6">
      {sorted.map((event, index) => {
        const config = EVENT_CONFIG[event.kind];
        const Icon = config.icon;
        const isLast = index === sorted.length - 1;

        return (
          <li key={event.id} className="relative flex gap-3.5">
            {!isLast && (
              <span className="absolute top-7 left-[13px] -bottom-6 w-px bg-border" aria-hidden />
            )}
            <div
              className={cn(
                "z-10 flex size-7 shrink-0 items-center justify-center rounded-full",
                config.className,
              )}
            >
              <Icon className="size-3.5" />
            </div>
            <div className="min-w-0 flex-1 pb-0.5">
              <p className="text-sm text-foreground">{event.message}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {event.actor} · {formatDateTime(event.timestamp)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
