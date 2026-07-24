import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import "../../css/overlays/Dialog.css";

export interface FlowDialogProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  /** Footer actions, typically a pair of FlowButtons. */
  footer?: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/** FlowDialog — modal with blurred scrim, focus trap, ESC-to-close and focus restore. */
export function FlowDialog({ open, onClose, title, children, footer }: FlowDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const node = dialogRef.current;
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
    // The scrim is a supplementary close affordance; the accessible paths are ESC and the footer
    // buttons, so a click-to-dismiss backdrop does not need its own interactive role.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="flow-dialog-scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="flow-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
      >
        {title && (
          <h2 id={titleId} className="flow-dialog__title">
            {title}
          </h2>
        )}
        <div className="flow-dialog__body">{children}</div>
        {footer && <div className="flow-dialog__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
