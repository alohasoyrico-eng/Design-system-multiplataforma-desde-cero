import type { HTMLAttributes, ReactNode } from "react";
import { FlowIcon } from "@flowds/primitives";
import "../../css/display/Chip.css";

export interface FlowChipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Material Symbols name shown before the label. */
  icon?: string;
  selected?: boolean;
  /** When set, renders a remove button that calls this handler. */
  onRemove?: () => void;
  children?: ReactNode;
}

/** FlowChip — compact, optionally selectable/removable token of content (filters, tags). */
export function FlowChip({ icon, selected, onRemove, children, ...rest }: FlowChipProps) {
  return (
    <span className="flow-chip" data-selected={selected || undefined} {...rest}>
      {icon && <FlowIcon name={icon} size="sm" />}
      <span className="flow-chip__label">{children}</span>
      {onRemove && (
        <button type="button" className="flow-chip__remove" aria-label="Quitar" onClick={onRemove}>
          <FlowIcon name="close" size="sm" />
        </button>
      )}
    </span>
  );
}
