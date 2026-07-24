import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import "../../css/feedback/BottomSheet.css";

export interface FlowBottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/** FlowBottomSheet — mobile sheet that slides up. Blurred scrim, focus trap, ESC-to-close. */
export function FlowBottomSheet({ open, onClose, title, children }: FlowBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const node = sheetRef.current;
    const focusables = () => Array.from(node?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const items = focusables();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    // Backdrop is a supplementary close affordance; ESC and controls are the accessible paths.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="flow-sheet-scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={sheetRef}
        className="flow-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
      >
        <span className="flow-sheet__handle" aria-hidden="true" />
        {title && (
          <h2 id={titleId} className="flow-sheet__title">
            {title}
          </h2>
        )}
        <div className="flow-sheet__body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
