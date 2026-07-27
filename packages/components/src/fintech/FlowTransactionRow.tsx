import type { HTMLAttributes } from "react";
import { FlowIcon } from "@flowds/primitives";
import "../../css/fintech/TransactionRow.css";

export interface FlowTransactionRowProps extends HTMLAttributes<HTMLDivElement> {
  /** Category icon (Material Symbols). */
  icon: string;
  title: string;
  subtitle?: string;
  /** Amount string, already formatted (e.g. "+$1,840", "−$54"). Rendered in mono. */
  amount: string;
  /** Positive movements are tinted with the success color. */
  positive?: boolean;
}

/** FlowTransactionRow — a wallet movement: category icon, title/subtitle, amount in mono. */
export function FlowTransactionRow({
  icon,
  title,
  subtitle,
  amount,
  positive,
  ...rest
}: FlowTransactionRowProps) {
  return (
    <div className="flow-tx-row" {...rest}>
      <span className="flow-tx-row__icon" aria-hidden="true">
        <FlowIcon name={icon} size="md" />
      </span>
      <span className="flow-tx-row__body">
        <span className="flow-tx-row__title">{title}</span>
        {subtitle && <span className="flow-tx-row__subtitle">{subtitle}</span>}
      </span>
      <span className="flow-tx-row__amount" data-positive={positive || undefined}>
        {amount}
      </span>
    </div>
  );
}
