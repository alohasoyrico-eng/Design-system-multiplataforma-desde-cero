import "../../css/feedback/ProgressBar.css";

export interface FlowProgressBarProps {
  /** 0–100. Omit for an indeterminate bar. */
  value?: number;
  /** Accessible label. */
  label?: string;
}

/** FlowProgressBar — determinate or indeterminate progress. */
export function FlowProgressBar({ value, label }: FlowProgressBarProps) {
  const indeterminate = value == null;
  const clamped = indeterminate ? undefined : Math.max(0, Math.min(100, value));
  return (
    <div
      className="flow-progress"
      data-indeterminate={indeterminate || undefined}
      role="progressbar"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={indeterminate ? undefined : 0}
      aria-valuemax={indeterminate ? undefined : 100}
    >
      <span
        className="flow-progress__indicator"
        style={indeterminate ? undefined : { width: `${clamped}%` }}
      />
    </div>
  );
}
