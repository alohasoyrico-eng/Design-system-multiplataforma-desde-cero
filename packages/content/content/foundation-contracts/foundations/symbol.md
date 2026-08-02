# Symbol

Generated portable foundation contract for Design System.

The JSON spec and foundation copy remain the editable source of truth. Regenerate this file with `npm run build:foundation-contracts` after changing foundation copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/foundations/symbol.json`
- `packages/content/content/foundation-copy.json`

## Purpose

Iconography, illustration and visual communication

Define visual metaphors, domain symbols, illustration rules, and semantic image language without confusing them with functional iconography.

Symbol defines a modular visual system capable of generating characters, scenarios, environments, motion-ready assets, and narrative micro-scenes governed by Design System tokens.

The system is modular: body, posture, accessory, environment, object, and scale compose scenes from finite parts.

The system is token-driven: palette, stroke, proportions, spacing, and theme variants derive from the same foundations as product UI.

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

Token dependencies: `sys.symbol.*`, `sys.energy.*`, `animated.*`

Primitive dependencies: `Iconography`, `Color`, `Motion Curves`

Component dependencies: `Animated Moment`, `Empty State`, `Biometric Prompt`, `Station Detail and Route Guidance pattern`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| action | sys.symbol.color.action | Symbolic emphasis around product action moments. |
| status | sys.symbol.color.status | Successful or resolved operational scenes. |
| warning | sys.symbol.color.warning | Cautionary scenes, not functional warnings alone. |
| danger | sys.symbol.color.danger | Blocking or destructive states with content support. |
| domain | symbol.domain.* | Vehicles, cards, stations, routes, fleets, permissions. |
| illustration | animated.* / symbol.* | Onboarding, empty, success, and teaching moments. |

## Product Examples

- Driver onboarding: Illustration teaches card use but required steps remain in text and controls.
- Routes: Station and route metaphors support map comprehension without replacing labels.
- Empty states: Symbol explains context while call to action carries task.
- Permission states: Permission metaphor supports repair copy and fallback path.

## Token Dependencies

- sys.symbol.*
- sys.energy.*
- animated.*

## Primitive Dependencies

- Iconography
- Color
- Motion Curves

## Component Dependencies

- Animated Moment
- Empty State
- Biometric Prompt
- Station Detail and Route Guidance pattern

## Agent Instructions

- Use symbols for teaching and context, not required task instructions.
- Do not replace functional icons or labels with illustration.
- Every symbol must map to product domain and tone.
- Provide fallback when animation or imagery is unavailable.

## Reject If

- Symbol carries required information alone.
- Illustration is generic stock-like decoration.
- Symbol conflicts with functional icon semantics.
- No fallback exists for animation/image failure.

## Reference Notes

### Philosophical DNA

Structural inspiration, not stylistic imitation.

### Modular Architecture

Compose infinite scenes from finite primitives.

```text
CHARACTER PRIMITIVES
Body, posture, accessory, scale

ENVIRONMENT PRIMITIVES
Ground plane, architecture, context objects, atmosphere

COMPOSITION RULES
Background layer -> light planes and atmosphere
Mid-ground layer -> architecture and context objects
Foreground layer -> character and accessory
Ground plane -> baseline and optional steps

RULE
Environment provides context without competing for attention.
```
