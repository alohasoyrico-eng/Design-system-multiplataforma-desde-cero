import { Stack, Inline, Text } from "@flow/primitives";
import {
  FlowPaymentCard,
  FlowButton,
  FlowCard,
  FlowDonut,
  FlowSparkline,
  FlowTransactionRow,
  type PaymentCardVariant,
} from "@flow/components";
import "../css/WalletScreen.css";

export interface WalletTransaction {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  amount: string;
  positive?: boolean;
}

export interface WalletScreenProps {
  holder: string;
  last4: string;
  cardVariant?: PaymentCardVariant;
  /** Balance string, already formatted. */
  balance: string;
  /** Budget used, 0–100. */
  spentPercent: number;
  /** Weekly earnings trend for the sparkline. */
  trend: number[];
  transactions: WalletTransaction[];
}

/** WalletScreen — mobile wallet: card, quick actions, budget ring + trend, movements. */
export function WalletScreen({
  holder,
  last4,
  cardVariant = "ink",
  balance,
  spentPercent,
  trend,
  transactions,
}: WalletScreenProps) {
  return (
    <div className="flow-wallet">
      <Stack gap="6">
        <Stack gap="1">
          <Text variant="overline" color="muted">
            Saldo disponible
          </Text>
          <Text variant="display" as="p" className="flow-wallet__balance">
            {balance}
          </Text>
        </Stack>

        <FlowPaymentCard holder={holder} last4={last4} variant={cardVariant} />

        <Inline gap="3" justify="between">
          <FlowButton variant="accent" iconStart="add" fullWidth>
            Agregar
          </FlowButton>
          <FlowButton variant="secondary" iconStart="send" fullWidth>
            Enviar
          </FlowButton>
          <FlowButton variant="secondary" iconStart="qr_code_scanner" fullWidth>
            Cobrar
          </FlowButton>
        </Inline>

        <FlowCard>
          <Inline gap="5" align="center">
            <FlowDonut value={spentPercent} label="Presupuesto usado" />
            <Stack gap="2">
              <Text variant="title-sm" as="h3">
                Semana en curso
              </Text>
              <FlowSparkline data={trend} tone="positive" label="Ganancias de la semana" />
              <Text variant="caption" color="muted">
                Ganancias por día
              </Text>
            </Stack>
          </Inline>
        </FlowCard>

        <Stack gap="3">
          <Text variant="title-sm" as="h3">
            Movimientos
          </Text>
          <FlowCard>
            <Stack gap="0">
              {transactions.map((tx) => (
                <FlowTransactionRow
                  key={tx.id}
                  icon={tx.icon}
                  title={tx.title}
                  subtitle={tx.subtitle}
                  amount={tx.amount}
                  positive={tx.positive}
                />
              ))}
            </Stack>
          </FlowCard>
        </Stack>
      </Stack>
    </div>
  );
}
