Separador de contenido. Sin `label`: línea de 1px. Con `label`: línea partida ("O", "12 mar", "Hoy"). `orientation="vertical"` para toolbars e inline groups — requiere contenedor con `alignItems:'stretch'`.

```jsx
<Divider />
<Divider label="O" />
<Divider orientation="vertical" />
```

Para separar items dentro de un `Menu` ya existe el string `'divider'`; usa este componente para separar bloques de página o listas.
