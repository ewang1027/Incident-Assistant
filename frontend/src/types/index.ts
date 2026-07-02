/**
 * Core domain types for the Incident Copilot.
 *
 * These describe the shape of data as it will eventually come back from a
 * real incident-management backend. Keeping them in one place means the
 * mock data, the api layer, and every component agree on the same contract
 * — swapping mocks for real HTTP calls later shouldn't require touching
 * these types at all.
 */

export type Severity = "sev1" | "sev2" | "sev3" | "sev4";

export type Status = "open" | "investigating" | "mitigated" | "resolved";

export type EventKind =
  | "detected"
  | "paged"
  | "acknowledged"
  | "status_change"
  | "action"
  | "note"
  | "resolved";

export interface IncidentEvent {
  id: string;
  incidentId: string;
  kind: EventKind;
  message: string;
  actor: string;
  timestamp: string; // ISO 8601
}

export interface Incident {
  id: string;
  title: string;
  summary: string;
  severity: Severity;
  status: Status;
  service: string;
  commander: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  resolvedAt?: string; // ISO 8601, present once status === "resolved"
  events: IncidentEvent[];
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string; // ISO 8601
  /** True while an assistant message is still receiving streamed chunks. */
  streaming?: boolean;
}

export interface VolumePoint {
  date: string; // e.g. "Jun 12"
  incidents: number;
}

export interface SeverityBreakdownPoint {
  severity: Severity;
  label: string;
  count: number;
}

export interface MttrPoint {
  severity: Severity;
  label: string;
  mttrMinutes: number;
}

export interface Metrics {
  openIncidents: number;
  avgMttrMinutes: number;
  incidentsThisWeek: number;
  incidentsThisWeekDelta: number; // percent change vs previous week
  volume: VolumePoint[];
  severityBreakdown: SeverityBreakdownPoint[];
  mttrBySeverity: MttrPoint[];
}
