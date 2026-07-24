import { FlowIcon } from "@flow/primitives";
import "../../css/fintech/PasscodeKeypad.css";

export interface FlowPasscodeKeypadProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  /** Called when the passcode reaches `length` digits. */
  onComplete?: (value: string) => void;
  ariaLabel?: string;
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

/** FlowPasscodeKeypad — numeric passcode entry with progress dots. Mono digits. */
export function FlowPasscodeKeypad({
  length = 6,
  value,
  onChange,
  onComplete,
  ariaLabel = "Ingresa tu código",
}: FlowPasscodeKeypadProps) {
  const press = (key: string) => {
    if (key === "back") {
      onChange(value.slice(0, -1));
      return;
    }
    if (value.length >= length) return;
    const next = value + key;
    onChange(next);
    if (next.length === length) onComplete?.(next);
  };

  return (
    <div className="flow-passcode" role="group" aria-label={ariaLabel}>
      <div className="flow-passcode__dots" aria-hidden="true">
        {Array.from({ length }, (_, i) => (
          <span
            key={i}
            className="flow-passcode__dot"
            data-filled={i < value.length || undefined}
          />
        ))}
      </div>
      <div className="flow-passcode__keys">
        {KEYS.map((key, i) =>
          key === "" ? (
            <span key={i} className="flow-passcode__spacer" />
          ) : (
            <button
              key={i}
              type="button"
              className="flow-passcode__key"
              aria-label={key === "back" ? "Borrar" : key}
              onClick={() => press(key)}
            >
              {key === "back" ? <FlowIcon name="backspace" size="md" /> : key}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
