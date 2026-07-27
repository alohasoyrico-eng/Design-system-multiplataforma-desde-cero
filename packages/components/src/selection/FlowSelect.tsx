import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { FlowIcon } from "@flowds/primitives";
import "../../css/selection/Select.css";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FlowSelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  /** Set by FlowField. */
  id?: string;
  "aria-describedby"?: string;
  ariaLabel?: string;
}

/**
 * FlowSelect — a custom, fully themed listbox (not a native <select>). Follows the WAI-ARIA
 * combobox+listbox pattern: keyboard (↑↓/Home/End/Enter/Esc), aria-activedescendant, click-outside.
 */
export function FlowSelect({
  options,
  value,
  onChange,
  placeholder = "Selecciona…",
  invalid,
  disabled,
  id,
  "aria-describedby": describedBy,
  ariaLabel,
}: FlowSelectProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const baseId = useId();
  const selected = options.find((o) => o.value === value);

  const openMenu = () => {
    if (disabled) return;
    const idx = options.findIndex((o) => o.value === value);
    setActive(idx >= 0 ? idx : options.findIndex((o) => !o.disabled));
    setOpen(true);
  };
  const close = () => setOpen(false);

  const pick = (i: number) => {
    const opt = options[i];
    if (!opt || opt.disabled) return;
    onChange?.(opt.value);
    close();
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (open)
      listRef.current
        ?.querySelector(`[data-index="${active}"]`)
        ?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const move = (dir: number) => {
    let i = active;
    for (let n = 0; n < options.length; n++) {
      i = (i + dir + options.length) % options.length;
      if (!options[i].disabled) {
        setActive(i);
        break;
      }
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(options.findIndex((o) => !o.disabled));
    } else if (e.key === "End") {
      e.preventDefault();
      for (let i = options.length - 1; i >= 0; i--)
        if (!options[i].disabled) {
          setActive(i);
          break;
        }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      pick(active);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      close();
    }
  };

  const listboxId = `${baseId}-list`;
  const optId = (i: number) => `${baseId}-opt-${i}`;

  return (
    <div
      className="flow-select"
      ref={rootRef}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-open={open || undefined}
    >
      <button
        type="button"
        id={id}
        className="flow-select__control"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={open ? optId(active) : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        disabled={disabled}
        data-placeholder={!selected || undefined}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onKeyDown}
      >
        <span className="flow-select__value">{selected ? selected.label : placeholder}</span>
        <FlowIcon name="expand_more" size="md" className="flow-select__chevron" />
      </button>
      {open && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          className="flow-select__menu"
          aria-label={ariaLabel}
        >
          {options.map((o, i) => (
            // Keyboard selection is handled on the combobox button via aria-activedescendant
            // (WAI-ARIA listbox pattern); options are pointer affordances, not focusable.
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <li
              key={o.value}
              id={optId(i)}
              role="option"
              data-index={i}
              aria-selected={o.value === value}
              aria-disabled={o.disabled || undefined}
              data-active={i === active || undefined}
              className="flow-select__option"
              onMouseEnter={() => !o.disabled && setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(i)}
            >
              <span>{o.label}</span>
              {o.value === value && <FlowIcon name="check" size="sm" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
