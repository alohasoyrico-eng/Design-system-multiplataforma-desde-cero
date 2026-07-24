import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { FlowIcon } from "@flow/primitives";
import "../../css/selection/SegmentedControl.css";

export interface SegmentOption {
  value: string;
  label: ReactNode;
  icon?: string;
}

export interface FlowSegmentedControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  /** Accessible name for the control. */
  ariaLabel: string;
}

/** FlowSegmentedControl — mobile-style single choice. Radio semantics with ←/→ keyboard support. */
export function FlowSegmentedControl({
  options,
  value,
  onChange,
  ariaLabel,
}: FlowSegmentedControlProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % options.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + options.length) % options.length;
    else return;
    e.preventDefault();
    const opt = options[next];
    onChange(opt.value);
    refs.current[next]?.focus();
  };

  return (
    <div className="flow-segmented" role="radiogroup" aria-label={ariaLabel}>
      {options.map((opt, i) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            className="flow-segmented__item"
            data-active={active || undefined}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {opt.icon && <FlowIcon name={opt.icon} size="sm" filled={active} />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
