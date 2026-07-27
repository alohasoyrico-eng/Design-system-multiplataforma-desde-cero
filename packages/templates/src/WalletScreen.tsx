import { useState } from "react";
import { Stack, Inline, Text } from "@flowds/primitives";
import {
  FlowPaymentCard,
  FlowButton,
  FlowCard,
  FlowDonut,
  FlowSparkline,
  FlowTransactionRow,
  FlowBottomSheet,
  FlowField,
  FlowInput,
  type PaymentCardVariant,
} from "@flowds/components";
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

type Action = "agregar" | "enviar" | "cobrar";

const ACTION_TITLE: Record<Action, string> = {
  agregar: "Agregar fondos",
  enviar: "Enviar dinero",
  cobrar: "Cobrar",
};

/** WalletScreen — mobile wallet: card, quick actions (real bottom-sheet flows), budget + movements. */
export function WalletScreen({
  holder,
  last4,
  cardVariant = "ink",
  balance,
  spentPercent,
  trend,
  transactions,
}: WalletScreenProps) {
  const [action, setAction] = useState<Action | null>(null);
  const [amount, setAmount] = useState("");
  const [to, setTo] = useState("");

  const close = () => {
    setAction(null);
    setAmount("");
    setTo("");
  };

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
          <FlowButton
            variant="accent"
            iconStart="add"
            fullWidth
            onClick={() => setAction("agregar")}
          >
            Agregar
          </FlowButton>
          <FlowButton
            variant="secondary"
            iconStart="send"
            fullWidth
            onClick={() => setAction("enviar")}
          >
            Enviar
          </FlowButton>
          <FlowButton
            variant="secondary"
            iconStart="qr_code_scanner"
            fullWidth
            onClick={() => setAction("cobrar")}
          >
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

      <FlowBottomSheet
        open={action !== null}
        onClose={close}
        title={action ? ACTION_TITLE[action] : ""}
      >
        <Stack gap="5">
          {action === "enviar" && (
            <FlowField label="Para">
              <FlowInput
                iconStart="person"
                placeholder="Nombre o teléfono"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </FlowField>
          )}
          {action === "cobrar" ? (
            <Text variant="body" color="secondary">
              Muestra este código para que te paguen. Comparte tu QR desde la app.
            </Text>
          ) : (
            <FlowField label="Monto">
              <FlowInput
                inputMode="decimal"
                iconStart="attach_money"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </FlowField>
          )}
          <FlowButton variant="accent" size="lg" fullWidth onClick={close}>
            {action === "enviar" ? "Enviar" : action === "cobrar" ? "Mostrar QR" : "Agregar"}
          </FlowButton>
        </Stack>
      </FlowBottomSheet>
    </div>
  );
}
