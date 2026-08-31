/** Movement list row: category icon tile, merchant, meta, signed mono amount. */
export interface TransactionRowProps {
  category?: 'fuel' | 'charge' | 'toll' | 'food' | 'transfer' | 'income';
  title: string;
  subtitle?: string;
  /** Negative = charge, positive = income. */
  amount?: number;
  currency?: string;
  pending?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function TransactionRow(props: TransactionRowProps): JSX.Element;
