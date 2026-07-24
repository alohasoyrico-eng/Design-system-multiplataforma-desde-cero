import { FlowIcon } from "@flow/primitives";
import "../../css/fintech/PaymentCard.css";

export type PaymentCardVariant = "ink" | "accent" | "sand";

export interface FlowPaymentCardProps {
  /** Cardholder name. */
  holder: string;
  /** Last four digits — rendered in mono as ·· ·· ·· 1234. */
  last4: string;
  variant?: PaymentCardVariant;
  /** Frozen cards dim and show a lock. */
  frozen?: boolean;
  /** Brand label, e.g. "Flow". */
  brand?: string;
}

/** FlowPaymentCard — the Flow payment card. Ink / accent / sand finishes; frozen state. */
export function FlowPaymentCard({
  holder,
  last4,
  variant = "ink",
  frozen,
  brand = "Flow",
}: FlowPaymentCardProps) {
  return (
    <div className="flow-payment-card" data-variant={variant} data-frozen={frozen || undefined}>
      <div className="flow-payment-card__top">
        <span className="flow-payment-card__brand">{brand}</span>
        {frozen ? (
          <FlowIcon name="ac_unit" size="md" label="Congelada" />
        ) : (
          <FlowIcon name="contactless" size="md" />
        )}
      </div>
      <span className="flow-payment-card__chip" aria-hidden="true" />
      <div className="flow-payment-card__number">·· ·· ·· {last4}</div>
      <div className="flow-payment-card__holder">{holder}</div>
    </div>
  );
}
