import { useId, type ReactNode } from "react";
import "../../css/feedback/Tooltip.css";

export interface FlowTooltipProps {
  /** Tooltip text. */
  content: ReactNode;
  placement?: "top" | "bottom";
  /** The trigger. Wrapped in a focusable element so the tooltip is keyboard-reachable. */
  children: ReactNode;
}

/** FlowTooltip — shows a hint on hover and focus. Associated via aria-describedby. */
export function FlowTooltip({ content, placement = "top", children }: FlowTooltipProps) {
  const id = useId();
  return (
    <span className="flow-tooltip">
      {/* The tooltip trigger must be focusable so the hint is keyboard-reachable (WAI-ARIA tooltip). */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <span className="flow-tooltip__trigger" tabIndex={0} aria-describedby={id}>
        {children}
      </span>
      <span className="flow-tooltip__bubble" role="tooltip" id={id} data-placement={placement}>
        {content}
      </span>
    </span>
  );
}
