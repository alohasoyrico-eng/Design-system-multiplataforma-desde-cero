import { useState } from "react";
import { Stack, Inline, Text } from "@flowds/primitives";
import {
  FlowCard,
  FlowField,
  FlowInput,
  FlowSelect,
  FlowSwitch,
  FlowRadioGroup,
  FlowDivider,
} from "@flowds/components";
import "../css/SettingsScreen.css";

/** SettingsScreen — grouped preferences: account, notifications, appearance. */
export function SettingsScreen() {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);
  const [weekly, setWeekly] = useState(true);
  const [lang, setLang] = useState("es");
  const [tema, setTema] = useState("auto");

  const SwitchRow = ({
    label,
    hint,
    checked,
    onChange,
  }: {
    label: string;
    hint: string;
    checked: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <Inline justify="between" align="center" gap="4">
      <Stack gap="1">
        <Text variant="body-strong" as="span">
          {label}
        </Text>
        <Text variant="caption" color="muted" as="span">
          {hint}
        </Text>
      </Stack>
      <FlowSwitch checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </Inline>
  );

  return (
    <div className="flow-settings">
      <Stack gap="6">
        <Text variant="title-lg" as="h1">
          Ajustes
        </Text>

        <FlowCard as="section">
          <Stack gap="5">
            <Text variant="title-sm" as="h2">
              Cuenta
            </Text>
            <FlowField label="Nombre">
              <FlowInput defaultValue="Ana Ruiz" />
            </FlowField>
            <FlowField label="Idioma">
              <FlowSelect
                value={lang}
                onChange={setLang}
                options={[
                  { value: "es", label: "Español" },
                  { value: "en", label: "English" },
                ]}
              />
            </FlowField>
          </Stack>
        </FlowCard>

        <FlowCard as="section">
          <Stack gap="4">
            <Text variant="title-sm" as="h2">
              Notificaciones
            </Text>
            <SwitchRow
              label="Push"
              hint="Alertas en tiempo real en tu dispositivo."
              checked={push}
              onChange={setPush}
            />
            <FlowDivider />
            <SwitchRow
              label="Correo"
              hint="Resúmenes y recibos por correo."
              checked={email}
              onChange={setEmail}
            />
            <FlowDivider />
            <SwitchRow
              label="Resumen semanal"
              hint="Cada lunes por la mañana."
              checked={weekly}
              onChange={setWeekly}
            />
          </Stack>
        </FlowCard>

        <FlowCard as="section">
          <Stack gap="5">
            <Text variant="title-sm" as="h2">
              Apariencia
            </Text>
            <FlowRadioGroup
              name="tema"
              ariaLabel="Tema"
              value={tema}
              onChange={setTema}
              options={[
                { value: "claro", label: "Claro" },
                { value: "oscuro", label: "Oscuro" },
                { value: "auto", label: "Automático", description: "Sigue el sistema" },
              ]}
            />
          </Stack>
        </FlowCard>
      </Stack>
    </div>
  );
}
