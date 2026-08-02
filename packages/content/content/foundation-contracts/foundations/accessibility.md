# Accessibility

Generated portable foundation contract for Design System.

The JSON spec and foundation copy remain the editable source of truth. Regenerate this file with `npm run build:foundation-contracts` after changing foundation copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/foundations/accessibility.json`
- `packages/content/content/foundation-copy.json`

## Purpose

Access, recovery and inclusive interaction

Ensure every artifact preserves access through semantics, keyboard, focus, touch, contrast, reduced motion, language, localization, recovery, and fallback behavior.

Accessibility preserves access through keyboard, touch, screen reader, contrast, motion, language, and recovery.

It is product-specific in Design System because drivers and fleet managers often work under constrained, mobile, operational, or high-risk conditions.

Accessibility is not a final checklist; it is a foundation that changes component, pattern, and template behavior.

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

Token dependencies: `ref.a11y.*`, `sys.a11y.*`, `sys.state.*`, `sys.energy.*`

Primitive dependencies: `Focus`, `Disabled`, `Loading`, `Charts`, `Maps`, `Typography`

Component dependencies: `Button`, `Select`, `Code Input`, `Dialog`, `Table`, `Chart Panel`, `Station Detail and Route Guidance pattern`, `Checkbox`, `Switch`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| name | a11y.name | Every interactive control has visible or programmatic accessible name. |
| role | a11y.role | Native or ARIA role matches behavior. |
| state | a11y.state | Expanded, selected, busy, disabled, invalid, current announced correctly. |
| focus | sys.a11y.focus.* | Visible focus, order, trap, restore, skip route. |
| touch | sys.a11y.touch.target.min | Mobile and tablet controls meet target size. |
| contrast | a11y.contrast.* | Text, controls, status, charts, maps remain readable. |
| recovery | a11y.recovery | Errors explain cause, next step, support path, and escalation. |

## Product Examples

- Authentication: Code inputs group labels, paste behavior, error announcement, resend timer, and fallback.
- Routes map: Permission denied state provides fallback station list and route action alternatives.
- Dashboard charts: Every chart has title, description, text summary, legend, and keyboard-reachable data.
- Configuration: Permission matrix supports keyboard navigation, dependency warnings, and audit copy.

## Token Dependencies

- ref.a11y.*
- sys.a11y.*
- sys.state.*
- sys.energy.*

## Primitive Dependencies

- Focus
- Disabled
- Loading
- Charts
- Maps
- Typography

## Component Dependencies

- Button
- Select
- Code Input
- Dialog
- Table
- Chart Panel
- Station Detail and Route Guidance pattern
- Checkbox
- Switch

## Agent Instructions

- Start with native semantics before ARIA.
- Define keyboard behavior and focus restoration for every interactive artifact.
- Reduced motion must preserve information.
- Charts and maps require non-visual alternatives.

## Reject If

- Accessibility appears only as a final checklist.
- Keyboard path is missing or trapped.
- Chart/map has no text or list alternative.
- Error lacks recovery, support, or escalation path.

## Reference Notes

### Access Contract

Every artifact must keep a usable path when a modality or permission is unavailable.

```text
REQUIRED PATHS
keyboard path
touch path
screen reader name and state
contrast-safe role
reduced-motion equivalent
permission denied recovery
offline or stale-data recovery

RULE
If one modality fails, the task must still have a documented route.
```
