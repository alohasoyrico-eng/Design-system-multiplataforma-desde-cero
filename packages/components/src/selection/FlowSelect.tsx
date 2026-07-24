import type { SelectHTMLAttributes } from "react";
import { FlowIcon } from "@flow/primitives";
import "../../css/selection/Select.css";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FlowSelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "className" | "children"
> {
  options: SelectOption[];
  /** Shown as a disabled first option when the value is empty. */
  placeholder?: string;
  invalid?: boolean;
}

/** FlowSelect — a styled native select (keyboard + screen-reader accessible by default). */
export function FlowSelect({
  options,
  placeholder,
  invalid,
  disabled,
  value,
  ...rest
}: FlowSelectProps) {
  return (
    <div
      className="flow-select"
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-placeholder={placeholder && !value ? true : undefined}
    >
      <select
        className="flow-select__control"
        disabled={disabled}
        value={value}
        aria-invalid={invalid || undefined}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      <FlowIcon name="expand_more" size="md" className="flow-select__chevron" />
    </div>
  );
}
