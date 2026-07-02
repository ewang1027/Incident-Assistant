import { findIncident } from "@/mocks/incidents";

/**
 * Fake LLM streaming.
 *
 * `streamCopilotReply` is an async generator that yields small text chunks
 * with randomized delays, mimicking how a real backend would stream tokens
 * over SSE or a WebSocket. Callers just do:
 *
 *   for await (const chunk of streamCopilotReply(prompt)) { append(chunk) }
 *
 * That loop is the exact shape you'd use against a real streaming endpoint,
 * so swapping this generator for one backed by `fetch` + a ReadableStream
 * reader later is a one-file change — nothing in the UI needs to know.
 */

function pickResponse(prompt: string, incidentId?: string): string {
  const lower = prompt.toLowerCase();
  const incident = incidentId ? findIncident(incidentId) : undefined;
  const scope = incident ? `${incident.id} (${incident.title})` : "this workspace";

  if (lower.includes("root cause") || lower.includes("why")) {
    return `Based on the timeline for ${scope}, the most likely root cause is the recent change that immediately preceded the first alert. I'd focus on:\n\n1. **Recent deploys** — check what shipped to the affected service in the last 30 minutes before detection.\n2. **Dependency health** — rule out downstream services or infrastructure (DB failover, DNS, cert expiry) as a trigger.\n3. **Blast radius** — confirm whether the issue is isolated to one region/pod or systemic.\n\nWant me to draft a hypothesis list you can paste into the incident channel?`;
  }

  if (lower.includes("mitigat") || lower.includes("fix") || lower.includes("rollback")) {
    return `Here's a suggested mitigation path for ${scope}:\n\n- If a recent deploy correlates with the onset, **roll back first, investigate second** — restoring service is the priority.\n- If rollback isn't possible, consider a feature flag kill-switch to disable the affected code path.\n- Add a temporary rate limit or circuit breaker if the failure is cascading to dependent services.\n\nOnce mitigated, keep the incident in "investigating" until you've confirmed metrics have recovered for at least one full monitoring window.`;
  }

  if (lower.includes("status") || lower.includes("update") || lower.includes("summar")) {
    return `Draft status update for ${scope}:\n\n> We identified [root cause] impacting [affected service]. A mitigation ([action taken]) was applied at [time] and metrics have [recovered / are recovering]. We are continuing to monitor and will provide the next update within 30 minutes.\n\nWant me to tailor this for a customer-facing status page instead of an internal channel?`;
  }

  if (lower.includes("runbook") || lower.includes("playbook") || lower.includes("step")) {
    return `Here's a general incident runbook you can adapt:\n\n1. **Acknowledge** the page and declare severity.\n2. **Assemble** — pull in the on-call for the affected service plus any dependencies.\n3. **Communicate** — post an initial status update within 5 minutes of declaration.\n4. **Diagnose** — check dashboards, recent deploys, and dependency status pages in parallel.\n5. **Mitigate** — prefer fast, reversible actions (rollback, flag flip, failover) over root-fixing under pressure.\n6. **Verify** — confirm the primary SLO metric has recovered before downgrading severity.\n7. **Resolve & review** — close the incident and schedule a blameless postmortem within 48 hours.`;
  }

  if (lower.includes("postmortem") || lower.includes("post-mortem") || lower.includes("retro")) {
    return `For the postmortem on ${scope}, I'd structure it as:\n\n- **Summary** — one paragraph, no jargon, what happened and customer impact.\n- **Timeline** — every event from detection to resolution with timestamps.\n- **Root cause** — the technical "why," distinct from contributing factors.\n- **What went well / what didn't** — be specific, avoid blame.\n- **Action items** — each with an owner and a due date, not just "investigate further."\n\nWant me to pre-fill this template using the incident's actual timeline events?`;
  }

  return `I can help with ${scope}. I can suggest likely root causes, draft a mitigation plan, write a status update, walk through a runbook, or help structure a postmortem — just let me know which one, or ask me anything specific about the incident.`;
}

function chunkText(text: string): string[] {
  // Split on whitespace boundaries but keep the whitespace attached, so
  // re-joining chunks reproduces the original text exactly.
  return text.match(/\S+\s*/g) ?? [text];
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function* streamCopilotReply(
  prompt: string,
  incidentId?: string,
): AsyncGenerator<string> {
  const response = pickResponse(prompt, incidentId);
  const chunks = chunkText(response);

  // Small delay before the first token, like a real model's time-to-first-byte.
  await wait(350 + Math.random() * 250);

  for (const chunk of chunks) {
    yield chunk;
    // Jittered per-token delay so the stream doesn't feel mechanically even.
    await wait(15 + Math.random() * 45);
  }
}
