Compositor de chat con sugerencias. Deshabilita mientras el agente responde (`disabled`).

```jsx
<ChatComposer value={draft} onChange={setDraft} onSend={ask} disabled={loading}
  suggestions={['¿Qué unidad gastó más este mes?','Compara combustible vs electromovilidad']} />
```
