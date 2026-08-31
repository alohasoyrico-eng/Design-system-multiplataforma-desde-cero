/** One chat bubble. Shows a tool-use chip above agent text when `tool` is set (running spinner or done check). */
export interface ChatToolUse { label: string; icon?: string; status: 'running' | 'done'; }
export interface ChatMessageProps {
  role?: 'user' | 'agent';
  text?: string;
  tool?: ChatToolUse;
  streaming?: boolean;
  children?: React.ReactNode;
  timestamp?: string;
  style?: React.CSSProperties;
}
export declare function ChatMessage(props: ChatMessageProps): JSX.Element;
