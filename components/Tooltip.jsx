import React from 'react';
import { Popover } from '../primitives/shells/Popover';

/** Burbuja de apoyo. El anclaje, la colision, el portal y Escape los resuelve
 *  Popover con surface="none": la piel inversa la pinta este archivo, la
 *  posicion no. Ver contracts/popover.json.
 */
export function Tooltip({ content, position = 'top', children, style }) {
  const [show, setShow] = React.useState(false);
  const anchorRef = React.useRef(null);
  return React.createElement('span', {
    ref: anchorRef,
    // No se estira al alto de su contenedor flex: envuelve a su hijo y nada mas.
    style: { display: 'inline-flex', alignItems: 'center', alignSelf: 'center', ...style },
    onMouseEnter: () => setShow(true), onMouseLeave: () => setShow(false),
    onFocus: () => setShow(true), onBlur: () => setShow(false),
  },
    children,
    React.createElement(Popover, {
      open: show, onOpenChange: setShow, anchorRef,
      placement: position, matchAnchorWidth: false,
      surface: 'none', interactive: false, offset: 8,
    },
      React.createElement('span', {
        role: 'tooltip',
        style: {
          display: 'block',
          background: 'var(--surface-inverse)', color: 'var(--text-on-inverse)',
          fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, lineHeight: 1.4,
          padding: '7px 12px', borderRadius: 'var(--radius-sm)',
          // Con colision resuelta, el texto largo envuelve en vez de salirse de la ventana.
          maxWidth: 260,
          boxShadow: 'var(--shadow-float)',
        },
      }, content)));
}
