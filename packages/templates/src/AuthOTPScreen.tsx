import { useState } from "react";
import { Stack, Text } from "@flowds/primitives";
import { FlowOTPInput, FlowButton, FlowStatusView } from "@flowds/components";
import "../css/AuthOTPScreen.css";

export interface AuthOTPScreenProps {
  /** Destination shown in the copy, e.g. "+52 ·· ·· 4821". */
  destination?: string;
  onVerified?: () => void;
  onResend?: () => void;
}

/** AuthOTPScreen — mobile one-time-code verification → success state. */
export function AuthOTPScreen({
  destination = "tu teléfono",
  onVerified,
  onResend,
}: AuthOTPScreenProps) {
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const complete = code.length === 6;

  return (
    <div className="flow-otp-screen">
      {verified ? (
        <FlowStatusView
          tone="success"
          title="Cuenta verificada"
          message="Tu número quedó confirmado."
          primaryAction={
            <FlowButton variant="accent" size="lg" onClick={onVerified}>
              Continuar
            </FlowButton>
          }
        />
      ) : (
        <Stack gap="6" align="center">
          <Stack gap="2" align="center">
            <Text variant="title-lg" as="h1">
              Verifica tu número
            </Text>
            <Text variant="body" color="secondary" align="center">
              Enviamos un código de 6 dígitos a {destination}.
            </Text>
          </Stack>

          {/* Focusing the code field is expected UX on a verification screen. */}
          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <FlowOTPInput value={code} onChange={setCode} autoFocus />

          <FlowButton
            variant="accent"
            size="lg"
            fullWidth
            disabled={!complete}
            onClick={() => setVerified(true)}
          >
            Verificar
          </FlowButton>

          <button type="button" className="flow-otp-screen__resend" onClick={onResend}>
            Reenviar código
          </button>
        </Stack>
      )}
    </div>
  );
}
