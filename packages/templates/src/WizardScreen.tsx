import { useState } from "react";
import { Stack, Inline, Text } from "@flow/primitives";
import {
  FlowCard,
  FlowStepper,
  FlowField,
  FlowInput,
  FlowSelect,
  FlowRadioGroup,
  FlowButton,
  FlowStatusView,
} from "@flow/components";
import "../css/WizardScreen.css";

export interface WizardScreenProps {
  onComplete?: () => void;
}

const STEPS = [
  { label: "Datos" },
  { label: "Vehículo" },
  { label: "Documentos" },
  { label: "Listo" },
];

/** WizardScreen — multi-step onboarding form. Stepper + fields → success state. */
export function WizardScreen({ onComplete }: WizardScreenProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ nombre: "", correo: "", placa: "", tipo: "", docs: "ine" });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const last = step === STEPS.length - 1;

  return (
    <div className="flow-wizard">
      <FlowCard>
        <Stack gap="8">
          <FlowStepper steps={STEPS} current={step} />

          {step === 0 && (
            <Stack gap="5">
              <Text variant="title-sm" as="h2">
                Cuéntanos de ti
              </Text>
              <FlowField label="Nombre">
                <FlowInput
                  value={form.nombre}
                  onChange={(e) => set("nombre", e.target.value)}
                  placeholder="Ana Ruiz"
                />
              </FlowField>
              <FlowField label="Correo">
                <FlowInput
                  type="email"
                  iconStart="mail"
                  value={form.correo}
                  onChange={(e) => set("correo", e.target.value)}
                  placeholder="tu@empresa.com"
                />
              </FlowField>
            </Stack>
          )}

          {step === 1 && (
            <Stack gap="5">
              <Text variant="title-sm" as="h2">
                Tu vehículo
              </Text>
              <FlowField label="Placa">
                <FlowInput
                  value={form.placa}
                  onChange={(e) => set("placa", e.target.value)}
                  placeholder="MX-214-A"
                />
              </FlowField>
              <FlowField label="Tipo">
                <FlowSelect
                  placeholder="Elige un tipo"
                  value={form.tipo}
                  onChange={(e) => set("tipo", e.target.value)}
                  options={[
                    { value: "sedan", label: "Sedán" },
                    { value: "suv", label: "SUV" },
                    { value: "van", label: "Van" },
                  ]}
                />
              </FlowField>
            </Stack>
          )}

          {step === 2 && (
            <Stack gap="5">
              <Text variant="title-sm" as="h2">
                Documentos
              </Text>
              <FlowRadioGroup
                name="docs"
                ariaLabel="Identificación"
                value={form.docs}
                onChange={(v) => set("docs", v)}
                options={[
                  { value: "ine", label: "INE", description: "Credencial para votar" },
                  { value: "pasaporte", label: "Pasaporte" },
                  { value: "licencia", label: "Licencia de conducir" },
                ]}
              />
            </Stack>
          )}

          {step === 3 && (
            <FlowStatusView
              tone="success"
              title="¡Registro completo!"
              message="Revisaremos tus datos y te avisaremos en minutos."
              primaryAction={
                <FlowButton variant="accent" size="lg" onClick={onComplete}>
                  Entrar
                </FlowButton>
              }
            />
          )}

          {!last && (
            <Inline gap="3" justify="between">
              <FlowButton
                variant="ghost"
                disabled={step === 0}
                onClick={() => setStep((s) => s - 1)}
              >
                Atrás
              </FlowButton>
              <FlowButton variant="accent" onClick={() => setStep((s) => s + 1)}>
                Continuar
              </FlowButton>
            </Inline>
          )}
        </Stack>
      </FlowCard>
    </div>
  );
}
