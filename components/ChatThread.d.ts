/** Auto-scrolling message list. Renders ChatMessage internally via window.Flow — mount after the bundle loads. */
export interface ChatThreadMessage { id: string; role: 'user' | 'agent'; text?: string; tool?: { label: string; icon?: string; status: 'running' | 'done' }; streaming?: boolean; timestamp?: string; content?: React.ReactNode; }
export interface ChatThreadProps {
  messages: ChatThreadMessage[];
  emptyState?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function ChatThread(props: ChatThreadProps): JSX.Element;
