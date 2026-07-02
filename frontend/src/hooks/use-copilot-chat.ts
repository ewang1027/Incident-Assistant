import { useCallback, useRef, useState } from "react";
import { sendChatMessage } from "@/lib/api";
import type { ChatMessage } from "@/types";

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

/**
 * Owns chat message state for a single conversation and drives the
 * streaming assistant reply. Used both by the standalone /chat page and
 * the embedded panel on the incident detail page (with `incidentId` set,
 * so canned responses can reference the specific incident).
 */
export function useCopilotChat(incidentId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamingIdRef = useRef<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isStreaming) return;

      const userMessage: ChatMessage = {
        id: nextId("user"),
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      const assistantId = nextId("assistant");
      streamingIdRef.current = assistantId;
      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
        streaming: true,
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setIsStreaming(true);

      await sendChatMessage(
        trimmed,
        (chunk) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === streamingIdRef.current ? { ...m, content: m.content + chunk } : m,
            ),
          );
        },
        incidentId,
      );

      setMessages((prev) =>
        prev.map((m) => (m.id === streamingIdRef.current ? { ...m, streaming: false } : m)),
      );
      streamingIdRef.current = null;
      setIsStreaming(false);
    },
    [incidentId, isStreaming],
  );

  return { messages, isStreaming, sendMessage };
}
