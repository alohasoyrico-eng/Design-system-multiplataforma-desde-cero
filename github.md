repo: alohasoyrico-eng/Design-system-multiplataforma-desde-cero
branch: main

Repo destino de la implementación. **Su contenido actual queda descartado**: por decisión del usuario (2026-08-17) se construye de cero desde este proyecto, que es la referencia canónica y el único origen. Lo que hay hoy en `main` —un monorepo npm con las cinco capas en TypeScript— no se reconcilia ni se toma como entrada.

Se conserva abajo el inventario de lo que había, solo como registro de la decisión.

## Last sync
date: 2026-08-17T18:09:00Z
commit: (no registrado — solo se resolvió el hash de árbol 18fda575c0f1, no el del commit)

### Updated in this project
- Inventario de `SKILL.md` completado con los 12 componentes de la raíz de `components/` que faltaban.
- `readme.md`: eliminadas las dos menciones a «Asphalt» como tema; ahora es modo oscuro.
- Creado este `github.md` con el mapa de pantallas y las divergencias detectadas.

## Qué había en el repo al descartarlo (registro, no plan de trabajo)
- **Temas**: el repo mantiene tres temas por `data-theme` (`canvas`, `asphalt`, `brutal`) y tres densidades por `data-density`. La referencia se consolidó a un tema con modo oscuro por `data-mode`. El repo está atrasado: `packages/tokens/tokens/sys.brutal.json` y `sys.asphalt.json` siguen existiendo.
- **Contratos**: el repo tiene 1 (`packages/components/contracts/Button.contract.d.ts`); la referencia tiene 15 en `contracts/`.
- **Ficheros que CI necesita y no están en el repo**: `packages/tokens/build.mjs`, `scripts/audit-hardcoded.mjs`, `apps/docs/`. Los tres se invocan desde `package.json` y `.github/workflows/ci.yml`.
- **No hay `CLAUDE.md`** en la raíz del repo. Debe recibir el contenido de `platforms/CLAUDE.target.md`.
- La revisión de capas de la referencia (`platforms/check-layers.mjs`) no tiene equivalente en el repo; allí el gate es Stylelint + `audit-hardcoded.mjs`, que cubren hardcode, no dirección de dependencias.

## Screen map

Mapa de la construcción a hacer: cada pantalla del repo nuevo y el kit de esta referencia del que sale.
| Pantalla en el repo | Construida desde |
|---|---|
| `packages/templates/src/FleetDashboard.tsx` | `ui_kits/fleet-dashboard/` |
| `packages/templates/src/DashboardOverview.tsx` | `ui_kits/dashboards/overview.html` |
| `packages/templates/src/InternalTools.tsx` | `ui_kits/internal-tools/` |
| `packages/templates/src/DriversApp.tsx` | `ui_kits/drivers-app/` |
| `packages/templates/src/AuthScreen.tsx` | `ui_kits/auth/` |
| `packages/templates/src/AuthOTPScreen.tsx` | `ui_kits/auth/` (OTP) |
| `packages/templates/src/OnboardingScreen.tsx` | `ui_kits/onboarding/` |
| `packages/templates/src/WalletScreen.tsx` | `ui_kits/wallet/` |
| `packages/templates/src/RoutesScreen.tsx` | `ui_kits/rutas/` |
| `packages/templates/src/SettingsScreen.tsx` | `ui_kits/settings/` |
| `packages/templates/src/WizardScreen.tsx` | `ui_kits/wizard/` |
| `packages/templates/src/AgentChat.tsx` | componentes de chat (`ChatThread`, `ChatMessage`, `ChatComposer`) |
| `packages/templates/src/ConfigScreen.tsx` | `ui_kits/settings/` (configuración) |
| `packages/mailings/` | `ui_kits/mailings/` |
