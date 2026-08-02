# State

Generated portable foundation contract for Design System.

The JSON spec and foundation copy remain the editable source of truth. Regenerate this file with `npm run build:foundation-contracts` after changing foundation copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/foundations/state.json`
- `packages/content/content/foundation-copy.json`

## Purpose

Interaction states and precedence

Define interaction states, precedence, state composition, disabled behavior, loading behavior, validation, and assistive technology mapping.

State defines the formal interaction model for all Design System artifacts: which states exist, how they appear, and how conflicts resolve.

State delegates color to Energy and depth to Depth. Its job is the structural pattern: overlay, ring, border, opacity, message, announcement, or suppression.

State also defines what assistive technologies should receive when a component changes condition.

## Definition Of Ready

Before building or auditing any artifact against this foundation, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every decision must translate back to Design System foundations and primitives.
- Components, patterns, templates, and docs must consume the system contract instead of redefining foundation behavior locally.
- Any exception must be documented as a gap or review gate before implementation.

Layer: `Foundation`

Platform: `System`

Audiences: `Product Designers`, `Developers`, `Product Managers`, `Content Designers`, `Researchers`, `Service Designers`, `Agents`

Required sections: `overview`, `roles`, `productExamples`, `tokens`, `rules`, `dependencies`, `agentInstructions`, `rejectIf`

Reference translation: `Adapt`

Token dependencies: `ref.state.*`, `sys.state.*`, `sys.energy.*`, `sys.a11y.*`, `comp.*.state aliases`

Primitive dependencies: `Focus`, `Loading`, `Disabled`, `Color`

Component dependencies: `Button`, `Select`, `Input`, `Tabs`, `Table`, `Dialog`, `Inline Validation`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| default | state.default | Available, stable, unselected baseline. |
| hover | sys.state.hover.overlay | Pointer affordance without changing semantic value. |
| focus | sys.state.focus.ring | Keyboard and assistive navigation location. |
| pressed | sys.state.pressed.overlay | Momentary activation feedback. |
| selected | sys.state.selected.overlay | Chosen filter, tab, option, or row. |
| loading | sys.state.loading.* | Pending operation; duplicate activation blocked. |
| disabled | sys.state.disabled.opacity | Unavailable because permission, data, offline, risk, or future availability blocks action. |
| error | sys.energy.status.error | Recoverable or blocking failure with repair path. |

## Product Examples

- Select: Open, focused, selected, loading, disabled, and error states remain distinct.
- Card actions: Disabled action explains permission or risk reason instead of only lowering opacity.
- Data table: Selected row, focused row, and error row can coexist without conflicting meaning.
- Authentication: OTP loading blocks duplicate submit while preserving escape and retry.

## Token Dependencies

- ref.state.*
- sys.state.*
- sys.energy.*
- sys.a11y.*
- comp.*.state aliases

## Primitive Dependencies

- Focus
- Loading
- Disabled
- Color

## Component Dependencies

- Button
- Select
- Input
- Tabs
- Table
- Dialog
- Inline Validation

## Agent Instructions

- Resolve state precedence before styling.
- Disabled must include reason when risk, permission, data, or offline blocks the user.
- Focus must stay visible even when selected or error state is active.
- Loading blocks duplicate activation.

## Reject If

- Disabled is only opacity without reason.
- Focus is suppressed by hover, selected, or error.
- Loading can submit duplicate actions.
- Error state lacks recovery or accessible announcement.

## Reference Notes

### State Composition

States can coexist. Precedence prevents incoherent UI.

```text
COMPOSITION
selected + hover   -> selected base + hover overlay
selected + focus   -> selected base + focus ring
error + focus      -> error border + focus ring
loading + hover    -> loading wins; hover suppressed
disabled + error   -> disabled wins; error visual suppressed

REQUIRED STATES
default, hover, pressed, focus, selected, loading, disabled, error, success
```
