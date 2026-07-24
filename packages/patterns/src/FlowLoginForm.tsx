import { useState, type FormEvent } from "react";
import { Stack } from "@flow/primitives";
import { FlowField, FlowInput, FlowCheckbox, FlowButton } from "@flow/components";
import "../css/LoginForm.css";

export interface LoginValues {
  email: string;
  password: string;
  remember: boolean;
}

export interface FlowLoginFormProps {
  onSubmit: (values: LoginValues) => void;
  /** Show the submit button in its loading state. */
  loading?: boolean;
  /** Form-level error, e.g. from a failed sign-in. */
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** FlowLoginForm — email + password + remember, with inline validation. Copy is neutral Spanish. */
export function FlowLoginForm({ onSubmit, loading, error }: FlowLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [touched, setTouched] = useState(false);

  const emailError = touched && !EMAIL_RE.test(email) ? "Escribe un correo válido." : undefined;
  const passwordError = touched && password.length < 8 ? "Usa al menos 8 caracteres." : undefined;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!EMAIL_RE.test(email) || password.length < 8) return;
    onSubmit({ email, password, remember });
  };

  return (
    <form className="flow-login-form" onSubmit={submit} noValidate>
      <Stack gap="stack">
        {error && (
          <p className="flow-login-form__error" role="alert">
            {error}
          </p>
        )}
        <FlowField label="Correo" error={emailError}>
          <FlowInput
            type="email"
            inputMode="email"
            autoComplete="email"
            iconStart="mail"
            placeholder="tu@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FlowField>
        <FlowField label="Contraseña" error={passwordError}>
          <FlowInput
            type="password"
            autoComplete="current-password"
            iconStart="lock"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FlowField>
        <FlowCheckbox
          label="Mantener la sesión abierta"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
        />
        <FlowButton type="submit" variant="accent" size="lg" loading={loading} fullWidth>
          Iniciar sesión
        </FlowButton>
      </Stack>
    </form>
  );
}
