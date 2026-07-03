import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { SeverityBadge } from "@/components/incidents/severity-badge";
import { StatusBadge } from "@/components/incidents/status-badge";
import { EventTimeline } from "@/components/incidents/event-timeline";
import { ChatPanel } from "@/components/chat/chat-panel";
import { useIncident } from "@/hooks/use-incidents";
import { formatDateTime } from "@/lib/format";

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-mono text-[10px] font-medium tracking-[0.1em] text-muted-foreground uppercase">
        {label}
      </span>
      <span className="font-mono text-xs text-foreground">{value}</span>
    </div>
  );
}

export default function IncidentDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: incident, isLoading } = useIncident(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-4 md:p-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 p-10 text-center">
        <p className="font-mono text-sm text-foreground">— incident not found —</p>
        <p className="font-mono text-xs text-muted-foreground">
          "{id}" doesn't match any known incident.
        </p>
        <Link
          to="/"
          className="font-mono text-xs text-primary underline-offset-2 hover:underline"
        >
          ◂ Back to incidents
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-4 md:p-6">
      <Link
        to="/"
        className="inline-flex items-baseline gap-1.5 font-mono text-xs text-muted-foreground transition-colors duration-120 hover:text-foreground"
      >
        <span aria-hidden>◂</span>
        All incidents
      </Link>

      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground">{incident.id}</span>
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
            </div>
            <h2 className="font-mono text-lg font-medium tracking-tight text-foreground">
              {incident.title}
            </h2>
            <p className="max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
              {incident.summary}
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <MetaField label="Service" value={incident.service} />
          <MetaField label="Commander" value={incident.commander} />
          <MetaField label="Created" value={formatDateTime(incident.createdAt)} />
          <MetaField label="Updated" value={formatDateTime(incident.updatedAt)} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <h3 className="mb-4 font-mono text-[10px] font-medium tracking-[0.1em] text-muted-foreground uppercase">
            Timeline
          </h3>
          <EventTimeline events={incident.events} />
        </Card>

        <Card className="flex h-[560px] flex-col gap-0 p-0 lg:col-span-2">
          <div className="border-b border-border px-4 py-3">
            <h3 className="font-mono text-[10px] font-medium tracking-[0.1em] text-muted-foreground uppercase">
              Copilot
            </h3>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              Scoped to {incident.id}
            </p>
          </div>
          <ChatPanel incidentId={incident.id} className="flex-1" compact />
        </Card>
      </div>
    </div>
  );
}
