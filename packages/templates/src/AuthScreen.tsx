import { Stack, Text, FlowIcon } from "@flowds/primitives";
import { FlowDivider, FlowButton } from "@flowds/components";
import { FlowLoginForm, type LoginValues } from "@flowds/patterns";
import "../css/AuthScreen.css";

export interface AuthScreenProps {
  onSubmit: (values: LoginValues) => void;
  loading?: boolean;
  error?: string;
  onCreateAccount?: () => void;
  onForgotPassword?: () => void;
}

/** AuthScreen — full sign-in page. Responsive, works across Canvas / Asphalt / Brutal unchanged. */
export function AuthScreen({
  onSubmit,
  loading,
  error,
  onCreateAccount,
  onForgotPassword,
}: AuthScreenProps) {
  return (
    <div className="flow-auth">
      <div className="flow-auth__panel">
        <Stack gap="6">
          <Stack gap="3" align="start">
            <span className="flow-auth__brand">
              <FlowIcon name="bolt" size="lg" filled />
              <span className="flow-auth__wordmark">Flow</span>
            </span>
            <Text variant="title-lg" as="h1">
              Inicia sesión
            </Text>
            <Text variant="body" color="secondary">
              Todo tu día, en movimiento. Entra para gestionar tu flota.
            </Text>
          </Stack>

          <FlowLoginForm onSubmit={onSubmit} loading={loading} error={error} />

          <button type="button" className="flow-auth__link" onClick={onForgotPassword}>
            ¿Olvidaste tu contraseña?
          </button>

          <FlowDivider>o</FlowDivider>

          <FlowButton variant="secondary" size="lg" fullWidth onClick={onCreateAccount}>
            Crear cuenta
          </FlowButton>
        </Stack>
      </div>
    </div>
  );
}
