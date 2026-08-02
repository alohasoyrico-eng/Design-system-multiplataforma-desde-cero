# Momentum

Generated portable foundation contract for Design System.

The JSON spec and foundation copy remain the editable source of truth. Regenerate this file with `npm run build:foundation-contracts` after changing foundation copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/foundations/momentum.json`
- `packages/content/content/foundation-copy.json`

## Purpose

Motion system and continuity

Govern motion and transition so movement communicates cause, continuity, feedback, priority, and status without becoming required comprehension.

Momentum governs all animation and transition in the system. It ensures motion is intentional, consistent, and respectful of user preferences.

Every moving element uses Momentum tokens. Components do not use raw durations or easing values.

Motion explains cause, continuity, status, and transition. It never exists only to make the interface feel lively.

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

Token dependencies: `ref.momentum.*`, `sys.momentum.*`, `sys.state.*`, `comp.*.momentum aliases`

Primitive dependencies: `Motion Curves`, `Duration`, `Loading`, `Disabled`

Component dependencies: `Button`, `Tabs`, `Skeleton`, `Progress Bar`, `Motion Boundary`, `Animated Moment`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| instant | sys.momentum.duration.critical | Risk and accessibility fallback changes that must not delay comprehension. |
| fast | sys.momentum.duration.fast | Hover, press, focus, button feedback, small control transitions. |
| default | sys.momentum.duration.default | Tabs, filters, small panels, selected state updates. |
| slow | sys.momentum.duration.slow | Sheets, route transitions, onboarding moments. |
| continuous | sys.state.loading.spin | Loading indicators with reduced-motion alternative. |
| reduced | prefers-reduced-motion | Replace translation/scale with opacity, focus placement, and instant state. |

## Product Examples

- Button loading: Spinner communicates work, but label and aria-busy carry the required information.
- Routes: Map-to-station transition preserves spatial continuity; fallback list uses instant state update.
- Bottom sheet: Sheet reveal explains change of context and restores focus after dismissal.
- Dashboard filters: Chart refresh uses subtle state transition, not decorative movement.

## Token Dependencies

- ref.momentum.*
- sys.momentum.*
- sys.state.*
- comp.*.momentum aliases

## Primitive Dependencies

- Motion Curves
- Duration
- Loading
- Disabled

## Component Dependencies

- Button
- Tabs
- Skeleton
- Progress Bar
- Motion Boundary
- Animated Moment

## Agent Instructions

- State the semantic reason for motion before choosing a preset.
- Always define reduced-motion behavior.
- Do not put required instructions only in animation.
- Use dotLottie only for illustrative or teaching moments.

## Reject If

- Motion is decorative only.
- Reduced-motion behavior is missing.
- Animation is required to understand the task.
- Timing is hardcoded outside Momentum tokens.

## Reference Notes

### Motion Categories

These categories mirror the reference Momentum documentation.

```text
MICRO-INTERACTIONS
0-100ms: hover, press, focus, toggle feedback

TRANSITIONS
150-350ms: tabs, sheets, dropdowns, route panel changes

CHOREOGRAPHY
300-500ms: dashboard loading, staggered cards, onboarding sequences

CONTINUOUS
cycle duration: spinners, progress, shimmer, sync

REDUCED MOTION
replace translation and scale with opacity, focus placement, and instant state changes
```
