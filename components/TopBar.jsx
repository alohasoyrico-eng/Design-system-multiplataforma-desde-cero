import React from 'react';

/**
 * TopBar / Header con 6 variantes de disposicion.
 *
 * variant: 'standard' | 'minimal' | 'admin' | 'multientity' | 'mobile' | 'fullscreen'
 *
 * Escrito en React.createElement como el resto del sistema. Estaba en JSX, y el
 * bundle no transpila: una regeneracion desde la fuente metia JSX crudo en un
 * script plano y tumbaba window.Flow entero. Quedan dos archivos asi
 * (Sidebar y FlowChart) y estan anotados en architecture.json.
 */
export function TopBar({
  variant = 'standard',
  onToggleSidebar = () => {},
  logo = null,
  navItems = [],
  breadcrumb = [],
  searchValue = '',
  onSearchChange = () => {},
  avatar = null,
  notificationCount = 0,
  onNotifications = () => {},
  entities = [],
  currentEntity = '',
  onEntityChange = () => {},
  onSettings = () => {},
  style = {},
}) {
  const [showEntityMenu, setShowEntityMenu] = React.useState(false);
  const h = React.createElement;
  const icono = (nombre, extra) => h('span', { className: 'flow-symbol', 'aria-hidden': true, style: extra }, nombre);
  const espaciador = h('div', { key: 'sp', style: { flex: 1 } });

  const standard = [
    logo && h('div', { key: 'logo', style: { display: 'flex', alignItems: 'center' } }, logo),
    h('nav', { key: 'nav', 'aria-label': 'Secciones', style: { display: 'flex', gap: 20, flex: 1 } },
      navItems.map((n) => h('a', {
        key: n.id || n.label,
        href: n.href || '#',
        'aria-current': n.active ? 'page' : undefined,
        style: {
          font: 'var(--type-body)',
          fontWeight: n.active ? 700 : 500,
          color: n.active ? 'var(--text-primary)' : 'var(--text-secondary)',
          textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center',
          minHeight: 'var(--hit-target-min)',
        },
      }, n.label))),
    avatar,
  ];

  const minimal = [
    breadcrumb.length > 0 && h('nav', {
      key: 'bc', 'aria-label': 'Ruta',
      style: { display: 'flex', alignItems: 'center', gap: 8, font: 'var(--type-caption)', color: 'var(--text-secondary)' },
    }, breadcrumb.map((c, i) => {
      const ultimo = i === breadcrumb.length - 1;
      return h(React.Fragment, { key: i },
        i > 0 && h('span', { 'aria-hidden': true, style: { color: 'var(--text-muted)' } }, '/'),
        ultimo
          ? h('span', { 'aria-current': 'page', style: { color: 'var(--text-primary)', fontWeight: 600 } }, c.label)
          : h('a', { href: c.href || '#', style: { color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 } }, c.label));
    })),
    espaciador,
    avatar,
  ];

  const admin = [
    h('div', { key: 'buscar', style: { flex: 1, display: 'flex', gap: 12 } },
      h('input', {
        type: 'text',
        // Un campo sin etiqueta visible necesita nombre accesible.
        'aria-label': 'Buscar unidades y conductores',
        placeholder: 'Buscar unidades, conductores…',
        value: searchValue,
        onChange: (e) => onSearchChange(e.target.value),
        style: {
          flex: 1, boxSizing: 'border-box',
          minHeight: 'var(--hit-target-min)',
          border: 'var(--border-width) solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '0 12px',
          font: 'var(--type-body)', fontFamily: 'inherit',
          background: 'var(--surface-sunken)', color: 'var(--text-primary)',
        },
      })),
    notificationCount > 0 && h('button', {
      key: 'notif', type: 'button', onClick: onNotifications,
      'aria-label': notificationCount + ' notificaciones sin leer',
      style: {
        border: 'none', background: 'transparent', cursor: 'pointer', position: 'relative',
        width: 'var(--hit-target-min)', height: 'var(--hit-target-min)',
        borderRadius: 'var(--radius-pill)', padding: 0, flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-primary)',
      },
    },
      icono('notifications', { fontSize: 20 }),
      h('span', {
        'aria-hidden': true,
        style: {
          position: 'absolute', top: 6, right: 6, minWidth: 16, height: 16, padding: '0 4px',
          borderRadius: 'var(--radius-pill)', boxSizing: 'border-box',
          background: 'var(--status-danger)', color: 'var(--text-on-accent)',
          font: 'var(--type-data)', fontSize: 10, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        },
      }, notificationCount > 9 ? '9+' : notificationCount)),
    avatar,
  ];

  const entidadActual = entities.find((e) => e.id === currentEntity);
  const multientity = [
    h('div', { key: 'ent', style: { position: 'relative' } },
      h('button', {
        type: 'button',
        'aria-haspopup': 'menu', 'aria-expanded': showEntityMenu,
        onClick: () => setShowEntityMenu((v) => !v),
        style: {
          minHeight: 'var(--hit-target-min)', boxSizing: 'border-box',
          border: 'var(--border-width) solid var(--border-subtle)',
          background: 'var(--surface-card)', color: 'var(--text-primary)',
          borderRadius: 'var(--radius-sm)', padding: '0 12px',
          font: 'var(--type-body)', fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
        },
      },
        (entidadActual && entidadActual.label) || 'Selecciona…',
        icono('expand_more', { fontSize: 16 })),
      showEntityMenu && h('div', {
        role: 'menu',
        style: {
          position: 'absolute', top: '100%', left: 0, marginTop: 4, minWidth: 180, zIndex: 100,
          background: 'var(--surface-card)',
          border: 'var(--border-width) solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-float)', padding: 4,
        },
      }, entities.map((e) => h('button', {
        key: e.id, type: 'button', role: 'menuitem',
        'aria-current': e.id === currentEntity ? 'true' : undefined,
        onClick: () => { onEntityChange(e.id); setShowEntityMenu(false); },
        style: {
          width: '100%', minHeight: 'var(--hit-target-min)', padding: '0 12px',
          border: 'none', borderRadius: 'var(--radius-sm)',
          background: e.id === currentEntity ? 'var(--surface-accent-subtle)' : 'transparent',
          color: e.id === currentEntity ? 'var(--text-accent)' : 'var(--text-primary)',
          font: 'var(--type-body)', fontWeight: 600, fontFamily: 'inherit',
          textAlign: 'left', cursor: 'pointer',
          display: 'flex', alignItems: 'center',
        },
      }, e.label)))),
    espaciador,
    avatar,
  ];

  const mobile = [
    h('button', {
      key: 'menu', type: 'button', onClick: onToggleSidebar, 'aria-label': 'Abrir navegacion',
      style: {
        border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, flexShrink: 0,
        width: 'var(--hit-target-min)', height: 'var(--hit-target-min)',
        borderRadius: 'var(--radius-pill)', color: 'var(--text-primary)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      },
    }, icono('menu', { fontSize: 20 })),
    logo && h('div', { key: 'logo', style: { flex: 1, display: 'flex', justifyContent: 'center' } }, logo),
    avatar,
  ];

  if (variant === 'fullscreen') return null;

  const contenido = { standard, minimal, admin, multientity, mobile }[variant] || standard;

  return h('header', {
    style: {
      height: 56, boxSizing: 'border-box',
      background: 'var(--surface-card)',
      borderBottom: 'var(--border-width) solid var(--border-subtle)',
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16,
      ...style,
    },
  }, contenido);
}
