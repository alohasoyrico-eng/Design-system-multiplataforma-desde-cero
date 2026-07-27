import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { FlowIcon } from "@flowds/primitives";
import "../../css/feedback/Toast.css";

export type ToastTone = "neutral" | "success" | "danger";

export interface ToastOptions {
  tone?: ToastTone;
  /** Auto-dismiss after this many ms. Set 0 to keep until dismissed. Default 4000. */
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastRecord extends ToastOptions {
  id: number;
  message: string;
}

interface ToastApi {
  show: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

/** useToast — imperative API to raise toasts. Must be used under a FlowToastProvider. */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a FlowToastProvider");
  return ctx;
}

/** FlowToastProvider — wraps the app, exposes useToast(), and renders the toast region. */
export function FlowToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, options: ToastOptions = {}) => {
      const id = ++counter.current;
      const duration = options.duration ?? 4000;
      setToasts((list) => [...list, { id, message, ...options }]);
      if (duration > 0) window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {createPortal(
        <div
          className="flow-toast-region"
          role="region"
          aria-live="polite"
          aria-label="Notificaciones"
        >
          {toasts.map((t) => (
            <div key={t.id} className="flow-toast" data-tone={t.tone ?? "neutral"}>
              <span className="flow-toast__message">{t.message}</span>
              {t.action && (
                <button
                  type="button"
                  className="flow-toast__action"
                  onClick={() => {
                    t.action?.onClick();
                    dismiss(t.id);
                  }}
                >
                  {t.action.label}
                </button>
              )}
              <button
                type="button"
                className="flow-toast__close"
                aria-label="Cerrar"
                onClick={() => dismiss(t.id)}
              >
                <FlowIcon name="close" size="sm" />
              </button>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
