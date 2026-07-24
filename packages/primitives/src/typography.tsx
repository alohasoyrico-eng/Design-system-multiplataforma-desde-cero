import type { ElementType, ReactNode, HTMLAttributes } from "react";
import { type TypeRole, type TextColor, textColorVar } from "./tokens";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Typographic role from the scale. Defaults to "body". (Named `variant` to avoid the ARIA `role` attribute.) */
  variant?: TypeRole;
  /** Render element. Defaults to a sensible tag for the variant. */
  as?: ElementType;
  /** Semantic text color. Defaults to the inherited color. */
  color?: TextColor;
  align?: "start" | "center" | "end";
  /** Truncate to a single line with ellipsis. */
  truncate?: boolean;
  children?: ReactNode;
}

const DEFAULT_TAG: Partial<Record<TypeRole, ElementType>> = {
  "display-xl": "h1",
  display: "h1",
  "title-lg": "h2",
  title: "h3",
  "title-sm": "h4",
  overline: "span",
  caption: "span",
  data: "span",
  "data-lg": "span",
};

/** Text — the single typographic primitive. Every role maps to system type tokens; never set font sizes by hand. */
export function Text({
  variant = "body",
  as,
  color,
  align,
  truncate,
  className,
  style,
  children,
  ...rest
}: TextProps) {
  const Tag = (as ?? DEFAULT_TAG[variant] ?? "p") as ElementType;
  const classes = [`flow-type-${variant}`, truncate && "flow-truncate", className]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag
      className={classes}
      style={{
        ...(color ? { color: textColorVar(color) } : null),
        ...(align ? { textAlign: align } : null),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
