import type { KeyboardEvent } from "react";
import { FlowIcon } from "@flowds/primitives";
import "../../css/chat/ChatComposer.css";

export interface FlowChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
}

/** FlowChatComposer — message input with a send button. Enter sends, Shift+Enter adds a line. */
export function FlowChatComposer({
  value,
  onChange,
  onSend,
  placeholder = "Escribe un mensaje…",
  disabled,
}: FlowChatComposerProps) {
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) onSend();
    }
  };

  return (
    <div className="flow-chat-composer">
      <textarea
        className="flow-chat-composer__input"
        rows={1}
        value={value}
        placeholder={placeholder}
        aria-label="Mensaje"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <button
        type="button"
        className="flow-chat-composer__send"
        aria-label="Enviar"
        disabled={disabled || !value.trim()}
        onClick={() => value.trim() && onSend()}
      >
        <FlowIcon name="arrow_upward" size="md" />
      </button>
    </div>
  );
}
