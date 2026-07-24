import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import "../../css/forms/OTPInput.css";

export interface FlowOTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  /** Accessible name for the group. */
  ariaLabel?: string;
  autoFocus?: boolean;
}

/** FlowOTPInput — one box per digit, with auto-advance, backspace and paste. Mono digits. */
export function FlowOTPInput({
  length = 6,
  value,
  onChange,
  ariaLabel = "Código de verificación",
  autoFocus,
}: FlowOTPInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const chars = Array.from({ length }, (_, i) => value[i] ?? "");

  const setChar = (index: number, char: string) => {
    const next = chars.slice();
    next[index] = char;
    onChange(next.join("").slice(0, length));
  };

  const onInput = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    setChar(index, digit);
    if (digit && index < length - 1) refs.current[index + 1]?.focus();
  };

  const onKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !chars[index] && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (digits) {
      onChange(digits);
      refs.current[Math.min(digits.length, length - 1)]?.focus();
    }
  };

  return (
    <div className="flow-otp" role="group" aria-label={ariaLabel}>
      {chars.map((char, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="flow-otp__box"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={char}
          aria-label={`Dígito ${i + 1}`}
          // Opt-in via the `autoFocus` prop; focusing the first box is expected UX for a code screen.
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus && i === 0}
          onChange={(e) => onInput(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={onPaste}
        />
      ))}
    </div>
  );
}
