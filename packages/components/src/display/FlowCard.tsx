import type { HTMLAttributes, ReactNode, ElementType } from "react";
import "../../css/display/Card.css";

export interface FlowCardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  /** Adds hover lift + float shadow and a pointer cursor. */
  interactive?: boolean;
  children?: ReactNode;
}

/** FlowCard — the base surface container. White card, radius lg, soft rest shadow. */
export function FlowCard({ as, interactive, children, ...rest }: FlowCardProps) {
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag className="flow-card" data-interactive={interactive || undefined} {...rest}>
      {children}
    </Tag>
  );
}
