import { useEffect, useRef, type InputHTMLAttributes, type ReactNode } from "react";
import { FlowIcon } from "@flow/primitives";
import "../../css/forms/Checkbox.css";

export interface FlowCheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "type"
> {
  label?: ReactNode;
  /** Visually show the indeterminate (mixed) state. */
  indeterminate?: boolean;
}

/** FlowCheckbox — accessible checkbox with a themed box. Supports the indeterminate state. */
export function FlowCheckbox({
  label,
  indeterminate = false,
  disabled,
  ...rest
}: FlowCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className="flow-checkbox" data-disabled={disabled || undefined}>
      <input
        ref={ref}
        type="checkbox"
        className="flow-checkbox__input"
        disabled={disabled}
        {...rest}
      />
      <span className="flow-checkbox__box" aria-hidden="true">
        <FlowIcon name={indeterminate ? "remove" : "check"} size="sm" filled />
      </span>
      {label && <span className="flow-checkbox__label">{label}</span>}
    </label>
  );
}
