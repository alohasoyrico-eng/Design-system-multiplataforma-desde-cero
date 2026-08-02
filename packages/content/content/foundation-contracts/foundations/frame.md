# Frame

Generated portable foundation contract for Design System.

The JSON spec and foundation copy remain the editable source of truth. Regenerate this file with `npm run build:foundation-contracts` after changing foundation copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/foundations/frame.json`
- `packages/content/content/foundation-copy.json`

## Purpose

Layout, density and rhythm

Govern spacing, grid, density, sizing, and responsive rhythm so product surfaces feel organized and never rely on one-off layout fixes.

Frame governs all spatial relationships: spacing, sizing, grid, breakpoints, density modes, and page rhythm.

Every gap, padding, margin, panel, and grouping decision derives from a shared scale.

Density is declared at the layout or page level. Components inherit density; they do not invent one-off spacing.

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

Token dependencies: `ref.frame.*`, `sys.frame.*`, `sys.depth.*`, `comp.*.frame aliases`

Primitive dependencies: `Spacing`, `Radius`, `Breakpoints`, `Density`, `Focus`

Component dependencies: `Button`, `Select`, `Card Summary`, `Table`, `Checkbox`, `Switch`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| space | ref.frame.space.* | Inline gaps, component gaps, section rhythm, page rhythm. |
| grid | sys.frame.grid.* | Mobile, tablet, laptop, desktop content structure. |
| density | sys.frame.density.* | Compact operations, default product rhythm, comfortable review/touch flows. |
| radius | sys.frame.radius.* | Controls, cards, sheets, pills, panels. |
| size | sys.frame.height.* | Control heights, touch targets, dashboard modules, panels. |
| border | sys.frame.border.* | Controls, tables, selected surfaces, dividers. |

## Product Examples

- Mobile card overview: Card stack, quick actions, and movement rows use mobile margins and comfortable touch rhythm.
- Routes and stations: Map overlays and station detail panels use stable inset, sheet, and fallback list spacing.
- Fleet dashboards: 12-column desktop grid aligns KPI tiles, charts, filter bar, and drill-down table.
- Settings: Roles, permissions, drivers, and vehicles use dense table rhythm without losing focus target and hierarchy.

## Token Dependencies

- ref.frame.*
- sys.frame.*
- sys.depth.*
- comp.*.frame aliases

## Primitive Dependencies

- Spacing
- Radius
- Breakpoints
- Density
- Focus

## Component Dependencies

- Button
- Select
- Card Summary
- Table
- Checkbox
- Switch

## Agent Instructions

- Use Frame tokens for spacing, sizing, grid, border, and radius before changing CSS.
- Declare density at the surface or page level; components should inherit it.
- Avoid horizontal scroll in navigation and tab bars unless the component explicitly owns overflow behavior.
- Check mobile, tablet, laptop, and desktop rhythm before calling a layout done.

## Reject If

- Raw spacing, radius, border, or control size values are introduced outside tokens.
- Content is wrapped in a container that reduces useful space without a hierarchy reason.
- Navigation or tabs create unintended horizontal scrolling.
- A component solves spacing locally instead of consuming Frame.

## Reference Notes

### Spacing Scale Design

The scale is tuned for practical use, not strict mathematics.

```text
BASE UNIT
4px

SPACE SCALE
0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 64, 80, 96, 128

GRID
mobile  -> 1 column, 16px margin
tablet  -> 6 columns, 24px gutter
desktop -> 12 columns, 24px gutter, 48px margin

DENSITY
compact      -> tighter gaps, smaller type step
default      -> standard operating rhythm
comfortable  -> larger touch and reading rhythm
```
