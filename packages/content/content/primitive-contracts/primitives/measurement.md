# Measurement

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/measurement.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Turn Growth foundation roles into implementation-ready measurement primitives for telemetry, analytics views, success metrics, friction, recovery, quality signals, and ethical guardrails.

Measurement sits between foundations and components.
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

Audiences: `PMs`, `Product Designers`, `Developers`, `Researchers`, `Service Designers`

Required sections: `purpose`, `foundationInputs`, `roles`, `productExamples`, `api`, `states`, `agentInstructions`, `rejectIf`, `ethics`

Governing foundations: `Growth`, `State`, `Accessibility`, `Tone`

Foundation inputs: `sys.growth.*`, `sys.state.*`, `sys.accessibility.*`, `sys.tone.*`

Coordinates primitives: `None declared`

Token dependencies: `sys.growth.*`, `measurement.*`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| event | measurement.event.* | Actor, trigger, surface, object, result, and timestamp contract. |
| metric | measurement.metric.* | Success, friction, recovery, quality, and support-avoidance signals. |
| analytics | measurement.analytics.* | Funnels, cohorts, trends, dashboards, and segment views derived from events. |
| hypothesis | measurement.hypothesis.* | Learning claim the metric confirms or rejects. |
| guardrail | measurement.guardrail.* | Ethics and anti-vanity constraints. |

## Product Examples

- Button danger action: button.block-card.clicked records actor, object, result, confirmation path, cancellation, and recovery.
- Fleet dashboard: Analytics view shows exception resolution, not only chart impressions.
- Driver onboarding: Success metric combines activation, permission recovery, and support contact reduction.

## API

Props: `eventName`, `actor`, `surface`, `object`, `trigger`, `result`, `metric`, `hypothesis`, `analyticsView`, `guardrail`

Outputs: `eventContract`, `metricDefinition`, `analyticsView`, `researchSignal`, `privacyGuardrail`

## States

- planned
- instrumented
- validated
- stale
- deprecated
- blocked

## Responsibilities

- Render Measurement through semantic foundation roles.
- Expose a small API that maps to foundations and token aliases.
- Work across density, responsive, keyboard, touch, screen reader, contrast, and reduced-motion requirements when relevant.
- Prevent raw visual values or duplicated implementation decisions.

## Token Dependencies

- sys.growth.*
- measurement.*

## Agent Instructions

- Define the product question before naming an event.
- Treat analytics as interpretation of measurement, not a separate visual layer.
- Reject vanity metrics as primary success criteria.

## Reject If

- Event name exists without actor, object, trigger, and result.
- Click count is treated as success without product outcome.
- Analytics dashboard has no decision or action owner.
- Measurement encourages dark patterns or manipulative growth.

## Prevents

Hardcoded measurement values and one-off implementation behavior.

## Demo Evidence

Type: `statGrid`
