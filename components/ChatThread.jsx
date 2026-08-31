import React from 'react';

/** Scrollable message list; auto-scrolls to bottom on new messages. messages: [{id,role,text,tool,streaming,timestamp,content}] */
export function ChatThread({ messages = [], emptyState, style }) {
  const ref = React.useRef(null);
  React.useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [messages.length, messages[messages.length - 1] && messages[messages.length - 1].text]);
  if (messages.length === 0 && emptyState) return emptyState;
  const ChatMessage = (window.Flow && window.Flow.ChatMessage) || function () { return null; };
  return React.createElement('div', { ref, style: { display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto', padding: '4px 2px', ...style } },
    messages.map(m => React.createElement(ChatMessage, {
      key: m.id, role: m.role, text: m.text, tool: m.tool, streaming: m.streaming, timestamp: m.timestamp,
    }, m.content)));
}
