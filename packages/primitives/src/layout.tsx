import type { ElementType, ReactNode, HTMLAttributes, CSSProperties } from "react";
import { type GapToken, type SpaceStep, gapVar } from "./tokens";

type Align = "start" | "center" | "end" | "stretch" | "baseline";
type Justify = "start" | "center" | "end" | "between" | "around";

const ALIGN: Record<Align, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
  baseline: "baseline",
};
const JUSTIFY: Record<Justify, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
};

interface FlexProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  gap?: GapToken;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
  children?: ReactNode;
}

function Flex(direction: "row" | "column") {
  return function Layout({
    as,
    gap = "stack",
    align,
    justify,
    wrap,
    style,
    children,
    ...rest
  }: FlexProps) {
    const Tag = (as ?? "div") as ElementType;
    const css: CSSProperties = {
      display: "flex",
      flexDirection: direction,
      gap: gapVar(gap),
      ...(align ? { alignItems: ALIGN[align] } : null),
      ...(justify ? { justifyContent: JUSTIFY[justify] } : null),
      ...(wrap ? { flexWrap: "wrap" } : null),
      ...style,
    };
    return (
      <Tag style={css} {...rest}>
        {children}
      </Tag>
    );
  };
}

/** Stack — vertical flow. */
export const Stack = Flex("column");
/** Inline — horizontal flow. */
export const Inline = Flex("row");

export interface GridProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  /** Number of equal columns, or an explicit grid-template-columns string. */
  columns?: number | string;
  gap?: GapToken;
  /** Minimum column width for an auto-fit responsive grid (space step). */
  minColumn?: SpaceStep;
  children?: ReactNode;
}

/** Grid — 2D layout on the space scale. */
export function Grid({ as, columns = 12, gap = "stack", style, children, ...rest }: GridProps) {
  const Tag = (as ?? "div") as ElementType;
  const template = typeof columns === "number" ? `repeat(${columns}, minmax(0, 1fr))` : columns;
  const css: CSSProperties = {
    display: "grid",
    gridTemplateColumns: template,
    gap: gapVar(gap),
    ...style,
  };
  return (
    <Tag style={css} {...rest}>
      {children}
    </Tag>
  );
}
