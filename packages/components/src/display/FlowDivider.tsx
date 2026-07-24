import type { HTMLAttributes, ReactNode } from "react";
import "../../css/display/Divider.css";

export interface FlowDividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  /** Optional centered label, e.g. "o". */
  children?: ReactNode;
}

/** FlowDivider — a hairline separator, optionally with a centered label. */
export function FlowDivider({ orientation = "horizontal", children, ...rest }: FlowDividerProps) {
  if (children) {
    return (
      <div className="flow-divider flow-divider--labeled" role="separator" {...rest}>
        <span className="flow-divider__label">{children}</span>
      </div>
    );
  }
  return (
    <div
      className="flow-divider"
      data-orientation={orientation}
      role="separator"
      aria-orientation={orientation}
      {...rest}
    />
  );
}
