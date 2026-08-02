# Energy

Generated portable foundation contract for Design System.

The JSON spec and foundation copy remain the editable source of truth. Regenerate this file with `npm run build:foundation-contracts` after changing foundation copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/foundations/energy.json`
- `packages/content/content/foundation-copy.json`

## Purpose

Color, semantic roles and product intensity

Assign semantic meaning to color and visual intensity so users can identify action, status, risk, feedback, and surface hierarchy without guessing.

When color appears in Design System, it always carries meaning. This discipline allows users to interpret the interface quickly and confidently.

Energy translates Design System's design principles into visual meaning through color.

Color in Design System is never decorative — it communicates intent, hierarchy, and feedback.

Energy ensures users can immediately recognize: primary actions, system feedback, critical states, and surface hierarchy.

By doing so, Energy makes Design System predictable and visually learnable.

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

Token dependencies: `ref.energy.*`, `sys.energy.*`, `sys.state.*`, `sys.tone.*`, `comp.*.energy aliases`

Primitive dependencies: `Color`, `Focus`, `Disabled`, `Charts`, `Maps`

Component dependencies: `Button`, `Select`, `KPI Tile`, `Table`, `Station Pin`, `Inline Validation`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| action | sys.energy.action.primary | Primary route, card, configuration, recovery actions, selected controls, focus-adjacent emphasis, navigation, and links. |
| success | sys.energy.status.success | Completed route handoff, successful card unblock, saved permissions. |
| warning | sys.energy.status.warning | Station availability risk, limit warning, stale dashboard data. |
| warningForeground | sys.energy.status.warning.foreground | Warning text, icon, border, and progress color on light surfaces. |
| error | sys.energy.status.error | Blocked route, declined movement, permission failure, destructive confirmation. |
| surface | sys.energy.surface.* | Page, card, panel, sheet, table, and map surfaces. |
| border | sys.energy.border.* | Separators, controls, tables, selected and focused surfaces. |

## Product Examples

- Mobile routes: Primary route action uses action energy; unavailable route uses error energy with recovery copy.
- Driver card detail: Block card uses error energy; quick actions and selected controls use action energy unless risk changes.
- Fleet dashboard: Warnings mark thresholds; success confirms resolved exceptions; surfaces stay calm for scanability.
- Configuration: Permission destructive actions use error energy and preserve audit context.

## Token Dependencies

- ref.energy.*
- sys.energy.*
- sys.state.*
- sys.tone.*
- comp.*.energy aliases

## Primitive Dependencies

- Color
- Focus
- Disabled
- Charts
- Maps

## Component Dependencies

- Button
- Select
- KPI Tile
- Table
- Station Pin
- Inline Validation

## Agent Instructions

- Never choose color by appearance alone; map it to action, status, feedback, risk, or surface.
- For filled interactive status, choose ramp and foreground together: warning uses yellow 400/500/600 with neutral 900; danger uses red 500/600/700 with text-on-action; success uses green 500/600/700 with text-on-action; action uses blue 500/600/700 with text-on-action. For warning text, icons, borders, and progress fills on light surfaces, use the warning foreground role instead of the filled yellow role.
- Preserve status identity in loading and disabled states when risk intent matters.
- Do not introduce new color families outside ref.energy.* without updating this contract.

## Reject If

- Color is used decoratively without semantic role.
- Filled status changes foreground color across default, hover, or pressed states without a documented contrast reason.
- A chart or map relies only on color without accessible text/shape encoding.
- A component defines hardcoded hex values outside Energy tokens.
