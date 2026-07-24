import type { ButtonHTMLAttributes } from "react";
import { FlowIcon } from "@flow/primitives";
import "../../css/controls/IconButton.css";

export interface FlowIconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "aria-label"
> {
  /** Material Symbols name. */
  icon: string;
  /** Required accessible label — an icon-only control must always be named. */
  ariaLabel: string;
  filled?: boolean;
  /** Show a live badge dot (e.g. notifications). */
  badge?: boolean;
}

/** FlowIconButton — icon-only action. `ariaLabel` is mandatory; the hit target is always ≥44px. */
export function FlowIconButton({
  icon,
  ariaLabel,
  filled,
  badge,
  type = "button",
  disabled,
  ...rest
}: FlowIconButtonProps) {
  return (
    <button
      type={type}
      className="flow-icon-button"
      aria-label={ariaLabel}
      disabled={disabled}
      {...rest}
    >
      <FlowIcon name={icon} filled={filled} size="lg" />
      {badge && <span className="flow-icon-button__badge" aria-hidden="true" />}
    </button>
  );
}
