import { FlowIcon } from "@flow/primitives";
import "../../css/navigation/Stepper.css";

export interface StepItem {
  label: string;
}

export interface FlowStepperProps {
  steps: StepItem[];
  /** Index of the current step (0-based). Earlier steps render as done. */
  current: number;
  ariaLabel?: string;
}

/** FlowStepper — horizontal progress across ordered steps. */
export function FlowStepper({ steps, current, ariaLabel = "Progreso" }: FlowStepperProps) {
  return (
    <ol className="flow-stepper" aria-label={ariaLabel}>
      {steps.map((step, i) => {
        const state = i < current ? "done" : i === current ? "active" : "upcoming";
        return (
          <li
            key={step.label}
            className="flow-stepper__step"
            data-state={state}
            aria-current={state === "active" ? "step" : undefined}
          >
            <span className="flow-stepper__dot" aria-hidden="true">
              {state === "done" ? <FlowIcon name="check" size="sm" filled /> : i + 1}
            </span>
            <span className="flow-stepper__label">{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
