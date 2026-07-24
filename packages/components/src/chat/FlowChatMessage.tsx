import type { ReactNode } from "react";
import "../../css/chat/ChatMessage.css";

export interface FlowChatMessageProps {
  role: "user" | "assistant";
  children: ReactNode;
  /** Optional timestamp shown under the bubble. */
  time?: string;
}

/** FlowChatMessage — a chat bubble. User messages align right (accent), assistant left. */
export function FlowChatMessage({ role, children, time }: FlowChatMessageProps) {
  return (
    <div className="flow-chat-msg" data-role={role}>
      <div className="flow-chat-msg__bubble">{children}</div>
      {time && <span className="flow-chat-msg__time">{time}</span>}
    </div>
  );
}
