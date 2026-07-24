import type { HTMLAttributes, ReactNode } from "react";
import "../../css/display/Badge.css";

export type BadgeTone = "neutral" | "success" | "warning" | "danger";

export interface FlowBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Show a pulsing live dot before the label. */
  live?: boolean;
  children?: ReactNode;
}

/** FlowBadge — compact status label. `live` adds the pulsing dot for real-time states. */
export function FlowBadge({ tone = "neutral", live, children, ...rest }: FlowBadgeProps) {
  return (
    <span className="flow-badge" data-tone={tone} {...rest}>
      {live && <span className="flow-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
