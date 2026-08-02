# Codex Agent Instructions for Unison

Use Unison as a fleet and driver product decision system, not a component gallery.

## Source Of Truth

Use `packages/specs/specs/unison.system.json` as the machine-readable contract. Markdown files are explanatory support only; they are not the source of truth unless their rules also exist in the spec, auditor, or rendered app contract.

Before changing an artifact, confirm that app inventory, system spec, and rendered documentation agree. If they disagree, update the machine-readable spec or app contract first.

## Reference Rule

The reference project is a benchmark, not a paste source. Classify each reference decision before using it:

- Adopt when it fits this product and current architecture.
- Adapt when the structure is useful but content, naming, tokens, interaction, or examples must change.
- Reject when it imports generic assumptions, foreign naming, or weak product behavior.

## Visual Benchmark Rule

The external Canvas-style ZIP can guide visual quality, interaction richness, component coverage, and mobility examples. It must not replace Design System foundations or primitives.

When adapting anything from that ZIP:

1. Preserve Design System foundations and primitives.
2. Translate color through Energy, typography through Voice, scale through Density, layout through Frame, motion through Momentum, surfaces through Depth, icons through Symbol/Iconography, charts through Charts, and maps through Maps.
3. Rewrite component APIs into Design System contracts; do not expose public size when Density owns scale.
4. Convert components into patterns before using them in templates.
5. Reject raw tokens, inline styles, direct chart implementations, direct map tile assumptions, and demo-only runtime choices as final architecture.

## Before Building

1. Identify the layer: Foundation, Primitive, Component, Pattern, Template, or Product.
2. Trace the request through the full architecture before implementation.
3. Identify the platform: mobile, desktop, cross-platform, maps, dashboards, or configuration.
4. Select the governing foundations.
5. Use Edenred for display/titles and Ubuntu for body, captions, subtitles, labels, tables, and code.
6. Use Material Symbols only through semantic icon roles.
7. Use the Motion library for UI microinteractions, governed by the Momentum foundation.
8. Use dotLottie only for illustrative moments.
9. Use ECharts for dashboard visualizations.
10. Include success, loading, empty, error, disabled, permission, offline, and recovery behavior.
11. Emit or preserve an agent-readable contract: layer, platform, audiences, governing foundations, primitive dependencies, states, accessibility, responsive behavior, token dependencies, and rejection criteria.

## Reject Work When

- A page or component skips layers.
- A dashboard chart lacks a text summary or accessible alternative.
- A map system lacks permission-denied and fallback-list behavior.
- A Lottie animation is required to understand or complete a task.
- A Material Symbol is used without accessible-name policy.
- Raw token values become public API.
- Machine-readable spec and rendered documentation drift apart.
- Authentication, OTP, biometric, role, driver, vehicle, card, or finance flows lack recovery paths.

## Domain Priorities

- Driver mobile onboarding.
- Mobile card overview, recent movements, card detail, quick actions, and movement detail.
- Routes, nearby stations, station detail, and route guidance.
- Fleet manager desktop dashboards: overview, combustible, mantenimiento, electromovilidad, peaje, flotilla, and finanzas.
- Configuration: roles, permissions, alta/baja de conductores, alta/baja de vehiculos.
- Authentication, login, biometrics, and OTP across mobile and desktop.
