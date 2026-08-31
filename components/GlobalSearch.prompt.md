Busqueda de entidades a traves de todo el producto. **No busca**: recibe `results` ya resueltos y orquesta agrupado, teclado, resaltado y estados. El debounce y el fetch son del contenedor.

**Dos modos, y no son intercambiables**

| mode | Cuando |
|---|---|
| `palette` | Overlay ⌘K. Internal Tools y usuarios que navegan a diario por teclado. Busca en TODO. |
| `inline` | Dropdown bajo un input en el TopBar. Cuando la busqueda es una funcion visible de la pagina. |

Si la consulta merece filtros, orden o paginado, ninguno de los dos: es una **pagina de resultados**. La busqueda instantanea resuelve «llevame ahi», no «analiza esto».

```jsx
const [open, setOpen] = React.useState(false);
const [q, setQ] = React.useState('');
const [results, setResults] = React.useState([]);
const [loading, setLoading] = React.useState(false);

React.useEffect(() => {
  if (q.length < 2) { setResults([]); return; }
  setLoading(true);
  const t = setTimeout(async () => {
    setResults(await api.search(q));
    setLoading(false);
  }, 220);
  return () => clearTimeout(t);
}, [q]);

<GlobalSearch
  mode="palette"
  open={open} onOpenChange={setOpen}
  value={q} onValueChange={setQ}
  results={results} loading={loading}
  groupOrder={['Unidades', 'Conductores', 'Viajes', 'Estaciones']}
  recents={recents}
  onClearRecents={() => setRecents([])}
  onSelect={(item) => router.push(item.href)}
/>
```

Cada resultado: `{id, label, group, icon, meta, mono, trailing}`. Usa `mono` en placas, IDs y montos; `meta` para desambiguar homonimos (dos «Juan Perez» se distinguen por flota); `trailing` para un Badge de estado.

**Reglas**
- `groupOrder` fijo, por frecuencia de uso real — no alfabetico. Un orden que baila entre consultas hace imposible la memoria muscular.
- Debounce 200-250ms y `minChars` 2 en busqueda remota. Sin eso, cada tecla es una request.
- Nunca resultado auto-seleccionado que dispare navegacion: el primero se resalta, pero solo Enter navega.
- El resaltado va en `--surface-accent-subtle`, no en rojo pleno: marca la coincidencia sin gritar.
- Vacio con causa y salida ("Sin resultados para X" + que intentar), no un encogimiento de hombros.
- `palette` captura ⌘K globalmente: monta uno solo por app.

**A11y**
- `role="combobox"` en el input, `listbox`/`option` en la lista, `aria-activedescendant` siguiendo al resaltado.
- El estado de carga es `aria-live="polite"`.
- Escape cierra; en `palette` el foco entra al input al abrir.
- Filas de 44px minimo: la palette tambien se usa con el dedo.
