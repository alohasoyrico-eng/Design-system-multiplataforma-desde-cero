import "../../css/feedback/Spinner.css";

export interface FlowSpinnerProps {
  size?: "sm" | "md" | "lg";
  /** Accessible label announced to assistive tech. */
  label?: string;
}

/** FlowSpinner — indeterminate loading indicator. Announces a busy status. */
export function FlowSpinner({ size = "md", label = "Cargando" }: FlowSpinnerProps) {
  return (
    <span className="flow-spinner" data-size={size} role="status" aria-label={label}>
      <span className="flow-spinner__ring" aria-hidden="true" />
    </span>
  );
}
