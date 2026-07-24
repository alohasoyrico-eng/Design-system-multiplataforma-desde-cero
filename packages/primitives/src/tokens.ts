/** Token-facing unions shared by primitives. Values map 1:1 to generated CSS custom properties. */
export type SpaceStep = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12" | "16";
export type GapToken = SpaceStep | "inline" | "stack";
export type RadiusToken = "xs" | "sm" | "md" | "lg" | "xl" | "pill";
export type Elevation = "none" | "rest" | "raised" | "float" | "overlay";
export type SurfaceVariant = "canvas" | "card" | "sunken" | "inverse";
export type TextColor =
  "primary" | "secondary" | "muted" | "accent" | "onAccent" | "onInverse" | "link";
export type TypeRole =
  | "display-xl"
  | "display"
  | "title-lg"
  | "title"
  | "title-sm"
  | "body"
  | "body-strong"
  | "caption"
  | "overline"
  | "data"
  | "data-lg";

/** Resolve a gap token to its CSS custom property. Named gaps use --sys-gap-*, steps use --sys-space-*. */
export function gapVar(token: GapToken): string {
  return token === "inline" || token === "stack"
    ? `var(--sys-gap-${token})`
    : `var(--sys-space-${token})`;
}

const camel = (s: string) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
/** sys text color role → CSS custom property. */
export function textColorVar(color: TextColor): string {
  return `var(--sys-text-${color === "onAccent" || color === "onInverse" ? color.replace(/([A-Z])/g, "-$1").toLowerCase() : color})`;
}
export { camel };
