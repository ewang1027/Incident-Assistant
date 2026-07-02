import { AlertTriangle, Clock, TrendingUp } from "lucide-react";
import { AreaChart, BarChart, Card as TremorCard } from "@tremor/react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMetrics } from "@/hooks/use-incidents";
import { formatMinutes } from "@/lib/format";

/**
 * Severity colors are fixed and reused everywhere in the app (badges, this
 * dashboard) — color follows the entity, not the chart. Sev1 is treated as
 * "critical" and stepped down to sev4 as neutral, matching the status
 * palette convention: red -> orange -> amber -> slate.
 */
const SEVERITY_COLORS = ["red", "orange", "amber", "slate"] as const;

function KpiTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="gap-1 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-3.5" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="font-mono text-2xl font-semibold tabular-nums tracking-tight text-foreground">
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </Card>
  );
}

export default function Metrics() {
  const { data: metrics, isLoading } = useMetrics();

  if (isLoading || !metrics) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  // Tremor colors a BarChart per *category* (series), not per bar. To get
  // one fixed color per severity we pivot each severity into its own
  // category on a single row, rather than one category with four rows.
  const severityCategories = metrics.severityBreakdown.map((s) => s.label);
  const severityData = [
    {
      name: "Incidents",
      ...Object.fromEntries(metrics.severityBreakdown.map((s) => [s.label, s.count])),
    },
  ];

  const mttrCategories = metrics.mttrBySeverity.map((m) => m.label);
  const mttrData = [
    {
      name: "Minutes",
      ...Object.fromEntries(metrics.mttrBySeverity.map((m) => [m.label, m.mttrMinutes])),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Metrics</h2>
        <p className="text-sm text-muted-foreground">
          Incident volume, severity mix, and time-to-resolution trends.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiTile
          icon={AlertTriangle}
          label="Open incidents"
          value={String(metrics.openIncidents)}
          hint="Across all severities"
        />
        <KpiTile
          icon={Clock}
          label="Avg. MTTR"
          value={formatMinutes(metrics.avgMttrMinutes)}
          hint="Trailing 30 days"
        />
        <KpiTile
          icon={TrendingUp}
          label="Incidents this week"
          value={String(metrics.incidentsThisWeek)}
          hint={`${metrics.incidentsThisWeekDelta > 0 ? "+" : ""}${metrics.incidentsThisWeekDelta}% vs last week`}
        />
      </div>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-foreground">Incident volume</h3>
        <p className="mb-4 text-xs text-muted-foreground">Daily incident count, last 30 days</p>
        <TremorCard className="!border-0 !bg-transparent !p-0 !shadow-none">
          <AreaChart
            className="h-64"
            data={metrics.volume}
            index="date"
            categories={["incidents"]}
            colors={["indigo"]}
            showLegend={false}
            showAnimation
            curveType="monotone"
            yAxisWidth={30}
          />
        </TremorCard>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-foreground">Severity breakdown</h3>
          <p className="mb-4 text-xs text-muted-foreground">Open + resolved, trailing 30 days</p>
          <TremorCard className="!border-0 !bg-transparent !p-0 !shadow-none">
            <BarChart
              className="h-56"
              data={severityData}
              index="name"
              categories={severityCategories}
              colors={SEVERITY_COLORS as unknown as string[]}
              showLegend
              showAnimation
              layout="vertical"
              yAxisWidth={0}
              valueFormatter={(v) => `${v}`}
            />
          </TremorCard>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-foreground">MTTR by severity</h3>
          <p className="mb-4 text-xs text-muted-foreground">Minutes to resolution, average</p>
          <TremorCard className="!border-0 !bg-transparent !p-0 !shadow-none">
            <BarChart
              className="h-56"
              data={mttrData}
              index="name"
              categories={mttrCategories}
              colors={SEVERITY_COLORS as unknown as string[]}
              showLegend
              showAnimation
              layout="vertical"
              yAxisWidth={0}
              valueFormatter={(v) => `${v}m`}
            />
          </TremorCard>
        </Card>
      </div>
    </div>
  );
}
