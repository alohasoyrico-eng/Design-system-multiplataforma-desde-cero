Envuelve cualquier control con label, ayuda y error accesibles.

```jsx
<Field label="Placa" htmlFor="plate" required error={err}>
  <Input id="plate" value={v} onChange={setV} />
</Field>
```
