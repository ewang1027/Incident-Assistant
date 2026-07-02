import { Card } from "@/components/ui/card";
import { ChatPanel } from "@/components/chat/chat-panel";

export default function Chat() {
  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col p-4 md:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Copilot</h2>
        <p className="text-sm text-muted-foreground">
          Ask about triage, mitigation, runbooks, or drafting a status update.
        </p>
      </div>
      <Card className="min-h-0 flex-1 p-0">
        <ChatPanel />
      </Card>
    </div>
  );
}
