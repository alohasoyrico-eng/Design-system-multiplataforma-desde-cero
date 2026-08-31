Mapa OSM con pins de precio (el seleccionado crece y se pinta accent) y ruta punteada.

```jsx
<MapCanvas center={{lat:19.4326,lng:-99.1332}} zoom={14} height={420}
  pins={stations} selectedId={sel} onPinClick={(p)=>setSel(p.id)} route={route} />
```

Ofrece siempre un toggle mapa/lista por accesibilidad.
