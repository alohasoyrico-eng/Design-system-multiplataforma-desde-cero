# Research

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/research.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Turn research practice into implementation-ready primitives for questions, hypotheses, audience context, evidence, confidence, risk, decision links, and learning signals.

Research sits between foundations and components.
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

Audiences: `Researchers`, `Product Designers`, `PMs`, `Content Designers`, `Service Designers`, `Developers`

Required sections: `purpose`, `foundationInputs`, `roles`, `productExamples`, `api`, `states`, `agentInstructions`, `rejectIf`, `evidence`

Governing foundations: `Growth`, `Tone`, `Accessibility`, `Voice`

Foundation inputs: `sys.growth.*`, `sys.tone.*`, `sys.accessibility.*`, `sys.voice.*`

Coordinates primitives: `None declared`

Token dependencies: `sys.growth.*`, `research.*`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| question | research.question | What the team needs to learn before or after shipping. |
| hypothesis | research.hypothesis | Expected behavior or outcome to validate. |
| context | research.context.* | Audience, device, environment, task pressure, and operational risk. |
| evidence | research.evidence.* | Interview, usability test, telemetry, support, shadowing, survey, or field data. |
| confidence | research.confidence.* | Low, medium, high confidence with stated risk. |

## Product Examples

- Block card: Tests whether fleet managers understand consequence and recovery before confirming.
- Nearby stations: Validates whether drivers can recover when geolocation is denied.
- Dashboard overview: Connects KPI hierarchy to investigation speed and support escalation reduction.

## API

Props: `question`, `hypothesis`, `audience`, `context`, `evidenceType`, `confidence`, `risk`, `decisionLink`, `learningSignal`, `followUp`

Outputs: `researchBrief`, `decisionEvidence`, `learningSignal`, `riskNote`, `followUpPlan`

## States

- assumption
- questioned
- tested
- validated
- invalidated
- needs-follow-up

## Responsibilities

- Render Research through semantic foundation roles.
- Expose a small API that maps to foundations and token aliases.
- Work across density, responsive, keyboard, touch, screen reader, contrast, and reduced-motion requirements when relevant.
- Prevent raw visual values or duplicated implementation decisions.

## Token Dependencies

- sys.growth.*
- research.*

## Agent Instructions

- Attach research question and confidence to important design decisions.
- Connect evidence to components, patterns, or templates instead of storing findings in isolation.
- Use measurement signals to decide follow-up after ship.

## Reject If

- Decision claims research support without evidence type.
- Finding is not linked to a product decision.
- Confidence is missing for high-risk flows.
- Research output cannot be read by designers, PMs, developers, and agents.

## Prevents

Hardcoded research values and one-off implementation behavior.

## Demo Evidence

Type: `statGrid`
