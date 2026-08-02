# Growth

Generated portable foundation contract for Design System.

The JSON spec and foundation copy remain the editable source of truth. Regenerate this file with `npm run build:foundation-contracts` after changing foundation copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/foundations/growth.json`
- `packages/content/content/foundation-copy.json`

## Purpose

Evolution, maturity and adoption signals

Track maturity, adoption, telemetry, deprecation, and learning signals so artifacts evolve deliberately instead of becoming undocumented leftovers.

Growth defines product learning signals and the maturity model for system evolution.

It helps teams understand adoption, migration, deprecation, and whether a pattern is ready to become a shared contract.

Growth events must be structured, non-PII, and attached to product context.

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

Token dependencies: `ref.growth.*`, `sys.growth.*`, `data-analytics-*`

Primitive dependencies: `Loading`, `Disabled`, `Charts`

Component dependencies: `Button`, `Toast`, `KPI Tile`, `Chart Panel`, `Audit Event`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| seed | sys.growth.stage.seed | New concept, early pattern, or experiment. |
| stable | sys.growth.stage.stable | Shared artifact with documented examples and adoption. |
| measured | sys.growth.stage.measured | Artifact with telemetry, quality signals, and known outcomes. |
| deprecated | sys.growth.stage.deprecated | Artifact replaced or unsafe for new work. |
| event | data-analytics-event | Behavioral audit for critical actions and adoption. |

## Product Examples

- Button: Actions expose data-growth-stage and analytics event metadata.
- Dashboard module: New KPI starts seed, becomes measured after adoption and threshold validation.
- Template: Fleet dashboard suite tracks whether patterns reduce support or improve task completion.
- Migration: Deprecated card action is visible in docs with replacement path and cutoff rule.

## Token Dependencies

- ref.growth.*
- sys.growth.*
- data-analytics-*

## Primitive Dependencies

- Loading
- Disabled
- Charts

## Component Dependencies

- Button
- Toast
- KPI Tile
- Chart Panel
- Audit Event

## Agent Instructions

- Declare maturity and measurement expectation for new shared artifacts.
- Never treat inventory as completion.
- Add deprecation guidance when replacing an artifact.
- Tie telemetry to product decision, not vanity metrics.

## Reject If

- Artifact has no maturity stage.
- Telemetry has no decision purpose.
- Deprecated behavior lacks replacement.
- Docs claim done without examples, states, and validation.

## Reference Notes

### Event Schema

Events are named and structured so teams can learn without scattering tracking code.

```text
EVENT SHAPE
event: system.component.interaction
component: Button
variant: primary
context: routes.stationDetail
action: click
properties: semantic, non-PII details

EVENT TYPES
impression
interaction
completion
abandonment
error
```
