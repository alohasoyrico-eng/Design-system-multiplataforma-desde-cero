import { Fragment } from "react";
import { FlowIcon } from "@flow/primitives";
import "../../css/navigation/Breadcrumb.css";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface FlowBreadcrumbProps {
  items: BreadcrumbItem[];
}

/** FlowBreadcrumb — path navigation. The last item is the current page. */
export function FlowBreadcrumb({ items }: FlowBreadcrumbProps) {
  return (
    <nav className="flow-breadcrumb" aria-label="Ruta de navegación">
      <ol className="flow-breadcrumb__list">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={item.label}>
              <li className="flow-breadcrumb__item">
                {last || !item.href ? (
                  <span
                    className="flow-breadcrumb__current"
                    aria-current={last ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <a className="flow-breadcrumb__link" href={item.href}>
                    {item.label}
                  </a>
                )}
              </li>
              {!last && (
                <li className="flow-breadcrumb__sep" aria-hidden="true">
                  <FlowIcon name="chevron_right" size="sm" />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
