import React from 'react';

/** Panel anclado: posicion, colision, portal, click-outside y Escape. Ver contracts/popover.json.
 *
 *  placement: '<side>' o '<side>-<align>'. side: top|bottom|left|right.
 *  align: start|center|end sobre el eje cruzado. Por defecto start en top/bottom,
 *  center en left/right.
 *
 *  surface: 'card' pinta la superficie del sistema; 'none' deja el panel sin piel
 *  para que el consumidor pinte la suya (tooltip: burbuja inversa). El shell sigue
 *  siendo el unico dueno del anclaje, la colision, el portal y los keyframes.
 *
 *  interactive: false para un panel que no se puede senalar (tooltip). No escucha
 *  click-outside, no recibe puntero y no devuelve el foco al cerrarse.
 *
 *  autoFocus: true mueve el foco al primer elemento enfocable del panel, pero
 *  solo despues de colocarlo. Antes de eso el panel esta en visibility:hidden
 *  para no parpadear, y un elemento oculto no acepta foco: enfocar en el frame
 *  de apertura falla en silencio.
 */
export function Popover({
  open, onOpenChange, anchorRef, returnFocusRef, placement = 'bottom-start',
  matchAnchorWidth = true, minWidth, surface = 'card', interactive = true,
  autoFocus = false, offset = 6, children,
}) {
  const panelRef = React.useRef(null);
  const [pos, setPos] = React.useState(null);

  const place = React.useCallback(() => {
    const a = anchorRef && anchorRef.current;
    if (!a) return;
    const r = a.getBoundingClientRect();
    const p = panelRef.current;
    const pw = p ? p.offsetWidth : r.width;
    const ph = p ? p.offsetHeight : 260;
    const dash = placement.indexOf('-');
    const side = dash > -1 ? placement.slice(0, dash) : placement;
    const vertical = side === 'top' || side === 'bottom';
    // Un lado a secas centra sobre el eje cruzado: 'bottom-start' se pide, no se hereda.
    const align = dash > -1 ? placement.slice(dash + 1) : 'center';
    const M = 8; // margen minimo con el borde de la ventana
    const room = {
      top: r.top, bottom: window.innerHeight - r.bottom,
      left: r.left, right: window.innerWidth - r.right,
    };
    const need = vertical ? ph + offset : pw + offset;
    // pp-2: voltea de eje antes de salirse, y solo si al otro lado cabe mejor
    const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[side];
    const flip = room[side] < need && room[opposite] > room[side];
    const real = flip ? opposite : side;

    const cross = (size, start, end) => align === 'end' ? end - size
      : align === 'center' ? start + (end - start) / 2 - size / 2
      : start;
    const clamp = (v, size, limit) => Math.max(M, Math.min(v, limit - size - M));

    // Eje principal: el panel se queda pegado al ancla y se limita al espacio de
    // su lado, con scroll propio si no cabe. Nunca se desliza sobre el disparador:
    // un panel que tapa el campo que edita deja al usuario sin ver lo que cambia.
    let left, top, maxMain;
    if (vertical) {
      left = clamp(cross(pw, r.left, r.right), pw, window.innerWidth);
      if (real === 'bottom') {
        top = r.bottom + offset;
        maxMain = window.innerHeight - top - M;
      } else {
        maxMain = r.top - offset - M;
        top = Math.max(M, r.top - offset - Math.min(ph, maxMain));
      }
    } else {
      top = clamp(cross(ph, r.top, r.bottom), ph, window.innerHeight);
      if (real === 'right') {
        left = r.right + offset;
        maxMain = window.innerWidth - left - M;
      } else {
        maxMain = r.left - offset - M;
        left = Math.max(M, r.left - offset - Math.min(pw, maxMain));
      }
    }
    setPos({
      left, top, vertical,
      maxMain: Math.max(120, maxMain),
      desborda: (vertical ? ph : pw) > maxMain,
      width: matchAnchorWidth && vertical ? r.width : undefined,
      origin: { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[real],
    });
  }, [anchorRef, placement, matchAnchorWidth, offset]);

  React.useEffect(() => {
    if (!open) return;
    place();
    const id = requestAnimationFrame(place);
    const on = () => place();
    window.addEventListener('scroll', on, true);
    window.addEventListener('resize', on);
    return () => { cancelAnimationFrame(id); window.removeEventListener('scroll', on, true); window.removeEventListener('resize', on); };
  }, [open, place, children]);

  // Enfocable de verdad: el ancla puede ser un envoltorio no enfocable (un span
  // alrededor de un boton), y entonces el foco tiene que ir a su descendiente.
  const focusable = (el) => {
    if (!el) return null;
    if (el.tabIndex >= 0 || /^(BUTTON|A|INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) return el;
    return el.querySelector('[tabindex]:not([tabindex="-1"]), button:not([disabled]), a[href], input:not([disabled]), select, textarea');
  };

  React.useEffect(() => {
    if (!open || !autoFocus || !pos) return;
    const el = focusable(panelRef.current);
    if (el && el.focus) el.focus();
  }, [open, autoFocus, !!pos]);

  React.useEffect(() => {
    if (!open) return;
    const inside = (t) => (panelRef.current && panelRef.current.contains(t)) ||
      (anchorRef && anchorRef.current && anchorRef.current.contains(t));
    const md = (e) => { if (!inside(e.target)) onOpenChange && onOpenChange(false); };
    const esc = (e) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      onOpenChange && onOpenChange(false);
      if (!interactive) return;
      const back = focusable((returnFocusRef && returnFocusRef.current) || (anchorRef && anchorRef.current));
      if (back && back.focus) back.focus();
    };
    if (interactive) document.addEventListener('mousedown', md);
    document.addEventListener('keydown', esc, true);
    return () => { document.removeEventListener('mousedown', md); document.removeEventListener('keydown', esc, true); };
  }, [open, onOpenChange, anchorRef, returnFocusRef, interactive]);

  if (!open) return null;
  const skin = surface === 'none' ? null : {
    background: 'var(--surface-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-float)',
  };
  const panel = React.createElement('div', {
    ref: panelRef,
    style: {
      position: 'fixed',
      left: pos ? pos.left : -9999, top: pos ? pos.top : -9999,
      width: pos ? pos.width : undefined, minWidth,
      visibility: pos ? 'visible' : 'hidden',
      zIndex: 60, boxSizing: 'border-box',
      maxHeight: pos && pos.vertical ? pos.maxMain : undefined,
      maxWidth: pos && !pos.vertical ? pos.maxMain : undefined,
      overflowY: pos && pos.vertical && pos.desborda ? 'auto' : undefined,
      overflowX: pos && !pos.vertical && pos.desborda ? 'auto' : undefined,
      pointerEvents: interactive ? undefined : 'none',
      ...skin,
      animation: 'flowScaleIn var(--dur-fast) var(--ease-out)',
      transformOrigin: pos ? pos.origin : 'top',
    },
  }, children);
  const RD = typeof window !== 'undefined' ? window.ReactDOM : null;
  return RD && RD.createPortal ? RD.createPortal(panel, document.body) : panel;
}
