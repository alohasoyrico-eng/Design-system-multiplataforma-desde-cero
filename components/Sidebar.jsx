import React from 'react';

/** Nav lateral de escritorio. Ver contracts/sidebar.json.
 *
 *  Escrito en React.createElement como el resto del sistema. Estaba en JSX y el
 *  bundle no transpila: era una de las dos fuentes que el generador tenia que
 *  copiar sin regenerar, o sea un cambio aqui no llegaba al bundle.
 */
export function Sidebar({
  items = [],
  collapsed = false,
  activeId = '',
  expandedSections = new Set(),
  onNavigate = () => {},
  onToggleSection = () => {},
  headerContent = null,
  footerActions = null,
  width = '240px',
  style = {},
}) {
  const [hoveredId, setHoveredId] = React.useState(null);
  const h = React.createElement;

  const renderItem = (item, level = 0) => {
    const esSeccion = !!(item.children && item.children.length);
    const abierta = expandedSections.has(item.id);
    const activo = item.id === activeId;
    const hover = hoveredId === item.id;
    const sangria = 12 + level * 12;

    return h('div', { key: item.id },
      h('button', {
        type: 'button',
        // Colapsado el texto no se ve, asi que el nombre accesible lo lleva el
        // propio boton: un icono solo no dice a donde lleva (sbr-2).
        'aria-label': collapsed ? item.label : undefined,
        'aria-current': activo && !esSeccion ? 'page' : undefined,
        'aria-expanded': esSeccion ? abierta : undefined,
        onClick: () => { if (esSeccion) onToggleSection(item.id); else onNavigate(item.id, item.href); },
        onMouseEnter: () => setHoveredId(item.id),
        onMouseLeave: () => setHoveredId(null),
        style: {
          width: '100%', boxSizing: 'border-box',
          padding: collapsed ? 12 : '8px ' + sangria + 'px',
          border: 'none',
          background: activo ? 'var(--surface-accent-subtle)' : hover ? 'var(--surface-sunken)' : 'transparent',
          color: activo ? 'var(--text-accent)' : hover ? 'var(--text-primary)' : 'var(--text-secondary)',
          display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10,
          justifyContent: collapsed ? 'center' : 'flex-start',
          cursor: 'pointer', minHeight: 'var(--hit-target-min)',
          font: 'var(--type-body)', fontWeight: activo ? 700 : 500, fontFamily: 'inherit',
          borderRadius: collapsed ? 'var(--radius-pill)' : 'var(--radius-sm)',
          position: 'relative',
          transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
        },
      },
        h('span', { className: 'flow-icon', 'aria-hidden': true, style: { fontSize: 20, flex: 'none' } }, item.icon),
        !collapsed && h('span', { key: 'lbl', style: { flex: 1, textAlign: 'left' } }, item.label),
        !collapsed && esSeccion && h('span', {
          key: 'chev', className: 'flow-icon', 'aria-hidden': true,
          style: {
            fontSize: 18,
            transform: abierta ? 'rotate(180deg)' : 'none',
            transition: 'transform var(--dur-fast) var(--ease-out)',
          },
        }, 'expand_more'),
        // El globo del modo colapsado es decorativo: el nombre ya va en el boton.
        collapsed && hover && h('span', {
          key: 'tip', 'aria-hidden': true,
          style: {
            position: 'absolute', left: '100%', top: '50%', transform: 'translateY(-50%)',
            marginLeft: 8, pointerEvents: 'none', zIndex: 1000, whiteSpace: 'nowrap',
            background: 'var(--surface-card)', color: 'var(--text-primary)',
            border: 'var(--border-width) solid var(--border-subtle)',
            padding: '6px 8px', borderRadius: 'var(--radius-sm)',
            font: 'var(--type-caption)', fontWeight: 600,
            boxShadow: 'var(--shadow-float)',
          },
        }, item.label)),
      esSeccion && abierta && !collapsed && h('div', {
        style: { background: 'var(--surface-sunken)' },
      }, item.children.map((hijo) => renderItem(hijo, level + 1))));
  };

  const bordeSuperficie = { borderColor: 'var(--border-subtle)', borderStyle: 'solid', borderWidth: 0 };

  return h('aside', {
    style: {
      width: collapsed ? 60 : width,
      background: 'var(--surface-card)',
      borderRight: 'var(--border-width) solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column', height: '100%',
      boxSizing: 'border-box',
      transition: 'width var(--dur-base) var(--ease-spring)',
      ...style,
    },
  },
    headerContent && h('div', {
      key: 'head',
      style: {
        ...bordeSuperficie, borderBottomWidth: 'var(--border-width)',
        padding: collapsed ? 8 : 16, flex: 'none',
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
      },
    }, headerContent),
    h('nav', {
      key: 'nav', 'aria-label': 'Navegacion principal',
      style: {
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        padding: collapsed ? '8px 0' : '12px 0',
        display: 'flex', flexDirection: 'column', gap: 2,
      },
    }, items.map((item) => renderItem(item, 0))),
    footerActions && h('div', {
      key: 'foot',
      style: {
        ...bordeSuperficie, borderTopWidth: 'var(--border-width)',
        padding: collapsed ? 8 : 14, flex: 'none',
        display: 'flex', justifyContent: collapsed ? 'center' : 'flex-start',
      },
    }, footerActions));
}
