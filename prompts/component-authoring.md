# Component and Pattern Authoring Prompt

You are authoring a Unison Design OS artifact for a fleet and driver product ecosystem. Do not produce a demo-only artifact. Produce a production-ready design, engineering, accessibility, content, research, service, and agent specification.

Use `packages/specs/specs/unison.system.json` as the machine-readable source of truth. Markdown planning docs can inform priorities, but they must not introduce rules that are absent from the system spec or rendered artifact contract.

When using the reference project, classify each borrowed decision as Adopt, Adapt, or Reject before applying it.

When using the external Canvas-style ZIP, treat it as a visual and product-behavior benchmark only. Keep Design System foundations and primitives as the source of truth. Translate the ZIP's quality through Design System roles before writing any component, pattern, or template:

- Color -> Energy.
- Typography -> Voice.
- Layout, spacing, radius, density, and breakpoints -> Frame and Density.
- Elevation and layering -> Depth.
- Motion and reduced motion -> Momentum.
- States -> State.
- Icons -> Symbol and Iconography.
- Charts -> Charts primitive and ECharts strategy.
- Maps -> Maps primitive and production map strategy.

## Context

The product domain includes:

- Driver mobile onboarding.
- Authentication, login, biometrics, and OTP.
- Mobile card overview, recent movements, card detail, quick actions, and movement detail.
- Routes, nearby stations, station detail, and route guidance.
- Fleet manager desktop dashboards: overview, combustible, mantenimiento, electromovilidad, peaje, flotilla, and finanzas.
- Configuration: roles, permissions, alta/baja de conductores, alta/baja de vehiculos.

## Stack Rules

- Use Edenred for display and titles.
- Use Ubuntu for body, captions, subtitles, labels, tables, and code.
- Use the Motion library for UI microinteractions, governed by the Momentum foundation.
- Use dotLottie for illustrative states only.
- Use Material Symbols through semantic icon roles.
- Use Apache ECharts for dashboards.
- Use MapLibre GL or Mapbox for map flows.

## Required Output

1. Purpose: why the artifact exists and what uncertainty it reduces.
2. Layer Trace: governing foundations and primitive dependencies.
3. Audience Tabs: product design, engineering, PM, content, research, service design, and agent spec.
4. When To Use: user and product conditions.
5. When Not To Use: alternatives and anti-patterns.
6. Anatomy or Journey: required and optional parts.
7. Variants or Design System Branches: semantic variants only.
8. States: default, hover, active, focus, selected, loading, empty, invalid, disabled, read-only, permission-blocked, offline, optimistic, and error.
9. Accessibility: name, role, state, focus order, keyboard map, contrast, reduced motion, touch target, screen reader behavior, localization, and recovery.
10. Momentum/Motion: governing foundation, Motion preset, semantic verb, duration role, easing role, reduced-motion equivalent.
11. Illustration: dotLottie usage if relevant, with fallback and non-required information rule.
12. Iconography: Material Symbols names, semantic roles, labels, and decorative/meaningful status.
13. Charts: ECharts option model, summaries, legends, tooltips, empty states, and accessibility if relevant.
14. Maps: permission, geolocation, fallback list, route, station pin, station detail, and error behavior if relevant.
15. Content Guidance: labels, helper text, errors, confirmation, microcopy, and localization risk.
16. Engineering Notes: state model, events, slots, composition, performance, and framework adapters.
17. Research Notes: assumptions, usability risks, questions, and success criteria.
18. Service Notes: ownership, support paths, backstage process, escalation, and audit implications.
19. Agent Instructions: build steps, validation rules, and rejection criteria.
20. Testing Checklist: unit, interaction, visual, accessibility, localization, performance, data, permission, and migration tests.
21. Token Dependencies: semantic tokens by primitive family.
22. Machine Contract: JSON-like fields for layer, platform, audiences, governingFoundations, primitiveDependencies, states, accessibility, responsiveBehavior, tokenDependencies, events, tests, and rejectIf.

## Rejection Criteria

Reject the output if it exposes raw token values, skips a layer, drifts from `packages/specs/specs/unison.system.json`, lacks keyboard behavior, lacks reduced-motion behavior, treats Lottie as required comprehension, uses icons without accessible policy, creates charts without text summaries, creates maps without fallback states, copies reference decisions without classification, or treats accessibility as a final checklist.
