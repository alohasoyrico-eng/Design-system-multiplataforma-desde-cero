import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { FlowIcon } from "@flow/primitives";
import "../../css/overlays/Drawer.css";

export interface FlowDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  side?: "left" | "right";
  children?: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/** FlowDrawer — side panel for detail/forms. Blurred scrim, focus trap, ESC-to-close. */
export function FlowDrawer({ open, onClose, title, side = "right", children }: FlowDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const node = panelRef.current;
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
      className="flow-drawer-scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="flow-drawer"
        data-side={side}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
      >
        <div className="flow-drawer__header">
          {title && (
            <h2 id={titleId} className="flow-drawer__title">
              {title}
            </h2>
          )}
          <button
            type="button"
            className="flow-drawer__close"
            aria-label="Cerrar"
            onClick={onClose}
          >
            <FlowIcon name="close" size="md" />
          </button>
        </div>
        <div className="flow-drawer__body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
