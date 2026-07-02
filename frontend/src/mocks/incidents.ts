import type { Incident, IncidentEvent, Metrics } from "@/types";

/**
 * Fixture incident data. In a real deployment this file disappears entirely
 * — `src/lib/api.ts` is the seam that gets repointed at a real backend, and
 * everything downstream (hooks, pages, components) is none the wiser.
 */

let eventCounter = 0;
function ev(
  incidentId: string,
  kind: IncidentEvent["kind"],
  message: string,
  actor: string,
  timestamp: string,
): IncidentEvent {
  eventCounter += 1;
  return { id: `evt-${eventCounter}`, incidentId, kind, message, actor, timestamp };
}

export const incidents: Incident[] = [
  {
    id: "INC-1042",
    title: "Checkout API p99 latency spike",
    summary:
      "Checkout service p99 latency climbed from ~180ms to over 4s after a deploy to the payments-gateway sidecar.",
    severity: "sev1",
    status: "investigating",
    service: "checkout-api",
    commander: "Priya Shah",
    createdAt: "2026-07-01T13:42:00Z",
    updatedAt: "2026-07-01T14:20:00Z",
    events: [],
  },
  {
    id: "INC-1041",
    title: "Primary Postgres failover in us-east-1",
    summary:
      "Automatic failover triggered on the orders-db primary after an EBS volume degraded. Replica promoted successfully.",
    severity: "sev1",
    status: "mitigated",
    service: "orders-db",
    commander: "Marcus Webb",
    createdAt: "2026-06-30T08:15:00Z",
    updatedAt: "2026-06-30T09:47:00Z",
    events: [],
  },
  {
    id: "INC-1040",
    title: "Elevated 5xx rate on notifications-worker",
    summary:
      "notifications-worker began returning 5xx for ~6% of requests due to a downstream SMTP provider outage.",
    severity: "sev2",
    status: "resolved",
    service: "notifications-worker",
    commander: "Diego Ramirez",
    createdAt: "2026-06-28T17:05:00Z",
    updatedAt: "2026-06-28T19:30:00Z",
    resolvedAt: "2026-06-28T19:30:00Z",
    events: [],
  },
  {
    id: "INC-1039",
    title: "TLS certificate expiry on api.internal",
    summary:
      "Internal API gateway certificate expired ahead of the automated renewal window, breaking service-to-service calls.",
    severity: "sev2",
    status: "resolved",
    service: "api-gateway",
    commander: "Priya Shah",
    createdAt: "2026-06-25T05:12:00Z",
    updatedAt: "2026-06-25T06:02:00Z",
    resolvedAt: "2026-06-25T06:02:00Z",
    events: [],
  },
  {
    id: "INC-1038",
    title: "Bad deploy: search-service returning empty results",
    summary:
      "A config flag flip in the search-service rollout disabled the ranking index, causing empty result sets for ~11 minutes.",
    severity: "sev3",
    status: "resolved",
    service: "search-service",
    commander: "Aiko Tanaka",
    createdAt: "2026-06-23T21:47:00Z",
    updatedAt: "2026-06-23T22:05:00Z",
    resolvedAt: "2026-06-23T22:05:00Z",
    events: [],
  },
  {
    id: "INC-1037",
    title: "Queue backlog growing on image-resize-worker",
    summary:
      "SQS backlog for image-resize-worker grew past 50k messages after a burst of large uploads; auto-scaling lagged.",
    severity: "sev3",
    status: "mitigated",
    service: "image-resize-worker",
    commander: "Marcus Webb",
    createdAt: "2026-06-29T11:30:00Z",
    updatedAt: "2026-06-29T13:10:00Z",
    events: [],
  },
  {
    id: "INC-1036",
    title: "Stale feature flag cache serving old pricing",
    summary:
      "flag-service cache TTL misconfiguration caused ~2% of sessions to see stale pricing for 20 minutes.",
    severity: "sev4",
    status: "resolved",
    service: "flag-service",
    commander: "Diego Ramirez",
    createdAt: "2026-06-20T15:00:00Z",
    updatedAt: "2026-06-20T15:25:00Z",
    resolvedAt: "2026-06-20T15:25:00Z",
    events: [],
  },
  {
    id: "INC-1035",
    title: "Minor CSS regression on onboarding flow",
    summary:
      "A frontend release introduced a layout regression on the onboarding wizard for narrow viewports.",
    severity: "sev4",
    status: "resolved",
    service: "web-app",
    commander: "Aiko Tanaka",
    createdAt: "2026-06-18T09:20:00Z",
    updatedAt: "2026-06-18T10:05:00Z",
    resolvedAt: "2026-06-18T10:05:00Z",
    events: [],
  },
  {
    id: "INC-1034",
    title: "Auth service intermittent 401s",
    summary:
      "auth-service began intermittently rejecting valid refresh tokens after a clock-skew issue on two nodes.",
    severity: "sev2",
    status: "open",
    service: "auth-service",
    commander: "Priya Shah",
    createdAt: "2026-07-01T10:05:00Z",
    updatedAt: "2026-07-01T10:40:00Z",
    events: [],
  },
  {
    id: "INC-1033",
    title: "CDN cache poisoning on /static assets",
    summary:
      "A misconfigured cache key allowed a small number of personalized responses to be cached and served CDN-wide.",
    severity: "sev1",
    status: "resolved",
    service: "cdn-edge",
    commander: "Marcus Webb",
    createdAt: "2026-06-15T02:10:00Z",
    updatedAt: "2026-06-15T04:55:00Z",
    resolvedAt: "2026-06-15T04:55:00Z",
    events: [],
  },
];

