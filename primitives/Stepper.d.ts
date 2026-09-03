export interface StepItem { label: string; description?: string; }
/** Wizard progress. Done = accent check (springs in), active = ink dot with glow. */
export interface StepperProps {
  steps: StepItem[];
  /** 0-based active step. */
  current?: number;
  orientation?: 'horizontal' | 'vertical';
  style?: React.CSSProperties;
}
export declare function Stepper(props: StepperProps): JSX.Element;
