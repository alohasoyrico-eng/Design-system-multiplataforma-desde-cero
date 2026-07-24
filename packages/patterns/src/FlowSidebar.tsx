import type { ReactNode } from "react";
import { FlowIcon } from "@flow/primitives";
import "../css/Sidebar.css";

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
}

export interface FlowSidebarProps {
  items: SidebarItem[];
  activeId: string;
  onSelect?: (id: string) => void;
  /** Brand slot (wordmark / logo). */
  brand?: ReactNode;
}

/** FlowSidebar — fixed navigation rail for dashboards. Active item uses the accent-subtle surface. */
export function FlowSidebar({ items, activeId, onSelect, brand }: FlowSidebarProps) {
  return (
    <nav className="flow-sidebar" aria-label="Principal">
      {brand && <div className="flow-sidebar__brand">{brand}</div>}
      <ul className="flow-sidebar__list">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <button
                type="button"
                className="flow-sidebar__item"
                data-active={active || undefined}
                aria-current={active ? "page" : undefined}
                onClick={() => onSelect?.(item.id)}
              >
                <FlowIcon name={item.icon} size="lg" filled={active} />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
