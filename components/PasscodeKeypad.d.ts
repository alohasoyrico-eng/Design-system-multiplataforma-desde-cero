/** Numeric keypad + progress dots for mobile passcode entry. */
export interface PasscodeKeypadProps {
  length?: number;
  value?: string;
  onChange?: (v: string) => void;
  onComplete?: (v: string) => void;
  invalid?: boolean;
  /** Shows a biometric key (e.g. 'fingerprint' / 'ar_on_you'). */
  biometricIcon?: string;
  onBiometric?: () => void;
  style?: React.CSSProperties;
}
export declare function PasscodeKeypad(props: PasscodeKeypadProps): JSX.Element;
