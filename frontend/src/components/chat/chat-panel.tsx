import { useEffect, useRef, useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";
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
        <div className={cn("flex flex-col gap-5 px-4 py-4", compact && "px-3 py-3")}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                <Sparkles className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {incidentId ? "Ask about this incident" : "Ask the copilot"}
                </p>
                <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                  Get triage suggestions, mitigation ideas, or a status update draft.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-indigo-500/40 hover:text-foreground"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => <ChatMessageBubble key={message.id} message={message} />)
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border p-3">
        <div className="flex items-end gap-2 rounded-xl border border-border bg-card p-1.5 focus-within:border-indigo-500/50">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={incidentId ? "Ask about this incident…" : "Message the copilot…"}
            rows={1}
            className="max-h-32 min-h-9 flex-1 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
          />
          <Button
            size="icon"
            className="size-8 shrink-0 rounded-lg bg-indigo-600 hover:bg-indigo-500"
            disabled={!input.trim() || isStreaming}
            onClick={handleSend}
            aria-label="Send message"
          >
            <ArrowUp className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
