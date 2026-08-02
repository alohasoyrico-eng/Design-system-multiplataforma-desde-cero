# Disabled

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/disabled.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Turn State, Tone, and Accessibility disabled rules into unavailable, permission-blocked, offline-blocked, data-blocked, risk-blocked, and future-available semantics.

Disabled sits between foundations and components.
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

Governing foundations: `State`, `Tone`, `Accessibility`, `Energy`

Foundation inputs: `sys.state.*`, `sys.tone.*`, `sys.accessibility.*`, `sys.energy.*`

Coordinates primitives: `None declared`

Token dependencies: `sys.state.disabled.*`, `sys.tone.*`, `disabled.*`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| unavailable | disabled.unavailable | Temporarily not actionable. |
| permission | disabled.permission | Role or scope blocks action. |
| offline | disabled.offline | Network/data dependency unavailable. |
| risk | disabled.risk | High-risk action needs review or prerequisite. |
| future | disabled.future | Not yet available but intentionally visible. |

## Product Examples

- Quick action: Blocked card action explains permission or card state.
- Routes: Offline route action offers saved station list if available.
- Configuration: Permission edit blocked by dependency and audit owner.

## API

Props: `reason`, `recoverable`, `owner`, `availableAt`, `fallback`

Outputs: `disabledState`, `explanation`, `recoveryPath`

## States

- disabled
- permissionBlocked
- offlineBlocked
- riskBlocked
- futureAvailable

## Responsibilities

- Render Disabled through semantic foundation roles.
- Expose a small API that maps to foundations and token aliases.
- Work across density, responsive, keyboard, touch, screen reader, contrast, and reduced-motion requirements when relevant.
- Prevent raw visual values or duplicated implementation decisions.

## Token Dependencies

- sys.state.disabled.*
- sys.tone.*
- disabled.*

## Agent Instructions

- Always explain why a disabled action is unavailable.
- Provide owner or recovery when possible.
- Do not rely on opacity alone.

## Reject If

- Disabled has no reason.
- Blocked action lacks fallback.
- Disabled state hides critical dependency.
- Opacity is the only cue.

## Prevents

Hardcoded disabled values and one-off implementation behavior.

## Demo Evidence

Type: `disabled`

Initial: `permission`

Choices:

- permission: permission
- offline: offline
- risk: risk
- future: future
