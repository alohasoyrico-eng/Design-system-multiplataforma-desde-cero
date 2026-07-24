import type { ReactNode } from "react";
import { FlowIcon } from "@flow/primitives";
import { FlowSpinner } from "./FlowSpinner";
import "../../css/feedback/StatusView.css";

export type StatusTone = "success" | "error" | "pending" | "offline" | "info";

export interface FlowStatusViewProps {
  tone: StatusTone;
  title: string;
  message?: ReactNode;
  /** Override the default icon for the tone. */
  icon?: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
}

const DEFAULT_ICON: Record<Exclude<StatusTone, "pending">, string> = {
  success: "check_circle",
  error: "error",
  offline: "wifi_off",
  info: "info",
};

/** FlowStatusView — full-screen state for flows that depend on an external service. */
export function FlowStatusView({
  tone,
  title,
  message,
  icon,
  primaryAction,
  secondaryAction,
}: FlowStatusViewProps) {
  return (
    <div
      className="flow-status-view"
      data-tone={tone}
      role="status"
      aria-live={tone === "pending" ? "polite" : "off"}
    >
      <span className="flow-status-view__icon" aria-hidden="true">
        {tone === "pending" ? (
          <FlowSpinner size="lg" />
        ) : (
          <FlowIcon name={icon ?? DEFAULT_ICON[tone]} filled size="xl" />
        )}
      </span>
      <h2 className="flow-status-view__title">{title}</h2>
      {message && <p className="flow-status-view__message">{message}</p>}
      {(primaryAction || secondaryAction) && (
        <div className="flow-status-view__actions">
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
