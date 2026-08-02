# Iconography

Generated portable foundation contract for Design System.

The JSON spec and foundation copy remain the editable source of truth. Regenerate this file with `npm run build:foundation-contracts` after changing foundation copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/foundations/iconography.json`
- `packages/content/content/foundation-copy.json`

## Purpose

Functional glyphs, grid rules and accessible icon usage

Govern functional glyphs through Material Symbols, semantic roles, size, color, accessible names, and fallback behavior.

Iconography defines the icon system: grid, stroke, optical adjustments, semantic categories, naming, color, and the consumption API.

Icons are functional glyphs, not artwork. They aid recognition, navigation, action identification, and state comprehension.

Design System uses Material Symbols as raw material, but Design System owns the semantic mapping and accessibility policy.

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

Reference translation: `Adopt + adapt`

Token dependencies: `ref.symbol.*`, `sys.symbol.*`, `material-symbols-rounded`

Primitive dependencies: `Iconography`, `Focus`, `Color`, `Disabled`

Component dependencies: `Icon Button`, `Button`, `Menu`, `Tooltip`, `Station Pin`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| action | sys.symbol.color.action | Buttons, quick actions, menus, toolbar commands. |
| navigation | icon.category.navigation | Topbar, breadcrumbs, tabs, drawers, route movement. |
| status | sys.symbol.color.status | Success, warning, error, pending, disabled state glyphs. |
| object | icon.category.object | Vehicle, card, driver, station, route, payment. |
| size | sys.symbol.size.* | 12, 16, 20, 24, 32px governed glyph sizes. |
| accessibility | aria-label / aria-hidden | Meaningful icons are named; decorative icons are hidden. |

## Product Examples

- Quick actions: Material Symbols identify actions, but labels remain visible.
- Icon button: Icon-only controls require aria-label and touch target.
- Dashboard: Status icons pair with text and color-safe encoding.
- Map: Station and route icons never replace fallback list labels.

## Token Dependencies

- ref.symbol.*
- sys.symbol.*
- material-symbols-rounded

## Primitive Dependencies

- Iconography
- Focus
- Color
- Disabled

## Component Dependencies

- Icon Button
- Button
- Menu
- Tooltip
- Station Pin

## Agent Instructions

- Use Material Symbols names through the icon helper.
- Never render huge text labels as icon replacements.
- Icon-only actions need accessible names.
- Decorative icons must be aria-hidden.

## Reject If

- Emoji is used as iconography.
- Icon-only action lacks accessible name.
- Material Symbols text appears unstyled as large labels.
- Icon color is hardcoded outside semantic tokens.

## Reference Notes

### Icon Grid & Rules

The reference model treats icons as constrained functional glyphs.

```text
GRID
Base: 24 x 24px
Live area: 20 x 20px
Stroke: 1.5px
Corner radius: 1px terminals, 2px enclosed shapes

SIZING
xs 12px
sm 16px
md 20px
lg 24px
xl 32px

SEMANTIC CATEGORIES
Navigation, Action, Status, Object, Toggle, Finance, Currency, Chart

EVERY ICON MUST
have one meaning
have category assignment
have accessible labeling rules
```
