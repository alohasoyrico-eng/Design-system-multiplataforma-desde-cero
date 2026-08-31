Menú contextual anclado a un trigger (típicamente `IconButton icon="more_vert"`). `danger` para acciones destructivas al final, tras un 'divider'.

```jsx
<Menu align="right" trigger={<IconButton icon="more_vert" ariaLabel="Más acciones" />}
  items={[
    {label:'Editar', icon:'edit', onClick:edit},
    {label:'Duplicar', icon:'content_copy'},
    'divider',
    {label:'Eliminar', icon:'delete', danger:true, onClick:del},
  ]} />
```
