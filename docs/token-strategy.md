# Token Strategy

Tokens in Unison are semantic public contracts. Raw implementation values are private compiler output.

## Typography

- `font.display`: Edenred
- `font.title`: Edenred
- `font.body`: Ubuntu
- `font.subtitle`: Ubuntu
- `font.caption`: Ubuntu
- `font.code`: Ubuntu or Ubuntu Mono

Titles should never silently fall back to a generic SaaS look in production. Edenred font files should be self-hosted when the product is integrated into a real repository.

## Library Tokens

- `motion.*`: Motion presets for tabs, sheets, drawers, quick actions, loading, route transitions, and page transitions.
- `animated.*`: dotanimation assets for onboarding, success, empty, OTP, biometric, and route teaching moments.
- `symbol.*`: Material Symbols mapped to semantic action, navigation, status, vehicle, fuel, route, station, payment, and permission roles.
- `chart.*`: ECharts visual roles for KPI, line, bar, stacked, threshold, anomaly, table-linked, and drilldown states.
- `map.*`: station pins, clusters, route lines, user location, permission states, fallback list, and route alternatives.

## Domain Token Families

- `fuel.*`
- `maintenance.*`
- `electromobility.*`
- `toll.*`
- `fleet.*`
- `finance.*`
- `driver.*`
- `vehicle.*`
- `card.*`
- `movement.*`
- `station.*`
- `route.*`
- `permission.*`

## Rules

- Public names describe meaning, not values.
- A token belongs to one primitive family and references governing foundations.
- Components may depend on tokens but may not redefine them.
- Patterns may require token behavior but may not introduce raw values.
- Templates must prove token behavior across success, loading, empty, error, disabled, permission, offline, and recovery states.
- Charts must include accessible summaries and color-safe encodings.
- Maps must include permission-denied states and non-map fallback lists.
- animation assets must never carry unique required information.
