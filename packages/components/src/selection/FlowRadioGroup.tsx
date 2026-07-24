import { useId, type ReactNode } from "react";
import "../../css/selection/RadioGroup.css";

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface FlowRadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  orientation?: "vertical" | "horizontal";
  /** Accessible name for the group. */
  ariaLabel?: string;
}

/** FlowRadioGroup — single-choice group with optional per-option descriptions. */
export function FlowRadioGroup({
  name,
  value,
  onChange,
  options,
  orientation = "vertical",
  ariaLabel,
}: FlowRadioGroupProps) {
  const baseId = useId();
  return (
    <div
      className="flow-radio-group"
      data-orientation={orientation}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {options.map((opt) => {
        const id = `${baseId}-${opt.value}`;
        const descId = opt.description ? `${id}-desc` : undefined;
        return (
          <label
            key={opt.value}
            className="flow-radio"
            data-disabled={opt.disabled || undefined}
            htmlFor={id}
          >
            <input
              id={id}
              type="radio"
              className="flow-radio__input"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              disabled={opt.disabled}
              aria-describedby={descId}
              onChange={() => onChange(opt.value)}
            />
            <span className="flow-radio__circle" aria-hidden="true" />
            <span className="flow-radio__body">
              <span className="flow-radio__label">{opt.label}</span>
              {opt.description && (
                <span id={descId} className="flow-radio__desc">
                  {opt.description}
                </span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}
