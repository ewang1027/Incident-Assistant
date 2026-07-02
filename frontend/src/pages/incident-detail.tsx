import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Server } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { SeverityBadge } from "@/components/incidents/severity-badge";
import { StatusBadge } from "@/components/incidents/status-badge";
import { EventTimeline } from "@/components/incidents/event-timeline";
import { ChatPanel } from "@/components/chat/chat-panel";
import { useIncident } from "@/hooks/use-incidents";
import { formatDateTime } from "@/lib/format";

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
        <p className="text-sm font-medium text-foreground">Incident not found</p>
        <p className="text-xs text-muted-foreground">
          "{id}" doesn't match any known incident.
        </p>
        <Link to="/" className="text-sm text-indigo-400 hover:underline">
          Back to incidents
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-4 md:p-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        All incidents
      </Link>

      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{incident.id}</span>
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {incident.title}
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground">{incident.summary}</p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Server className="size-3.5" />
            Service <span className="font-medium text-foreground">{incident.service}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <User className="size-3.5" />
            Commander <span className="font-medium text-foreground">{incident.commander}</span>
          </div>
          <div className="text-muted-foreground">
            Created <span className="font-medium text-foreground">{formatDateTime(incident.createdAt)}</span>
          </div>
          <div className="text-muted-foreground">
            Updated <span className="font-medium text-foreground">{formatDateTime(incident.updatedAt)}</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <h3 className="mb-5 text-sm font-semibold text-foreground">Timeline</h3>
          <EventTimeline events={incident.events} />
        </Card>

        <Card className="flex h-[560px] flex-col p-0 lg:col-span-2">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">Copilot</h3>
            <p className="text-xs text-muted-foreground">Scoped to {incident.id}</p>
          </div>
          <ChatPanel incidentId={incident.id} className="flex-1" compact />
        </Card>
      </div>
    </div>
  );
}
