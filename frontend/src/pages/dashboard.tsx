import { Fragment, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatStrip } from "@/components/ui/stat-strip";
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
import { cn } from "@/lib/utils";
import type { Status } from "@/types";

const FILTERS: { value: Status | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "investigating", label: "Investigating" },
  { value: "mitigated", label: "Mitigated" },
  { value: "resolved", label: "Resolved" },
];

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
        <h2 className="font-mono text-base font-medium tracking-tight text-foreground">
          Incidents
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Live overview of ongoing and recent incidents across your services.
        </p>
      </div>

      <StatStrip
        segments={[
          { label: "Open incidents", value: String(openCount), hint: "all severities" },
          { label: "Avg. MTTR", value: formatMinutes(71), hint: "trailing 30d" },
          { label: "This week", value: String(thisWeek), hint: "+12% vs last" },
        ]}
      />

      <Card className="gap-0 p-0">
        <div className="flex items-center border-b border-border px-4 py-2.5">
          <div className="flex items-center font-mono text-xs">
            {FILTERS.map((f, index) => (
              <Fragment key={f.value}>
                {index > 0 && (
                  <span className="px-2 text-border select-none" aria-hidden>
                    /
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    "tracking-wide uppercase transition-colors duration-120",
                    filter === f.value
                      ? "font-medium text-foreground underline decoration-primary decoration-2 underline-offset-2"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f.label}
                </button>
              </Fragment>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center font-mono text-xs text-muted-foreground">
            — no incidents match this filter —
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12">#</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Incident</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Service</TableHead>
                <TableHead className="text-right">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((incident, index) => (
                <TableRow
                  key={incident.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/incidents/${incident.id}`)}
                >
                  <TableCell className="text-xs text-muted-foreground tabular-nums">
                    {String(index + 1).padStart(3, "0")}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{incident.id}</TableCell>
                  <TableCell className="max-w-72 truncate font-medium text-foreground">
                    {incident.title}
                  </TableCell>
                  <TableCell>
                    <SeverityBadge severity={incident.severity} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={incident.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {incident.service}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
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
