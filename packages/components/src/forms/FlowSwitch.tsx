import type { InputHTMLAttributes, ReactNode } from "react";
import "../../css/forms/Switch.css";

export interface FlowSwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "type"
> {
  label?: ReactNode;
}

/** FlowSwitch — on/off toggle. Uses a native checkbox with role switch for accessibility. */
export function FlowSwitch({ label, disabled, ...rest }: FlowSwitchProps) {
  return (
    <label className="flow-switch" data-disabled={disabled || undefined}>
      <input
        type="checkbox"
        role="switch"
        className="flow-switch__input"
        disabled={disabled}
        {...rest}
      />
      <span className="flow-switch__track" aria-hidden="true">
        <span className="flow-switch__thumb" />
      </span>
      {label && <span className="flow-switch__label">{label}</span>}
    </label>
  );
}
