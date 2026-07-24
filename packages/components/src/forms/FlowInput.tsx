import type { InputHTMLAttributes } from "react";
import { FlowIcon } from "@flow/primitives";
import "../../css/forms/Input.css";

export interface FlowInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  invalid?: boolean;
  /** Material Symbols name shown at the start of the field. */
  iconStart?: string;
}

/** FlowInput — single-line text field. Pair with FlowField for a label and messaging. */
export function FlowInput({
  invalid,
  iconStart,
  disabled,
  "aria-invalid": ariaInvalid,
  ...rest
}: FlowInputProps) {
  return (
    <div
      className="flow-input-wrap"
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
    >
      {iconStart && <FlowIcon name={iconStart} size="md" className="flow-input__icon" />}
      <input
        className="flow-input"
        disabled={disabled}
        aria-invalid={ariaInvalid ?? (invalid || undefined)}
        {...rest}
      />
    </div>
  );
}
