import type { ReactNode } from "react";
import "../css/Topbar.css";

export interface FlowTopbarProps {
  title: ReactNode;
  /** Right-aligned actions (buttons, switch, avatar…). */
  actions?: ReactNode;
}

/** FlowTopbar — page header bar for the dashboard shell. */
export function FlowTopbar({ title, actions }: FlowTopbarProps) {
  return (
    <header className="flow-topbar">
      <h1 className="flow-topbar__title">{title}</h1>
      {actions && <div className="flow-topbar__actions">{actions}</div>}
    </header>
  );
}
