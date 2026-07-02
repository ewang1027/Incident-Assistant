import { findIncident, incidents, metrics } from "@/mocks/incidents";
import { streamCopilotReply } from "@/mocks/chat";
import type { Incident, Metrics } from "@/types";

/**
 * The backend seam.
 *
 * Every function here today just reads from in-memory fixtures with a
 * small artificial delay to simulate network latency. When a real backend
 * exists, this is the only file that should need to change — swap the
 * bodies for `fetch()` calls (or a generated API client) and every hook,
 * page, and component built against these function signatures keeps
 * working unmodified.
 */

const NETWORK_DELAY_MS = 300;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getIncidents(): Promise<Incident[]> {
  return delay(incidents);
}

export async function getIncident(id: string): Promise<Incident | undefined> {
  return delay(findIncident(id));
}

export async function getMetrics(): Promise<Metrics> {
  return delay(metrics);
}

/**
 * Streams a copilot reply chunk by chunk. `onChunk` is called for every
 * token as it "arrives" — this mirrors how you'd consume a real SSE/
 * WebSocket connection (accumulate chunks into the message as they come in
 * rather than waiting for the full response).
 */
export async function sendChatMessage(
  prompt: string,
  onChunk: (chunk: string) => void,
  incidentId?: string,
): Promise<void> {
  for await (const chunk of streamCopilotReply(prompt, incidentId)) {
    onChunk(chunk);
  }
}
