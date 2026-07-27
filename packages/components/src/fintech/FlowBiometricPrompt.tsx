import type { ReactNode } from "react";
import { FlowIcon } from "@flowds/primitives";
import "../../css/fintech/BiometricPrompt.css";

export interface FlowBiometricPromptProps {
  /** "fingerprint" or "face" (any Material Symbols name). */
  icon?: string;
  title: string;
  message?: ReactNode;
  /** Fallback action (e.g. "Usar código"). */
  fallback?: ReactNode;
  /** Cancel action. */
  cancel?: ReactNode;
}

/** FlowBiometricPrompt — Face/fingerprint prompt with a fallback. Presentational; wrap in a sheet/dialog. */
export function FlowBiometricPrompt({
  icon = "fingerprint",
  title,
  message,
  fallback,
  cancel,
}: FlowBiometricPromptProps) {
  return (
    <div className="flow-biometric">
      <span className="flow-biometric__icon" aria-hidden="true">
        <FlowIcon name={icon} size="xl" filled />
      </span>
      <h2 className="flow-biometric__title">{title}</h2>
      {message && <p className="flow-biometric__message">{message}</p>}
      {(fallback || cancel) && (
        <div className="flow-biometric__actions">
          {fallback}
          {cancel}
        </div>
      )}
    </div>
  );
}
