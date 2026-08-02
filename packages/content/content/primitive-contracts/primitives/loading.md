# Loading

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/loading.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Turn State and Momentum loading roles into implementation-ready skeleton, stale, sync, progress, busy, and optimistic patterns.

Loading sits between foundations and components.
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

Governing foundations: `State`, `Momentum`, `Tone`, `Accessibility`

Foundation inputs: `sys.state.*`, `sys.momentum.*`, `sys.tone.*`, `sys.accessibility.*`

Coordinates primitives: `None declared`

Token dependencies: `sys.state.loading.*`, `sys.momentum.*`, `loading.*`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| skeleton | loading.skeleton | Unknown content shape during fetch. |
| stale | loading.stale | Showing old data while refreshing. |
| sync | loading.sync | Background updates and pending changes. |
| progress | loading.progress | Known-duration import/upload/setup. |
| busy | aria-busy | Assistive announcement of pending state. |

## Product Examples

- Button: Loading blocks duplicate submit and preserves label/status.
- Dashboard: Stale data shows freshness and refresh path.
- File upload: Progress exposes value and retry/remove recovery.

## API

Props: `type`, `label`, `progress`, `staleAt`, `retry`

Outputs: `ariaBusy`, `visualPlaceholder`, `recoveryAction`

## States

- loading
- stale
- syncing
- optimistic
- error

## Responsibilities

- Render Loading through semantic foundation roles.
- Expose a small API that maps to foundations and token aliases.
- Work across density, responsive, keyboard, touch, screen reader, contrast, and reduced-motion requirements when relevant.
- Prevent raw visual values or duplicated implementation decisions.

## Token Dependencies

- sys.state.loading.*
- sys.momentum.*
- loading.*

## Agent Instructions

- Keep task information outside animation.
- Announce busy state.
- Offer retry/recovery when loading fails.

## Reject If

- Spinner with no label.
- Loading allows duplicate action.
- Stale data looks fresh.
- Animation carries required information.

## Prevents

Hardcoded loading values and one-off implementation behavior.

## Demo Evidence

Type: `loading`

Initial: `skeleton`

Choices:

- skeleton: skeleton
- stale: stale
- sync: sync
- progress: progress
