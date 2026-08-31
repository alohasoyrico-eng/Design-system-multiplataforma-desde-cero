/** Content separator. Horizontal line, optional centered label, or vertical rule for inline groups (toolbars). */
export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  style?: React.CSSProperties;
}
export declare function Divider(props: DividerProps): JSX.Element;
