# Duration

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/duration.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Turn Momentum timing roles into implementation-ready durations for instant, touch, base, slow, loading, and reduced-motion feedback.

Duration sits between foundations and components.
It consumes semantic tokens and exposes a narrow API.
It prevents hardcoded values, detached semantics, and inconsistent implementation.
It must be portable across React, Flutter, documentation, and agent specs.

## Definition Of Ready

Before building or auditing any artifact against this primitive, confirm:

- Design System foundations govern the primitive.
- The primitive exposes a narrow, reusable API and never a one-off component shortcut.
- Components, patterns, templates, and docs consume the primitive contract instead of redefining visual values locally.
- ZIP reference details may influence equivalence only after the primitive maps them back to system foundations.

Layer: `Primitive`

Platform: `System`

Audiences: `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents`

Required sections: `purpose`, `foundationInputs`, `roles`, `productExamples`, `api`, `tokens`, `states`, `agentInstructions`, `rejectIf`

Governing foundations: `Momentum`, `State`, `Accessibility`

Foundation inputs: `sys.momentum.*`, `sys.state.*`, `sys.accessibility.*`

Coordinates primitives: `None declared`

Token dependencies: `ref.momentum.duration.*`, `sys.momentum.duration.*`, `duration.*`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| instant | duration.instant | Critical state and reduced motion. |
| touch | duration.touch | Hover, press, focus, toggle, and direct manipulation feedback. |
| base | duration.base | Expansion, reveal, tabs, filters, and local panel changes. |
| fast | duration.fast | Alias for touch during migration; do not choose it as a separate timing style. |
| slow | duration.slow | Sheets, drawers, route transitions. |
| cycle | duration.cycle | Continuous loading cycles. |

## Product Examples

- Button: Press feedback uses fast timing.
- Route sheet: Sheet movement uses slow timing, reduced motion uses instant.
- Dashboard: Filter update uses default timing.

## API

Props: `duration`, `purpose`, `state`, `reducedMotion`

Outputs: `durationToken`, `cssCustomProperties`, `timeoutGuidance`

## States

- instant
- touch
- base
- fast
- slow
- cycle
- reduced

## Responsibilities

- Render Duration through semantic foundation roles.
- Expose a small API that maps to foundations and token aliases.
- Work across density, responsive, keyboard, touch, screen reader, contrast, and reduced-motion requirements when relevant.
- Prevent raw visual values or duplicated implementation decisions.

## Token Dependencies

- ref.momentum.duration.*
- sys.momentum.duration.*
- duration.*

## Agent Instructions

- Choose duration by product event scale.
- Keep reduced motion equivalent meaningful.
- Do not delay critical feedback.

## Reject If

- Hardcoded ms values.
- Long animation blocks task completion.
- Reduced motion still animates translation/scale.

## Prevents

Hardcoded duration values and one-off implementation behavior.

## Demo Evidence

Type: `motionToken`

Initial: `touch`

Choices:

- touch: Touch
- local: Local
- page: Page
- route: Route
