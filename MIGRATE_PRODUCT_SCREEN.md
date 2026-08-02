# Migrate A Product Screen Into Design System

Use this when turning an existing product screen into Design System artifacts.

## 1. Name The Product Job

Write the user goal in product language:

- Who is acting?
- What are they deciding?
- What data, permissions, and risk states matter?
- What recovery path exists when the task fails?

## 2. Map The Layer

| Question | Design System layer |
| --- | --- |
| Is this a rule about meaning, access, motion, voice, or state? | Foundation |
| Is this reusable raw material like color, density, charts, maps, or loading? | Primitive |
| Is this a reusable UI part with behavior and states? | Component |
| Is this a task sequence using multiple components? | Pattern |
| Is this a complete domain surface? | Template |

Nothing skips a layer.

## 3. Update The Source Of Truth

- System rules go in `packages/specs/specs/unison.system.json`.
- Artifact inventory goes in `packages/content/content/catalog.json`.
- Copy, examples, and fixtures go in `packages/content`.
- Reusable prototype UI goes in `packages/components`.
- Reusable prototype tokens go in `packages/tokens`.
- Docs rendering goes in `apps/docs` only after the package-owned truth exists.

## 4. Prototype The Screen

Use `examples/prototyping` when the screen needs a runnable proof.

Use shared data from:

```txt
packages/content/content/fixtures/prototyping.json
```

Use reusable UI from:

```txt
packages/components
```

## 5. Validate

Run:

```sh
npm run validate
```

Reject the migration if it places source-of-truth files in `apps/docs`, bypasses package contracts, or cannot pass the Architecture Gate.
