import { formatDistanceToNowStrict, format } from "date-fns";

export function formatRelative(iso: string): string {
  return formatDistanceToNowStrict(new Date(iso), { addSuffix: true });
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), "MMM d, yyyy 'at' h:mm a");
}

export function formatTime(iso: string): string {
  return format(new Date(iso), "h:mm a");
}

/** 24h clock with seconds, e.g. "14:02:31" — for the comms-log transcript. */
export function formatClock(iso: string): string {
  return format(new Date(iso), "HH:mm:ss");
}

/** 24h clock, e.g. "14:02" — for the ledger timeline column. */
export function formatShortClock(iso: string): string {
  return format(new Date(iso), "HH:mm");
}

export function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}
