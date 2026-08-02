# Depth

Generated portable foundation contract for Design System.

The JSON spec and foundation copy remain the editable source of truth. Regenerate this file with `npm run build:foundation-contracts` after changing foundation copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/foundations/depth.json`
- `packages/content/content/foundation-copy.json`

## Purpose

Surfaces, overlays and spatial hierarchy

Define spatial hierarchy through surfaces, elevation, overlays, z-index, blur, and focus layering so users understand what is persistent, contextual, temporary, or blocking.

Depth defines the spatial metaphor of the interface: how surfaces stack, how elevation communicates hierarchy, and how overlays create focus.

Depth governs shadows, z-index, surface tinting, backdrop treatment, and temporary layers.

The model keeps maps, sheets, drawers, menus, dashboard cards, and critical messages from competing for the same plane.

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

Token dependencies: `ref.depth.*`, `sys.depth.*`, `sys.frame.*`, `comp.*.depth aliases`

Primitive dependencies: `Elevation`, `Focus`, `Breakpoints`

Component dependencies: `Dialog`, `Menu`, `Popover`, `Toast`, `Card Summary`, `Table`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| canvas | sys.depth.elevation.0 | Base app surface and dashboard canvas. |
| raised | sys.depth.elevation.1 | Cards, KPI tiles, station preview panels, table containers. |
| floating | sys.depth.elevation.2 | Menus, popovers, quick action clusters, map controls. |
| overlay | sys.depth.overlay | Sheets, modals, blocking review flows, permission gates. |
| dialog | sys.depth.z.dialog | Risk, destructive action, financial or role-change confirmations. |
| toast | sys.depth.z.toast | Transient confirmations and recovery messages. |

## Product Examples

- Mobile station detail: Bottom sheet sits above map controls but below blocking permission dialogs.
- Dashboard drill-down: Drawer elevation separates contextual detail from persistent dashboard filters.
- Configuration: Role-change dialog blocks background actions and restores focus on close.
- Navigation: Topbar remains sticky without competing visually with active work surfaces.

## Token Dependencies

- ref.depth.*
- sys.depth.*
- sys.frame.*
- comp.*.depth aliases

## Primitive Dependencies

- Elevation
- Focus
- Breakpoints

## Component Dependencies

- Dialog
- Menu
- Popover
- Toast
- Card Summary
- Table

## Agent Instructions

- Choose depth by interaction priority, not by decoration.
- Preserve focus order and escape behavior for every overlay.
- Do not use arbitrary z-index values.
- Use backdrop only when the background task must be paused.

## Reject If

- Overlay lacks escape or focus restoration.
- z-index is hardcoded outside Depth tokens.
- A container is added only for decoration and reduces useful workspace.
- Background content remains interactive behind blocking dialogs.

## Reference Notes

### Elevation Model

Design System uses numeric levels with semantic aliases for product surfaces.

```text
ELEVATION SCALE
Level 0 -> Canvas: no shadow
Level 1 -> Raised: cards, list items
Level 2 -> Floating: menus, popovers
Level 3 -> Overlay: sheets, dialogs, focused panels
Level 4 -> Critical: toast, high-priority interruption

SHADOW COLOR
Light: branded navy shadow
Dark: black shadow with boosted opacity

Z-INDEX RANGES
0      base content
100    dropdowns and popovers
200    sticky headers and toolbars
1000   overlays and modal backdrops
1100   toasts and critical notices
```
