# Iconography

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/iconography.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Turn the Iconography foundation and Material Symbols library into implementation-ready icon names, sizes, colors, labels, and fallback behavior.

Iconography sits between foundations and components.
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

Governing foundations: `Iconography`, `Symbol`, `Accessibility`, `Energy`

Foundation inputs: `sys.iconography.*`, `sys.symbol.*`, `sys.accessibility.*`, `sys.energy.*`

Coordinates primitives: `None declared`

Token dependencies: `ref.symbol.*`, `sys.symbol.*`, `icon.*`, `Material Symbols Rounded`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| action | icon.action | Action buttons, quick actions, toolbars. |
| navigation | icon.navigation | Topbar, drawers, breadcrumbs, tabs. |
| status | icon.status | Success, warning, error, pending. |
| object | icon.object | Vehicle, card, route, station, driver. |
| decorative | icon.decorative | Hidden support glyphs with aria-hidden. |

## Product Examples

- Quick action grid: Icon supports a visible label and permission state.
- Map station pin: Station glyph pairs with text in fallback list.
- Icon button: Icon-only control exposes accessible name and target size.

## API

Props: `name`, `role`, `size`, `tone`, `fill`, `label`, `decorative`

Outputs: `materialSymbolName`, `ariaPolicy`, `fillPolicy`, `cssCustomProperties`

## States

- default
- active
- filled
- disabled
- status
- missing

## Responsibilities

- Renders Material Symbols through the Symbol foundation.
- Enforces semantic icon names and accessible-name rules.
- Keeps icon size and color tokenized.
- Shows missing icon states during development.

## Token Dependencies

- ref.symbol.*
- sys.symbol.*
- icon.*
- Material Symbols Rounded

## Agent Instructions

- Use Material Symbols via semantic helper.
- Use fill only for selected, active, success, or high-confidence status roles.
- Do not use emoji as icons.
- Name icon-only actions.
- Hide decorative icons from assistive tech.

## Reject If

- Emoji or text label stands in for icon.
- Icon-only action lacks label.
- Icon color is hardcoded.
- Filled icon state is used as decoration without semantic state.
- Missing icon renders as giant text.

## Prevents

Emoji fallbacks, arbitrary glyphs, inline SVGs without semantic role, and unlabeled icon-only actions.

## Demo Evidence

Type: `icon`

Initial: `md`

Choices:

- sm: sm
- md: md
- lg: lg
