import React from 'react';

/** Pastilla que se toca. Ver contracts/chip.json.
 *  Con onRemove la raiz deja de ser un boton: quitar y seleccionar son dos
 *  acciones y no pueden anidarse una dentro de la otra.
 */
export function Chip({ label, selected = false, onClick, onRemove, icon, disabled = false, style }) {
  const [hover, setHover] = React.useState(false);
  const clickable = !!onClick;

  const pastilla = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    minHeight: 'var(--hit-target-min)', boxSizing: 'border-box',
    background: selected ? 'var(--surface-inverse)' : hover && clickable ? 'var(--surface-sunken)' : 'var(--surface-card)',
    color: selected ? 'var(--text-on-inverse)' : 'var(--text-primary)',
    border: '1px solid ' + (selected ? 'var(--surface-inverse)' : 'var(--border-default)'),
    borderRadius: 'var(--radius-pill)',
    font: 'var(--type-body)', fontWeight: 500,
    opacity: disabled ? 0.5 : 1, whiteSpace: 'nowrap',
    transform: hover && clickable && !disabled ? 'var(--hover-scale)' : 'none',
    transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-spring)',
  };
  const glifo = icon && React.createElement('span', {
    className: 'flow-icon' + (selected ? ' flow-icon--fill' : ''), 'aria-hidden': true,
    style: { fontSize: 16, flexShrink: 0 },
  }, icon);

  // La × es un objetivo aparte: --hit-target-min de area, glifo de 16.
  const quitar = onRemove && React.createElement('button', {
    type: 'button', 'aria-label': 'Quitar ' + label, disabled,
    onClick: (e) => { e.stopPropagation(); onRemove(); },
    style: {
      width: 'var(--hit-target-min)', alignSelf: 'stretch', flexShrink: 0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      border: 'none', background: 'transparent', color: 'inherit',
      borderRadius: 'var(--radius-pill)', cursor: disabled ? 'not-allowed' : 'pointer',
      padding: 0, opacity: 0.7,
    },
  }, React.createElement('span', { className: 'flow-icon', 'aria-hidden': true, style: { fontSize: 16 } }, 'close'));

  if (!onRemove) {
    return React.createElement(clickable ? 'button' : 'span', {
      type: clickable ? 'button' : undefined,
      onClick: disabled ? undefined : onClick,
      'aria-pressed': clickable && typeof selected === 'boolean' && onClick ? selected : undefined,
      disabled: clickable ? disabled : undefined,
      onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
      style: { ...pastilla, padding: '0 14px', cursor: clickable && !disabled ? 'pointer' : 'default', ...style },
    }, glifo, label);
  }

  // Los botones interiores se estiran al alto de contenido, que es el de la
  // pastilla menos sus dos bordes. Para que el objetivo mida --hit-target-min
  // limpio, la pastilla suma los bordes; los 2px extra solo los paga el chip
  // que lleva botones dentro.
  return React.createElement('span', {
    onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
    style: {
      ...pastilla,
      minHeight: 'calc(var(--hit-target-min) + 2 * var(--border-width))',
      paddingLeft: clickable ? 0 : 14,
      ...style,
    },
  },
    clickable
      ? React.createElement('button', {
          type: 'button', disabled, 'aria-pressed': selected,
          onClick: disabled ? undefined : onClick,
          style: {
            alignSelf: 'stretch', display: 'inline-flex', alignItems: 'center', gap: 6,
            border: 'none', background: 'transparent', color: 'inherit', font: 'inherit',
            padding: '0 4px 0 14px', borderRadius: 'var(--radius-pill)',
            cursor: disabled ? 'not-allowed' : 'pointer',
          },
        }, glifo, label)
      : React.createElement(React.Fragment, null, glifo, label),
    quitar);
}
