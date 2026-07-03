import { cn } from "@/lib/utils";
import { formatClock } from "@/lib/format";
import type { ChatMessage as ChatMessageType } from "@/types";

/**
 * One entry in the comms-log transcript: a mono header line tagging the
 * speaker and time, then the message body in sans at full width. No
 * bubbles, no avatars — hairline rules between entries come from the
 * parent's divide-y.
 */
export function ChatMessageBubble({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";

  return (
    <div className="py-4 first:pt-0">
      <p className="font-mono text-[11px] tracking-wide">
        <span className={cn("font-medium", isUser ? "text-muted-foreground" : "text-primary")}>
          {isUser ? "[YOU]" : "[COPILOT]"}
        </span>
        <span className="ml-2 text-muted-foreground tabular-nums">
          {formatClock(message.createdAt)}
        </span>
      </p>
      <p className="mt-1.5 font-sans text-sm leading-relaxed whitespace-pre-wrap text-foreground">
        {message.content}
        {message.streaming && (
          <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse bg-primary align-middle" />
        )}
      </p>
    </div>
  );
}
