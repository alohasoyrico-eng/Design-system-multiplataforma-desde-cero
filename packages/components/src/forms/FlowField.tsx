import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from "react";
import "../../css/forms/Field.css";

export interface FlowFieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  /** Error message. When set, the control is marked invalid and described by it. */
  error?: ReactNode;
  required?: boolean;
  /** A single form control. It receives id / aria-describedby / aria-invalid automatically. */
  children: ReactNode;
}

/** FlowField — labels a control and wires hint/error to it accessibly. */
export function FlowField({ label, hint, error, required, children }: FlowFieldProps) {
  const id = useId();
  const descId = error || hint ? `${id}-desc` : undefined;

  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        id,
        "aria-describedby": descId,
        invalid: Boolean(error),
      })
    : children;

  return (
    <div className="flow-field">
      {label && (
        <label className="flow-field__label" htmlFor={id}>
          {label}
          {required && (
            <span className="flow-field__required" aria-hidden="true">
              {" "}
              *
            </span>
          )}
        </label>
      )}
      {control}
      {(error || hint) && (
        <span id={descId} className={error ? "flow-field__error" : "flow-field__hint"}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
