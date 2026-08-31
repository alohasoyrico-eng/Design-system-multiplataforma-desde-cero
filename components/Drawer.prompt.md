Panel lateral sobre scrim; entra por resorte. Para detalle de registros y formularios secundarios (más contexto que un Dialog).

```jsx
<Drawer open={open} onClose={close} title="Ana Sosa"
  footer={<><Button variant="ghost" onClick={close}>Cerrar</Button><Button variant="primary">Guardar</Button></>}>
  …contenido…
</Drawer>
```
