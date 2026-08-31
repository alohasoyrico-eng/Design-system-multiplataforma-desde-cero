export interface AccordionItem { id: string; title: string; icon?: string; meta?: string; content: React.ReactNode; }
/** Expandable sections in a card; chevron rotates with spring, content animates open. */
export interface AccordionProps {
  items: AccordionItem[];
  /** id open on mount. */
  defaultOpen?: string;
  /** Allow several sections open at once. */
  multiple?: boolean;
  style?: React.CSSProperties;
}
export declare function Accordion(props: AccordionProps): JSX.Element;