const eventsByIncident: Record<string, IncidentEvent[]> = {
  "INC-1042": [
    ev("INC-1042", "detected", "Latency SLO burn-rate alert fired for checkout-api (p99 > 2s).", "Datadog Monitor", "2026-07-01T13:42:00Z"),
    ev("INC-1042", "paged", "On-call SRE paged via PagerDuty escalation policy 'checkout-critical'.", "PagerDuty", "2026-07-01T13:44:00Z"),
    ev("INC-1042", "acknowledged", "Acknowledged page, starting triage.", "Priya Shah", "2026-07-01T13:47:00Z"),
    ev("INC-1042", "status_change", "Status changed from open to investigating.", "Priya Shah", "2026-07-01T13:50:00Z"),
    ev("INC-1042", "action", "Rolled back payments-gateway sidecar to previous image tag.", "Priya Shah", "2026-07-01T14:05:00Z"),
    ev("INC-1042", "note", "Latency dropped to ~600ms post-rollback but hasn't fully recovered; investigating connection pool exhaustion.", "Priya Shah", "2026-07-01T14:20:00Z"),
  ],
  "INC-1041": [
    ev("INC-1041", "detected", "RDS event subscription reported storage degradation on orders-db primary.", "AWS Health", "2026-06-30T08:15:00Z"),
    ev("INC-1041", "paged", "On-call DBA paged automatically.", "PagerDuty", "2026-06-30T08:16:00Z"),
    ev("INC-1041", "action", "Automatic failover promoted standby replica in us-east-1b.", "RDS Automation", "2026-06-30T08:21:00Z"),
    ev("INC-1041", "acknowledged", "Confirmed application traffic re-pointed to new primary.", "Marcus Webb", "2026-06-30T08:35:00Z"),
    ev("INC-1041", "status_change", "Status changed from investigating to mitigated.", "Marcus Webb", "2026-06-30T09:47:00Z"),
  ],
  "INC-1040": [
    ev("INC-1040", "detected", "5xx error rate exceeded 5% threshold on notifications-worker.", "Datadog Monitor", "2026-06-28T17:05:00Z"),
    ev("INC-1040", "note", "Identified root cause as upstream SMTP provider outage (status page confirmed).", "Diego Ramirez", "2026-06-28T17:20:00Z"),
    ev("INC-1040", "action", "Failed over to secondary SMTP provider via feature flag.", "Diego Ramirez", "2026-06-28T18:10:00Z"),
    ev("INC-1040", "status_change", "Status changed from investigating to mitigated.", "Diego Ramirez", "2026-06-28T18:15:00Z"),
    ev("INC-1040", "resolved", "Primary SMTP provider recovered; flag reverted and error rate confirmed nominal.", "Diego Ramirez", "2026-06-28T19:30:00Z"),
  ],
  "INC-1039": [
    ev("INC-1039", "detected", "Internal service mesh reported TLS handshake failures for api.internal.", "Envoy Alert", "2026-06-25T05:12:00Z"),
    ev("INC-1039", "action", "Issued and deployed emergency certificate via internal CA.", "Priya Shah", "2026-06-25T05:40:00Z"),
    ev("INC-1039", "note", "Root cause: renewal cronjob silently failing for 3 weeks due to permissions change.", "Priya Shah", "2026-06-25T05:55:00Z"),
    ev("INC-1039", "resolved", "Certificate renewal automation fixed and verified; incident closed.", "Priya Shah", "2026-06-25T06:02:00Z"),
  ],
  "INC-1038": [
    ev("INC-1038", "detected", "Search result count dropped to zero across all queries.", "Synthetic Monitor", "2026-06-23T21:47:00Z"),
    ev("INC-1038", "action", "Reverted config flag 'ranking-index-v2' to previous value.", "Aiko Tanaka", "2026-06-23T21:56:00Z"),
    ev("INC-1038", "resolved", "Search results confirmed restored across all regions.", "Aiko Tanaka", "2026-06-23T22:05:00Z"),
  ],
  "INC-1037": [
    ev("INC-1037", "detected", "SQS backlog alarm triggered at 50,000 messages for image-resize-worker.", "CloudWatch Alarm", "2026-06-29T11:30:00Z"),
    ev("INC-1037", "action", "Manually scaled worker fleet from 12 to 40 instances.", "Marcus Webb", "2026-06-29T11:45:00Z"),
    ev("INC-1037", "note", "Backlog draining at ~1,200 messages/min; ETA to zero ~40 minutes.", "Marcus Webb", "2026-06-29T12:20:00Z"),
    ev("INC-1037", "status_change", "Status changed from investigating to mitigated.", "Marcus Webb", "2026-06-29T13:10:00Z"),
  ],
  "INC-1036": [
    ev("INC-1036", "detected", "Customer support flagged pricing inconsistency reports.", "Support Escalation", "2026-06-20T15:00:00Z"),
    ev("INC-1036", "action", "Flushed flag-service cache and reduced TTL from 1h to 60s.", "Diego Ramirez", "2026-06-20T15:15:00Z"),
    ev("INC-1036", "resolved", "Confirmed all sessions now receive current pricing.", "Diego Ramirez", "2026-06-20T15:25:00Z"),
  ],
  "INC-1035": [
    ev("INC-1035", "detected", "Visual regression reported by QA on staging parity check.", "Aiko Tanaka", "2026-06-18T09:20:00Z"),
    ev("INC-1035", "action", "Shipped CSS hotfix for viewport widths below 380px.", "Aiko Tanaka", "2026-06-18T09:50:00Z"),
    ev("INC-1035", "resolved", "Hotfix verified across affected devices.", "Aiko Tanaka", "2026-06-18T10:05:00Z"),
  ],
  "INC-1034": [
    ev("INC-1034", "detected", "Spike in 401 responses on /auth/refresh endpoint.", "Datadog Monitor", "2026-07-01T10:05:00Z"),
    ev("INC-1034", "acknowledged", "Investigating correlation with two nodes flagged for NTP drift.", "Priya Shah", "2026-07-01T10:15:00Z"),
    ev("INC-1034", "note", "Confirmed clock skew of ~90s on auth-service-07 and auth-service-12.", "Priya Shah", "2026-07-01T10:40:00Z"),
  ],
  "INC-1033": [
    ev("INC-1033", "detected", "Security team flagged unexpected personalized content in CDN cache.", "Security Team", "2026-06-15T02:10:00Z"),
    ev("INC-1033", "action", "Purged affected cache keys CDN-wide and disabled the offending cache rule.", "Marcus Webb", "2026-06-15T02:45:00Z"),
    ev("INC-1033", "note", "Root cause: Vary header omitted for personalized fragment responses.", "Marcus Webb", "2026-06-15T03:30:00Z"),
    ev("INC-1033", "resolved", "Fix deployed and validated; post-incident review scheduled.", "Marcus Webb", "2026-06-15T04:55:00Z"),
  ],
};

