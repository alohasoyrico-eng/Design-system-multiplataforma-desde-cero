import type { CSSProperties } from "react";

export type IconSize = "sm" | "md" | "lg" | "xl";

export interface FlowIconProps {
  /** Material Symbols Rounded ligature name, e.g. "arrow_forward", "check", "bolt". */
  name: string;
  /** Filled variant — use for the active/selected state. */
  filled?: boolean;
  size?: IconSize;
  /**
   * Accessible label. When provided the icon is exposed as an image with this label;
   * when omitted the icon is decorative and hidden from assistive tech.
   */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/** FlowIcon — Material Symbols only. Decorative by default; pass `label` to make it meaningful. */
export function FlowIcon({ name, filled, size = "md", label, className, style }: FlowIconProps) {
  const classes = ["flow-icon", filled && "flow-icon--fill", className].filter(Boolean).join(" ");
  return (
    <span
      className={classes}
      style={{ fontSize: `var(--sys-icon-${size})`, ...style }}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      {name}
    </span>
  );
}
