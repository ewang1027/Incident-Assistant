import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Clock, TrendingUp, Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SeverityBadge } from "@/components/incidents/severity-badge";
import { StatusBadge } from "@/components/incidents/status-badge";
import { useIncidents } from "@/hooks/use-incidents";
import { formatMinutes, formatRelative } from "@/lib/format";
import type { Status } from "@/types";

const FILTERS: { value: Status | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "investigating", label: "Investigating" },
  { value: "mitigated", label: "Mitigated" },
  { value: "resolved", label: "Resolved" },
];

function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card className="gap-1 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-3.5" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}

export default function Dashboard() {
  const { data: incidents, isLoading } = useIncidents();
  const [filter, setFilter] = useState<Status | "all">("all");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (!incidents) return [];
    if (filter === "all") return incidents;
    return incidents.filter((i) => i.status === filter);
  }, [incidents, filter]);

  const openCount = incidents?.filter((i) => i.status !== "resolved").length ?? 0;
  const thisWeek = incidents?.filter((i) => {
    const created = new Date(i.createdAt).getTime();
    return Date.now() - created < 7 * 24 * 60 * 60 * 1000;
  }).length ?? 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Incidents</h2>
        <p className="text-sm text-muted-foreground">
          Live overview of ongoing and recent incidents across your services.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard icon={AlertTriangle} label="Open incidents" value={String(openCount)} hint="Across all severities" />
        <KpiCard icon={Clock} label="Avg. MTTR" value={formatMinutes(71)} hint="Trailing 30 days" />
        <KpiCard icon={TrendingUp} label="This week" value={String(thisWeek)} hint="+12% vs last week" />
      </div>

      <Card className="p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as Status | "all")}>
            <TabsList>
              {FILTERS.map((f) => (
                <TabsTrigger key={f.value} value={f.value}>
                  {f.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Inbox className="size-6 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">No incidents here</p>
            <p className="text-xs text-muted-foreground">Nothing matches this filter right now.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Incident</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Service</TableHead>
                <TableHead className="text-right">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((incident) => (
                <TableRow
                  key={incident.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/incidents/${incident.id}`)}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{incident.title}</span>
                      <span className="font-mono text-xs text-muted-foreground">{incident.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <SeverityBadge severity={incident.severity} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={incident.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{incident.service}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {formatRelative(incident.updatedAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
