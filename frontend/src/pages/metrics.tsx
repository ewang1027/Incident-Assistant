import { AreaChart, BarChart } from "@tremor/react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatStrip } from "@/components/ui/stat-strip";
import { useMetrics } from "@/hooks/use-incidents";
import { formatMinutes } from "@/lib/format";

/**
 * One signal color, everything else ink: sev1 is the only series that gets
 * the safety-orange accent; sev2–4 render in neutral stone. Color follows
 * criticality, not the chart. (These are Tremor palette names — both must
 * stay in the `@source inline()` safelist in index.css.)
 */
const SEVERITY_COLORS = ["orange", "stone", "stone", "stone"] as const;

function ChartHeader({ label, hint }: { label: string; hint: string }) {
  return (
    <div>
      <h3 className="font-mono text-[10px] font-medium tracking-[0.1em] text-muted-foreground uppercase">
        {label}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export default function Metrics() {
  const { data: metrics, isLoading } = useMetrics();

  if (isLoading || !metrics) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-20 w-full" />
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
        <h2 className="font-mono text-base font-medium tracking-tight text-foreground">
          Metrics
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Incident volume, severity mix, and time-to-resolution trends.
        </p>
      </div>

      <StatStrip
        segments={[
          {
            label: "Open incidents",
            value: String(metrics.openIncidents),
            hint: "all severities",
          },
          {
            label: "Avg. MTTR",
            value: formatMinutes(metrics.avgMttrMinutes),
            hint: "trailing 30d",
          },
          {
            label: "Incidents this week",
            value: String(metrics.incidentsThisWeek),
            hint: `${metrics.incidentsThisWeekDelta > 0 ? "+" : ""}${metrics.incidentsThisWeekDelta}% vs last`,
          },
        ]}
      />

      <Card className="p-5">
        <ChartHeader label="Incident volume" hint="Daily incident count, last 30 days" />
        <AreaChart
          className="h-64"
          data={metrics.volume}
          index="date"
          categories={["incidents"]}
          colors={["orange"]}
          showLegend={false}
          showAnimation={false}
          curveType="monotone"
          yAxisWidth={30}
        />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <ChartHeader label="Severity breakdown" hint="Open + resolved, trailing 30 days" />
          <BarChart
            className="h-56"
            data={severityData}
            index="name"
            categories={severityCategories}
            colors={SEVERITY_COLORS as unknown as string[]}
            showLegend
            showAnimation={false}
            layout="vertical"
            yAxisWidth={0}
            valueFormatter={(v) => `${v}`}
          />
        </Card>

        <Card className="p-5">
          <ChartHeader label="MTTR by severity" hint="Minutes to resolution, average" />
          <BarChart
            className="h-56"
            data={mttrData}
            index="name"
            categories={mttrCategories}
            colors={SEVERITY_COLORS as unknown as string[]}
            showLegend
            showAnimation={false}
            layout="vertical"
            yAxisWidth={0}
            valueFormatter={(v) => `${v}m`}
          />
        </Card>
      </div>
    </div>
  );
}
