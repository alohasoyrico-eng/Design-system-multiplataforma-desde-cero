/** Growing textarea + send button, optional suggestion chips above it. Enter sends, Shift+Enter newline. */
export interface ChatComposerProps {
  value?: string;
  onChange?: (v: string) => void;
  onSend?: (text: string) => void;
  placeholder?: string;
  suggestions?: string[];
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function ChatComposer(props: ChatComposerProps): JSX.Element;
