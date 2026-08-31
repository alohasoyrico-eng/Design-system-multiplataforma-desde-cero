/** Biometric auth card: face or fingerprint with idle/scanning/success/error states. Always offer onFallback. */
export interface BiometricPromptProps {
  method?: 'face' | 'fingerprint';
  state?: 'idle' | 'scanning' | 'success' | 'error';
  title?: string;
  description?: string;
  onUse?: () => void;
  onFallback?: () => void;
  fallbackLabel?: string;
  style?: React.CSSProperties;
}
export declare function BiometricPrompt(props: BiometricPromptProps): JSX.Element;
