Modal radio 28 sobre scrim con blur; entra por resorte. Esc y click fuera cierran.

```jsx
<Dialog open={open} onClose={close} tone="danger" title="¿Eliminar unidad?"
  description="JMX-214-B se desvinculará de su conductor. Esta acción no se puede deshacer."
  actions={<><Button variant="ghost" onClick={close}>Cancelar</Button><Button variant="danger">Eliminar</Button></>} />
```
