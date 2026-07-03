import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessageBubble } from "@/components/chat/chat-message";
import { useCopilotChat } from "@/hooks/use-copilot-chat";
import { cn } from "@/lib/utils";

const SUGGESTED_PROMPTS = [
  "What's the likely root cause?",
  "Suggest a mitigation",
  "Draft a status update",
  "Walk me through the runbook",
];

export function ChatPanel({
  incidentId,
  className,
  compact = false,
}: {
  incidentId?: string;
  className?: string;
  compact?: boolean;
}) {
  const { messages, isStreaming, sendMessage } = useCopilotChat(incidentId);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    void sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <ScrollArea className="min-h-0 flex-1" viewportRef={scrollRef}>
        <div className={cn("px-4 py-4", compact && "px-3 py-3")}>
          {messages.length === 0 ? (
            <div className="py-8">
              <p className="font-mono text-xs text-muted-foreground">
                — {incidentId ? "transcript empty. ask about this incident" : "transcript empty. ask the copilot"} —
              </p>
              <div className="mt-4 flex flex-col items-start gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    className="font-mono text-xs text-muted-foreground transition-colors duration-120 hover:text-primary"
                  >
                    ▸ {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {messages.map((message) => (
                <ChatMessageBubble key={message.id} message={message} />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border p-3">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={incidentId ? "Ask about this incident…" : "Message the copilot…"}
            rows={1}
            className="max-h-32 min-h-9 flex-1 resize-none py-2"
          />
          <Button
            className="h-9 shrink-0 px-3 text-xs tracking-wide"
            disabled={!input.trim() || isStreaming}
            onClick={handleSend}
          >
            SEND ▸
          </Button>
        </div>
      </div>
    </div>
  );
}
