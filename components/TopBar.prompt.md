Header de app de 56px. Una sola variante por pantalla — elige por producto, no por gusto:

| variant | Para |
|---|---|
| `standard` | Nav horizontal top-level, sin sidebar |
| `minimal` | Shell con Sidebar: solo breadcrumb + avatar |
| `admin` | Internal Tools: busqueda global + notificaciones |
| `multientity` | Fleet managers con varias flotas: selector de empresa |
| `mobile` | Hamburguesa + logo centrado + avatar |
| `fullscreen` | Devuelve `null` — mapa, onboarding, viaje activo |

```jsx
<TopBar variant="minimal" breadcrumb={[{label:'Flota',href:'/flota'},{label:'ABC-123'}]} avatar={<Avatar name="Marta" size="sm" />} />

<TopBar variant="admin" searchValue={q} onSearchChange={setQ} notificationCount={3} onNotifications={openInbox} avatar={<Avatar name="Marta" size="sm" />} />

<TopBar variant="multientity" entities={flotas} currentEntity={id} onEntityChange={setId} avatar={<Avatar name="Marta" size="sm" />} />
```

En `mobile`, `onToggleSidebar` es tuyo: abre el `Sidebar` dentro de un `Drawer side="left"`, y cierra el drawer en `onNavigate`.

```jsx
<TopBar variant="mobile" onToggleSidebar={() => setOpen(true)} logo={<Logo />} avatar={<Avatar name="Diego" size="sm" />} />
<Drawer open={open} onClose={() => setOpen(false)} side="left" width={260} title="Menu">
  <Sidebar items={items} activeId={active} width="100%" style={{ borderRight: 'none' }}
    onNavigate={(id) => { go(id); setOpen(false); }} />
</Drawer>
```

**Reglas**
- Con `Sidebar` presente usa `minimal` o `admin`; nunca `standard` (duplica la navegacion).
- El badge de notificaciones es `--status-danger`, no el rojo de marca; corta en `99+`.
- No metas CTAs de pagina en el TopBar. Van en el page header.
- `fullscreen` no renderiza: la pantalla debe ofrecer su propia salida (back, cerrar).
