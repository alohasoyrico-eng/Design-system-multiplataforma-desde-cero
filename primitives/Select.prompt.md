Selección de una lista conocida. Una sola API para lista cerrada, búsqueda, selección múltiple y valores nuevos.

Compone `ControlShell` + `Popover` + `Listbox`: no redibuja borde, panel ni teclado. Contrato en `contracts/select.json`.

```jsx
<Select icon="local_taxi" placeholder="Tipo de unidad" value={v} onChange={setV}
  options={[{value:'sedan',label:'Sedán'},{value:'van',label:'Van'},{value:'moto',label:'Moto'}]} />

<Select searchable options={ciudades} value={c} onChange={setC} />
<Select multiple searchable options={categorias} value={arr} onChange={setArr} />
<Select creatable options={placas} value={p} onChange={setP} />
<Select searchable options={paises} value={p} onChange={setP}
  renderOption={(o) => <><Flag country={o.value} size={20} />{o.label}<span>{o.hint}</span></>} />
```

## Absorbió cuatro componentes

| Antes | Ahora |
|---|---|
| `SelectMultiple` | `multiple` |
| `SelectCombo` | `searchable` + `creatable` |
| `SelectWithInput` | `searchable` |
| `SelectCountry` | `renderOption` + lista de países del producto |

La lista de países dejó de vivir en el sistema: es dato de dominio. El selector de país es un pattern, no un componente.

## Reglas

- `multiple` no cierra el panel al elegir; la selección simple sí, y devuelve el foco al campo.
- `creatable` ofrece «Usar «x»» solo cuando lo escrito no coincide con ninguna opción.
- El teclado lo maneja `Listbox`: ↑↓ Home End Enter y typeahead cuando no hay búsqueda.
- El panel va en portal, así que no lo recorta el overflow de una tabla o un drawer.
