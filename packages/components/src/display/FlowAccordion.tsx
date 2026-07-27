import { useId, useState, type ReactNode } from "react";
import { FlowIcon } from "@flowds/primitives";
import "../../css/display/Accordion.css";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

export interface FlowAccordionProps {
  items: AccordionItem[];
  /** Allow more than one section open at a time. */
  allowMultiple?: boolean;
  /** Ids open on first render. */
  defaultOpen?: string[];
}

/** FlowAccordion — expandable sections with proper button/region semantics. */
export function FlowAccordion({ items, allowMultiple, defaultOpen = [] }: FlowAccordionProps) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<string>>(new Set(defaultOpen));

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flow-accordion">
      {items.map((item) => {
        const expanded = open.has(item.id);
        const headerId = `${baseId}-${item.id}-h`;
        const panelId = `${baseId}-${item.id}-p`;
        return (
          <div className="flow-accordion__item" key={item.id}>
            <h3 className="flow-accordion__heading">
              <button
                type="button"
                id={headerId}
                className="flow-accordion__trigger"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                <span>{item.title}</span>
                <FlowIcon
                  name="expand_more"
                  size="md"
                  className="flow-accordion__icon"
                  style={{ transform: expanded ? "rotate(180deg)" : undefined }}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className="flow-accordion__panel"
              hidden={!expanded}
            >
              <div className="flow-accordion__content">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
