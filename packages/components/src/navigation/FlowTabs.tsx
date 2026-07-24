import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { FlowIcon } from "@flow/primitives";
import "../../css/navigation/Tabs.css";

export interface TabItem {
  id: string;
  label: ReactNode;
  /** Optional Material Symbols name. */
  icon?: string;
}

export interface FlowTabsProps {
  items: TabItem[];
  /** Controlled active tab id. */
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  /** Accessible name for the tablist. */
  ariaLabel: string;
}

/** FlowTabs — roving-tabindex tablist with ←/→/Home/End keyboard support and an animated indicator. */
export function FlowTabs({ items, value, defaultValue, onChange, ariaLabel }: FlowTabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id);
  const active = value ?? internal;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (id: string) => {
    if (value === undefined) setInternal(id);
    onChange?.(id);
  };

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % items.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    else return;
    e.preventDefault();
    const item = items[next];
    select(item.id);
    refs.current[next]?.focus();
  };

  return (
    <div role="tablist" aria-label={ariaLabel} className="flow-tabs">
      {items.map((item, i) => (
        <button
          key={item.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          role="tab"
          type="button"
          id={`tab-${item.id}`}
          aria-selected={active === item.id}
          tabIndex={active === item.id ? 0 : -1}
          className="flow-tab"
          data-active={active === item.id || undefined}
          onClick={() => select(item.id)}
          onKeyDown={(e) => onKeyDown(e, i)}
        >
          {item.icon && <FlowIcon name={item.icon} size="md" filled={active === item.id} />}
          {item.label}
        </button>
      ))}
    </div>
  );
}
