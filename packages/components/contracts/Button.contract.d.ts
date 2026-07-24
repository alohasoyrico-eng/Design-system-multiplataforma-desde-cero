/**
 * Button — framework-neutral contract (source of truth for every platform).
 *
 * This interface is the canonical API. It maps 1:1 to:
 *   - React:   <FlowButton variant="accent" size="lg" loading />
 *   - Angular: <flow-button [variant]="'accent'" [size]="'lg'" [loading]="true">
 *   - Flutter: FlowButton(variant: ButtonVariant.accent, size: ButtonSize.lg, loading: true)
 *
 * Keep this file in sync with the React props; a codegen step can emit the Angular @Input()
 * and Flutter widget signatures from here.
 */

export type ButtonVariant = "primary" | "accent" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonContract {
  /** Visual + semantic role. `accent` is the surgical-red CTA — at most one per view. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Spinner + busy state; blocks interaction. */
  loading?: boolean;
  disabled?: boolean;
  /** Material Symbols name before the label. */
  iconStart?: string;
  /** Material Symbols name after the label. */
  iconEnd?: string;
  fullWidth?: boolean;
  /** Visible label. Sentence case, Spanish product copy. */
  label: string;
  onPress?: () => void;
}
