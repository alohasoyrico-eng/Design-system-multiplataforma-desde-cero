Burbuja de chat. `children` para respuestas ricas (StatTile, Table) dentro de la burbuja del agente. `tool` muestra un chip de "usando herramienta" arriba.

```jsx
<ChatMessage role="agent" tool={{label:'Consultando flota',icon:'search',status:'done'}} text="Encontré 3 unidades con consumo alto:">
  <Table ... />
</ChatMessage>
```
