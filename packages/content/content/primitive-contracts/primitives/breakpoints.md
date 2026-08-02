# Breakpoints

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/breakpoints.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Turn Frame responsive roles into implementation-ready content-driven breakpoints for mobile, tablet, laptop, and desktop.

Breakpoints sits between foundations and components.
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

Governing foundations: `Frame`, `Accessibility`

Foundation inputs: `sys.frame.*`, `sys.accessibility.*`

Coordinates primitives: `None declared`

Token dependencies: `ref.frame.breakpoint.*`, `sys.frame.grid.*`, `breakpoint.*`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| mobile | breakpoint.mobile | Driver app, sheets, stacked actions. |
| tablet | breakpoint.tablet | Inspector layouts and split review. |
| laptop | breakpoint.laptop | Fleet manager default workstation. |
| desktop | breakpoint.desktop | Wide dashboards and dense tables. |

## Product Examples

- Navigation: Hamburger appears only where top navigation lacks room.
- Dashboard: KPI grid adapts from stacked to multi-column.
- Templates: Mobile route system and desktop fleet dashboard use different IA.

## API

Props: `breakpoint`, `columns`, `density`, `navigationMode`

Outputs: `mediaQuery`, `layoutMode`, `navigationPolicy`

## States

- mobile
- tablet
- laptop
- desktop

## Responsibilities

- Render Breakpoints through semantic foundation roles.
- Expose a small API that maps to foundations and token aliases.
- Work across density, responsive, keyboard, touch, screen reader, contrast, and reduced-motion requirements when relevant.
- Prevent raw visual values or duplicated implementation decisions.

## Token Dependencies

- ref.frame.breakpoint.*
- sys.frame.grid.*
- breakpoint.*

## Agent Instructions

- Use content needs before device names.
- Check navigation and tab behavior at each tier.
- Do not compress desktop pages into mobile cards.

## Reject If

- Unintended horizontal scroll.
- Hamburger appears on wide layouts unnecessarily.
- Same template reused across incompatible contexts.

## Prevents

Hardcoded breakpoints values and one-off implementation behavior.

## Demo Evidence

Type: `breakpoint`

Initial: `mobile`

Choices:

- mobile: mobile
- tablet: tablet
- laptop: laptop
- desktop: desktop
