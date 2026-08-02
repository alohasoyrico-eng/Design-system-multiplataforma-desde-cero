# Biometric Prompt

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/biometric-prompt/all.json`

## Purpose

Use Biometric Prompt as a bounded component: Request one biometric authentication confirmation with fallback copy without owning the complete auth, enrollment, recovery, or risk process.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.biometric-prompt.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- Auth orchestration, enrollment, recovery, risk scoring, and step-up policies belong to authentication patterns.
- State is color-only.
- Component owns a process.
- Ask before build: The request needs orchestration, multi-step behavior, or cross-surface state.
- Ask before build: Auth orchestration, enrollment, recovery, risk scoring, and step-up policies belong to authentication patterns.
- Ask before build: Accessibility, risk, or reduced-motion expectations are unclear.

## Use When

- Use Biometric Prompt for one local UI job.
- Select variant and state from the Biometric Prompt contract.
- Keep labels, focus, and state visible.

## Do Not Use Without Review

- Ask before use when the request needs orchestration, multi-step behavior, or cross-surface state.
- Ask before use when auth orchestration, enrollment, recovery, risk scoring, and step-up policies belong to authentication patterns.
- Ask before use when accessibility, risk, or reduced-motion expectations are unclear.
- Auth orchestration, enrollment, recovery, risk scoring, and step-up policies belong to authentication patterns.
- Required meaning is icon-only, color-only, or motion-only.
- The component becomes a process container.
- State is color-only.
- Component owns multi-step system.
- Required label or fallback is missing.

## Operational Example

Use Biometric Prompt as a bounded component: Request one biometric authentication confirmation with fallback copy without owning the complete auth, enrollment, recovery, or risk process.

### Why Biometric Prompt

- Request one biometric authentication confirmation with fallback copy without owning the complete auth, enrollment, recovery, or risk process.
- Auth orchestration, enrollment, recovery, risk scoring, and step-up policies belong to authentication patterns.
- Keep Biometric Prompt small enough to validate with Design System foundations, primitives, and accessibility rules.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Surface | Owns the visible Biometric Prompt container and spacing. | comp.biometric-prompt.*, sys.frame.* |
| Primary label | Provides visible meaning and accessible name. | sys.voice.* |
| State affordance | Shows current state without relying on color only. | sys.state.* |
| Supporting metadata | Keeps context short and local to the component. | sys.growth.* |
| Icon or motion cue | Supports recognition without replacing text. | sys.symbol.*, sys.iconography.* |

## Accessibility

State precedence: disabled, error, warning, authenticating, success, focus, default

- Provide a visible accessible label.
- Expose current state through text or ARIA where applicable.
- Keep keyboard focus visible and predictable.
- Respect reduced motion for motion-bearing variants.
- Escalate to a pattern when behavior exceeds one local component.

## Foundations

Referenced token families:

- `comp.biometric-prompt.*`
- `sys.frame.*`
- `sys.growth.*`
- `sys.iconography.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.voice.*`

Biometric Prompt API exposes local props while Design System owns foundations, primitives, state precedence, and escalation rules.

## Variants

Biometric Prompt variants define local presentation only. Auth orchestration, enrollment, recovery, risk scoring, and step-up policies belong to authentication patterns.

Approved variants from demos: `fingerprint`, `face`, `passcode`, `fallback`

Demo labels:

- Fingerprint
- Face
- Passcode
- Fallback

## States

Biometric Prompt states follow explicit precedence so status remains readable and auditable.

Supported states from docs: `default`, `focus`, `authenticating`, `success`, `warning`, `error`, `disabled`

## Variant X State Behavior

Variant controls presentation; state controls local behavior. Auth orchestration, enrollment, recovery, risk scoring, and step-up policies belong to authentication patterns.

State matrix: `default`, `focus`, `authenticating`, `success`, `warning`, `error`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Fingerprint | fingerprint |  |
| Face | face |  |
| Passcode | passcode |  |

## Full Width

Biometric Prompt may fill its parent when content remains readable and behavior stays local.

- Mobile: layout: button-stack
- Panel: layout: button-stack
- Desktop: layout: button-stack

## Responsive Layout Patterns

Use responsive density to preserve labels, state, and targets; do not add pattern orchestration to Biometric Prompt.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | simple-demo-row | md |

## Viewport Organization

Viewport rules decide density and placement while Biometric Prompt remains a component.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use readable labels and touch-safe targets. | mobile surface | lg |
| Tablet | Keep the component near related context. | context panel | md |
| Desktop | Use compact density only when state remains visible. | admin surface | sm |

## Playground

Use the playground to verify Biometric Prompt label, variant, state, full-width behavior, and pattern boundary.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Biometric Prompt |  |
| variant | select | fingerprint | fingerprint, face, passcode, fallback |
| state | select | default | default, focus, authenticating, success, warning, error, disabled |
| fullWidth | checkbox | false |  |

## API And Foundations

Biometric Prompt API exposes local props while Design System owns foundations, primitives, state precedence, and escalation rules.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Visible prompt title. |
| description | string | No | Trust or instruction copy. |
| variant | BiometricPromptVariant | No | Biometric or fallback treatment. |
| state | BiometricPromptState | No | Authentication state. |
| actionLabel | string | No | Primary authentication action label. |
| density | "sm" \| "md" \| "lg" | No | Responsive prompt density. |
| fullWidth | boolean | No | Allows the prompt to fill its parent when content remains readable. |
| fallback | string | No | Secure fallback label. |
| icon | IconName | No | Decorative biometric icon. |

## Implementation Checklist

- Provide `label`: Visible prompt title.
- Visible label
- State precedence
- Keyboard focus
- Responsive layout
- Reduced motion when relevant
- Pattern boundary

## Tests And Rejection Rules

Must test:

- Visible label
- State precedence
- Keyboard focus
- Responsive layout
- Reduced motion when relevant
- Pattern boundary

Reject if:

- Auth orchestration, enrollment, recovery, risk scoring, and step-up policies belong to authentication patterns.
- State is color-only.
- Component owns multi-step system.
- Required label or fallback is missing.

## MIEL

MIEL treats Biometric Prompt as a bounded component. Agents may place it when the job is local; humans confirm state, accessibility, content, and whether escalation to a pattern is required.

Agents can decide:

- Use Biometric Prompt for one local UI job.
- Select variant and state from the Biometric Prompt contract.
- Keep labels, focus, and state visible.

Agents must ask:

- The request needs orchestration, multi-step behavior, or cross-surface state.
- Auth orchestration, enrollment, recovery, risk scoring, and step-up policies belong to authentication patterns.
- Accessibility, risk, or reduced-motion expectations are unclear.

Agents must reject:

- Auth orchestration, enrollment, recovery, risk scoring, and step-up policies belong to authentication patterns.
- Required meaning is icon-only, color-only, or motion-only.
- The component becomes a process container.

Handoff language:

> I am using Biometric Prompt as a bounded component. Please confirm label, state, accessibility behavior, responsive treatment, and whether this should escalate to a pattern.
