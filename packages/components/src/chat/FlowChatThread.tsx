import type { ReactNode } from "react";
import "../../css/chat/ChatThread.css";

export interface FlowChatThreadProps {
  children: ReactNode;
  ariaLabel?: string;
}

/** FlowChatThread — scrollable message log. Announces new messages politely. */
export function FlowChatThread({ children, ariaLabel = "Conversación" }: FlowChatThreadProps) {
  return (
    <div className="flow-chat-thread" role="log" aria-live="polite" aria-label={ariaLabel}>
      {children}
    </div>
  );
}
