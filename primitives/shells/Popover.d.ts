/** Panel anclado. Generado desde contracts/popover.json. */
export interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchorRef: React.RefObject<HTMLElement>;
  returnFocusRef?: React.RefObject<HTMLElement>;
  /** '<side>' o '<side>-<align>'. side: top|bottom|left|right. align: start|center|end. */
  placement?: 'top' | 'bottom' | 'left' | 'right'
    | 'bottom-start' | 'bottom-center' | 'bottom-end'
    | 'top-start' | 'top-center' | 'top-end'
    | 'left-start' | 'left-center' | 'left-end'
    | 'right-start' | 'right-center' | 'right-end';
  matchAnchorWidth?: boolean;
  minWidth?: number;
  /** 'card' pinta la superficie del sistema; 'none' deja el panel sin piel. */
  surface?: 'card' | 'none';
  /** false para un panel que no se puede senalar: sin click-outside, sin puntero, sin devolver foco. */
  interactive?: boolean;
  /** Separacion con el ancla, en px. */
  offset?: number;
  children: React.ReactNode;
}
export declare function Popover(props: PopoverProps): JSX.Element | null;