for (const incident of incidents) {
  incident.events = eventsByIncident[incident.id] ?? [];
}

export function findIncident(id: string): Incident | undefined {
  return incidents.find((incident) => incident.id === id);
}

// --- Metrics fixtures -------------------------------------------------

const volume: Metrics["volume"] = [
  { date: "Jun 3", incidents: 2 },
  { date: "Jun 5", incidents: 1 },
  { date: "Jun 7", incidents: 3 },
  { date: "Jun 9", incidents: 1 },
  { date: "Jun 11", incidents: 4 },
  { date: "Jun 13", incidents: 2 },
  { date: "Jun 15", incidents: 3 },
  { date: "Jun 17", incidents: 1 },
  { date: "Jun 19", incidents: 2 },
  { date: "Jun 21", incidents: 1 },
  { date: "Jun 23", incidents: 3 },
  { date: "Jun 25", incidents: 2 },
  { date: "Jun 27", incidents: 1 },
  { date: "Jun 29", incidents: 4 },
  { date: "Jul 1", incidents: 2 },
];

const severityBreakdown: Metrics["severityBreakdown"] = [
  { severity: "sev1", label: "Sev 1", count: 3 },
  { severity: "sev2", label: "Sev 2", count: 3 },
  { severity: "sev3", label: "Sev 3", count: 2 },
  { severity: "sev4", label: "Sev 4", count: 2 },
];

const mttrBySeverity: Metrics["mttrBySeverity"] = [
  { severity: "sev1", label: "Sev 1", mttrMinutes: 158 },
  { severity: "sev2", label: "Sev 2", mttrMinutes: 74 },
  { severity: "sev3", label: "Sev 3", mttrMinutes: 32 },
  { severity: "sev4", label: "Sev 4", mttrMinutes: 21 },
];

export const metrics: Metrics = {
  openIncidents: incidents.filter((i) => i.status !== "resolved").length,
  avgMttrMinutes: 71,
  incidentsThisWeek: 4,
  incidentsThisWeekDelta: 12,
  volume,
  severityBreakdown,
  mttrBySeverity,
};
