# Motion Curves

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/motion-curves.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Turn Momentum easing roles into implementation-ready curves for touch feedback, enter and exit lifecycle motion, move/morph transitions, and linear loading.

Motion Curves sits between foundations and components.
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

Token dependencies: `ref.momentum.easing.*`, `sys.momentum.easing.*`, `motion.curve.*`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| touch | motion.curve.touch | Controls people touch: hover, press, focus, toggle, and quick feedback. |
| enter | motion.curve.enter | Sheets, drawers, menus entering. |
| exit | motion.curve.exit | Sheets, drawers, menus, dialogs, and temporary surfaces leaving. |
| move | motion.curve.move | Movement, morphing, and layout continuity. |
| standard | motion.curve.standard | Alias for touch during migration; do not choose it as a separate style. |
| linear | motion.curve.linear | Continuous loading or progress movement. |

## Product Examples

- Bottom sheet: Enter curve reveals station detail with spatial continuity.
- Dashboard refresh: Touch curve confirms filter chips, toggles, and quick actions with spring feedback.
- Loading: Linear curve applies to continuous spinner only.

## API

Props: `curve`, `purpose`, `reducedMotion`

Outputs: `easingToken`, `reducedMotionFallback`

## States

- touch
- enter
- exit
- move
- standard
- continuous
- reduced

## Responsibilities

- Render Motion Curves through semantic foundation roles.
- Expose a small API that maps to foundations and token aliases.
- Work across density, responsive, keyboard, touch, screen reader, contrast, and reduced-motion requirements when relevant.
- Prevent raw visual values or duplicated implementation decisions.

## Token Dependencies

- ref.momentum.easing.*
- sys.momentum.easing.*
- motion.curve.*

## Agent Instructions

- Choose curve by semantic motion purpose.
- Define reduced-motion fallback.
- Avoid custom cubic-bezier values.

## Reject If

- Custom easing outside tokens.
- Curve used decoratively.
- Reduced-motion equivalent missing.

## Prevents

Hardcoded motion curves values and one-off implementation behavior.

## Demo Evidence

Type: `motionToken`

Initial: `touch`

Choices:

- touch: Touch
- local: Local
- page: Page
- route: Route
