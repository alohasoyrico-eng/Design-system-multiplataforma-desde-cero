import type { ButtonHTMLAttributes, ReactNode } from "react";
import { FlowIcon } from "@flow/primitives";
import "../../css/controls/Button.css";

export type ButtonVariant = "primary" | "accent" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface FlowButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className"
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Show a spinner and mark the button busy. Interaction is blocked while loading. */
  loading?: boolean;
  /** Material Symbols name rendered before the label. */
  iconStart?: string;
  /** Material Symbols name rendered after the label. */
  iconEnd?: string;
  fullWidth?: boolean;
  children?: ReactNode;
}

/**
 * FlowButton — the primary action control.
 * `accent` is the surgical-red CTA: at most one per view. Use `danger` for destructive actions.
 */
export function FlowButton({
  variant = "primary",
  size = "md",
  loading = false,
  iconStart,
  iconEnd,
  fullWidth,
  disabled,
  type = "button",
  children,
  ...rest
}: FlowButtonProps) {
  const iconSize = size === "lg" ? "md" : "sm";
  return (
    <button
      type={type}
      className="flow-button"
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      data-full-width={fullWidth || undefined}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="flow-button__spinner" aria-hidden="true" />}
      {iconStart && !loading && <FlowIcon name={iconStart} size={iconSize} />}
      {children != null && <span className="flow-button__label">{children}</span>}
      {iconEnd && <FlowIcon name={iconEnd} size={iconSize} />}
    </button>
  );
}
