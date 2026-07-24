import type { ElementType, ReactNode, HTMLAttributes, CSSProperties } from "react";
import { type SurfaceVariant, type Elevation, type RadiusToken, type SpaceStep } from "./tokens";

export interface SurfaceProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  /** Background + on-surface text color. Defaults to "card". */
  variant?: SurfaceVariant;
  elevation?: Elevation;
  radius?: RadiusToken;
  /** Uniform padding from the space scale. */
  padding?: SpaceStep;
  /** Draw a 1px subtle border. */
  bordered?: boolean;
  children?: ReactNode;
}

const ON_SURFACE: Record<SurfaceVariant, string> = {
  canvas: "var(--sys-text-primary)",
  card: "var(--sys-text-primary)",
  sunken: "var(--sys-text-primary)",
  inverse: "var(--sys-text-on-inverse)",
};

/** Surface — the container primitive. Hierarchy comes from surface + elevation, never gradients. */
export function Surface({
  as,
  variant = "card",
  elevation = "none",
  radius,
  padding,
  bordered,
  style,
  children,
  ...rest
}: SurfaceProps) {
  const Tag = (as ?? "div") as ElementType;
  const css: CSSProperties = {
    background: `var(--sys-surface-${variant})`,
    color: ON_SURFACE[variant],
    ...(elevation !== "none" ? { boxShadow: `var(--sys-elevation-${elevation})` } : null),
    ...(radius ? { borderRadius: `var(--sys-radius-${radius})` } : null),
    ...(padding ? { padding: `var(--sys-space-${padding})` } : null),
    ...(bordered
      ? { border: `var(--sys-border-width-thin) solid var(--sys-border-subtle)` }
      : null),
    ...style,
  };
  return (
    <Tag style={css} {...rest}>
      {children}
    </Tag>
  );
}
