/** Flow-branded payment card visual (1.586 ratio). frozen shows frost overlay. Set window.FLOW_ASSET_BASE for the logo path. */
export interface PaymentCardProps {
  holder?: string;
  last4?: string;
  variant?: 'ink' | 'accent' | 'sand';
  frozen?: boolean;
  /** Top-right tag, e.g. FLOTA / PERSONAL. */
  label?: string;
  expires?: string;
  width?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function PaymentCard(props: PaymentCardProps): JSX.Element;
