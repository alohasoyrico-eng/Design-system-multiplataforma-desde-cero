/* Flow DS bundle — generado por platforms/build-bundle.mjs. No editar a mano. */
(function(){
"use strict";
var React = window.React;
if (!React) { console.error("Flow bundle: React must load first"); return; }
var F = {};

// ---- primitives/Button.jsx ----
(function(){

// Los tres tamanos parten del mismo suelo: --hit-target-min. Un boton pequeno es
// mas estrecho y de tipografia menor, no mas bajo (btn-1). Con el suelo a 44, sm
// solo puede distinguirse por padding y tipo, y eso es correcto: la alternativa
// era que "sm" fuera el hueco por donde todo el sistema se salta el objetivo.
const SIZES = {
  sm: { h: 44, px: 18, fs: 13, icon: 18 },
  md: { h: 44, px: 22, fs: 14, icon: 20 },
  lg: { h: 52, px: 28, fs: 15, icon: 22 },
};

function Button({
  variant = 'primary', size = 'md', icon, iconTrailing,
  loading = false, disabled = false, fullWidth = false,
  children, onClick, type = 'button', ariaLabel, style,
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const s = SIZES[size] || SIZES.md;

  const V = {
    primary: { bg: hover ? 'var(--action-primary-hover)' : 'var(--action-primary)', color: 'var(--text-on-inverse)', border: 'none' },
    accent: { bg: hover ? 'var(--action-accent-hover)' : 'var(--action-accent)', color: 'var(--text-on-accent)', border: 'none', glow: true },
    secondary: { bg: 'var(--surface-card)', color: 'var(--text-primary)', border: '1.5px solid ' + (hover ? 'var(--border-strong)' : 'var(--border-default)') },
    ghost: { bg: hover ? 'var(--surface-sunken)' : 'transparent', color: 'var(--text-primary)', border: 'none' },
    danger: { bg: hover ? 'var(--status-danger-text)' : 'var(--status-danger)', color: 'var(--text-on-accent)', border: 'none' },
  }[variant] || {};

  const shadows = [];
  if (focus) shadows.push('var(--focus-ring)');
  if (V.glow && hover && !disabled) shadows.push('var(--shadow-accent-glow)');

  const iconEl = (name) => React.createElement('span', {
    className: 'flow-symbol', 'aria-hidden': true,
    style: { fontSize: s.icon, lineHeight: 1 },
  }, name);

  return React.createElement('button', {
    type, onClick: disabled || loading ? undefined : onClick,
    // Deshabilitado de verdad mientras carga: quitar el handler no impide que el
    // boton reciba foco ni que envie el formulario, y dos clics rapidos mandaban
    // dos veces (btn-3).
    disabled: disabled || loading, 'aria-label': ariaLabel, 'aria-busy': loading || undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => { setHover(false); setPress(false); },
    onMouseDown: () => setPress(true), onMouseUp: () => setPress(false),
    onFocus: (e) => setFocus(e.target.matches(':focus-visible')), onBlur: () => setFocus(false),
    style: {
      display: fullWidth ? 'flex' : 'inline-flex', width: fullWidth ? '100%' : undefined,
      alignItems: 'center', justifyContent: 'center', gap: 'var(--gap-inline)',
      minHeight: s.h, padding: '0 ' + s.px + 'px',
      fontFamily: 'var(--font-body)', fontSize: s.fs, fontWeight: 600, whiteSpace: 'nowrap',
      background: V.bg, color: V.color, border: V.border || 'none',
      borderRadius: 'var(--radius-pill)',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      outline: 'none',
      boxShadow: shadows.join(', ') || 'none',
      transform: disabled ? 'none' : press ? 'var(--press-scale)' : hover ? 'var(--hover-scale)' : 'none',
      transition: 'transform var(--dur-fast) var(--ease-spring), background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      ...style,
    },
  },
    loading
      ? React.createElement('span', { 'aria-hidden': true, style: { width: s.icon - 4, height: s.icon - 4, border: '2.5px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'flowSpin .7s linear infinite' } })
      : icon && iconEl(icon),
    children && React.createElement('span', null, children),
    !loading && iconTrailing && iconEl(iconTrailing)
  );
}

F.Button = Button;
})();

// ---- primitives/IconButton.jsx ----
(function(){

// El diametro parte de --hit-target-min en los tres tamanos: sm medía 36 y era el
// quinto componente con su propia tabla de alturas por debajo del suelo, tras
// Button, ControlShell, Chip y Tabs. Lo que cambia con el tamano es el glifo.
const SIZES = { sm: { d: 44, icon: 18 }, md: { d: 44, icon: 22 }, lg: { d: 52, icon: 24 } };

function IconButton({
  icon, ariaLabel, variant = 'ghost', size = 'md',
  selected = false, disabled = false, badge = false, onClick, style,
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const s = SIZES[size] || SIZES.md;

  const V = {
    ghost: { bg: hover ? 'var(--surface-sunken)' : 'transparent', color: selected ? 'var(--text-accent)' : 'var(--text-primary)' },
    tonal: { bg: selected ? 'var(--surface-accent-subtle)' : hover ? 'var(--surface-sunken)' : 'var(--surface-card)', color: selected ? 'var(--text-accent)' : 'var(--text-primary)', border: '1px solid ' + (selected ? 'transparent' : 'var(--border-default)') },
    primary: { bg: hover ? 'var(--action-primary-hover)' : 'var(--action-primary)', color: 'var(--text-on-inverse)' },
    accent: { bg: hover ? 'var(--action-accent-hover)' : 'var(--action-accent)', color: 'var(--text-on-accent)' },
  }[variant] || {};

  return React.createElement('button', {
    type: 'button', onClick: disabled ? undefined : onClick, disabled,
    'aria-label': ariaLabel, 'aria-pressed': selected || undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => { setHover(false); setPress(false); },
    onMouseDown: () => setPress(true), onMouseUp: () => setPress(false),
    onFocus: (e) => setFocus(e.target.matches(':focus-visible')), onBlur: () => setFocus(false),
    style: {
      position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: s.d, height: s.d, flex: 'none',
      background: V.bg, color: V.color, border: V.border || 'none',
      borderRadius: '50%', cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1, outline: 'none',
      boxShadow: focus ? 'var(--focus-ring)' : 'none',
      transform: disabled ? 'none' : press ? 'var(--press-scale)' : hover ? 'var(--hover-scale)' : 'none',
      transition: 'transform var(--dur-fast) var(--ease-spring), background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      ...style,
    },
  },
    React.createElement('span', {
      className: 'flow-symbol' + (selected ? ' flow-symbol--fill' : ''), 'aria-hidden': true,
      style: { fontSize: s.icon },
    }, icon),
    badge && React.createElement('span', {
      style: { position: 'absolute', top: 6, right: 6, width: 9, height: 9, borderRadius: '50%', background: 'var(--status-live)', border: '2px solid var(--surface-card)', animation: 'flowPulse 1.6s ease-in-out infinite' },
    })
  );
}

F.IconButton = IconButton;
})();

// ---- components/Menu.jsx ----
(function(){

/** items: [{label, icon?, danger?, disabled?, onClick?}] o 'divider'.
 *  El anclaje, la colision, el portal y Escape los resuelve Popover: este
 *  archivo solo pone los items y su teclado. Ver contracts/popover.json.
 */
function Menu({ trigger, items = [], align = 'left', style }) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const anchorRef = React.useRef(null);
  const itemRefs = React.useRef([]);

  const usable = items
    .map((it, i) => (it !== 'divider' && !it.disabled ? i : -1))
    .filter((i) => i > -1);

  // El foco entra a lo que se abre (a11y-4). Lo mueve Popover con autoFocus,
  // porque solo el shell sabe cuando el panel ya esta colocado y visible.
  React.useEffect(() => { setActive(usable[0] ?? 0); }, [open]);

  const move = (dir) => {
    if (!usable.length) return;
    const at = usable.indexOf(active);
    const next = usable[(at + dir + usable.length) % usable.length];
    setActive(next);
    const el = itemRefs.current[next];
    if (el && el.focus) el.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(usable[0]); itemRefs.current[usable[0]].focus(); }
    else if (e.key === 'End') { e.preventDefault(); const l = usable[usable.length - 1]; setActive(l); itemRefs.current[l].focus(); }
    else if (e.key === 'Tab') setOpen(false);
  };

  const pick = (it) => { setOpen(false); it.onClick && it.onClick(); };

  // alignSelf/alignItems explicitos: como flex item, la raiz se estiraria al alto
  // del contenedor y el disparador con radius-pill se deforma en ovalo.
  return React.createElement('div', { style: { display: 'inline-flex', alignItems: 'center', alignSelf: 'center', ...style } },
    React.createElement('span', {
      ref: anchorRef,
      onClick: () => setOpen((o) => !o),
      style: { display: 'inline-flex', alignItems: 'center' },
      'aria-haspopup': 'menu', 'aria-expanded': open,
    }, trigger),
    React.createElement(F.Popover, {
      open, onOpenChange: setOpen, anchorRef,
      placement: align === 'right' ? 'bottom-end' : 'bottom-start',
      matchAnchorWidth: false, minWidth: 200, autoFocus: true,
    },
      React.createElement('div', { role: 'menu', onKeyDown, style: { padding: 6 } },
        items.map((it, i) => it === 'divider'
          ? React.createElement('div', { key: i, role: 'separator', style: { height: 1, background: 'var(--border-subtle)', margin: '6px 4px' } })
          : React.createElement('button', {
            key: i, role: 'menuitem', type: 'button', disabled: it.disabled,
            ref: (el) => { itemRefs.current[i] = el; },
            tabIndex: active === i ? 0 : -1,
            onClick: () => pick(it),
            onMouseEnter: () => !it.disabled && setActive(i),
            style: {
              // 44px de alto: el item es un objetivo tactil (a11y-2), no una fila de lista.
              display: 'flex', alignItems: 'center', gap: 10, width: '100%', minHeight: 44, padding: '0 12px',
              border: 'none', borderRadius: 'var(--radius-sm)', textAlign: 'left', cursor: it.disabled ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 500,
              background: active === i && !it.disabled ? (it.danger ? 'var(--status-danger-bg)' : 'var(--surface-sunken)') : 'transparent',
              color: it.danger ? 'var(--status-danger-text)' : 'var(--text-primary)',
              opacity: it.disabled ? 0.45 : 1,
              transition: 'background var(--dur-instant) var(--ease-out)',
            },
          },
            it.icon && React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 18, color: it.danger ? 'inherit' : 'var(--text-muted)' } }, it.icon),
            it.label)))));
}

F.Menu = Menu;
})();

// ---- primitives/shells/ControlShell.jsx ----
(function(){

// El suelo es --hit-target-min mas los dos bordes. sm medía 38 y era el unico
// objetivo del sistema por debajo de 44, con cuatro usos en pantallas reales.
// Con el suelo puesto, sm se distingue por tipografia y padding, no por alto.
const H = { sm: 46, md: 46, lg: 54 };

/** Carcasa unica de todo control de formulario. Ver contracts/control-shell.json. */
const ControlShell = React.forwardRef(function ControlShell({
  size = 'md', invalid = false, disabled = false, multiline = false,
  leading, trailing, footer, onShellClick, children, style, ...rest
}, ref) {
  const [focus, setFocus] = React.useState(false);
  // El grosor cambia con el estado; el padding compensa para que el contenido no se mueva (cs-1).
  const bw = invalid || focus ? 1.5 : 1;
  const comp = bw - 1;
  const color = invalid ? 'var(--status-danger)' : focus ? 'var(--border-focus)' : 'var(--border-default)';
  const row = React.createElement('div', {
    // El control se estira a toda la fila: si solo se centra, su caja mide el
    // line-height (~18px) dentro de una carcasa de 46 y el target real es ese.
    style: { display: 'flex', alignItems: 'stretch', gap: 10, flex: 1, minWidth: 0 },
  },
    leading && (typeof leading === 'string'
      ? React.createElement('span', {
          key: 'lead', className: 'flow-symbol', 'aria-hidden': true,
          // La fila estira a sus hijos para que el control ocupe todo el alto y
          // el target sea real. Un glifo estirado no se centra: se apoya arriba,
          // en su line-height, y queda mas alto que la etiqueta. Se centra solo.
          style: {
            fontSize: 20, flexShrink: 0, display: 'inline-flex', alignItems: 'center',
            color: focus ? 'var(--text-accent)' : 'var(--text-muted)',
            transition: 'color var(--dur-fast) var(--ease-out)',
          },
        }, leading)
      : leading),
    children,
    trailing && (typeof trailing === 'string'
      ? React.createElement('span', { key: 'trail', style: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0, display: 'inline-flex', alignItems: 'center' } }, trailing)
      : trailing)
  );
  return React.createElement('div', {
    ref,
    'data-control-shell': '1',
    onFocusCapture: () => setFocus(true),
    onBlurCapture: () => setFocus(false),
    // Clic en el padding de la carcasa enfoca su control: sin esto, 28 de los 46px
    // de alto no responden al dedo.
    onClick: onShellClick || ((e) => {
      if (e.target !== e.currentTarget) return;
      const f = e.currentTarget.querySelector('input, textarea, select, button');
      if (f && f.focus) f.focus();
    }),
    'data-invalid': invalid || undefined,
    'data-disabled': disabled || undefined,
    style: {
      display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
      minHeight: multiline ? undefined : H[size] || H.md,
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      border: bw + 'px solid ' + color,
      borderRadius: 'var(--radius-md)',
      padding: multiline ? (12 - comp) + 'px ' + (16 - comp) + 'px' : '0 ' + (16 - comp) + 'px',
      boxShadow: focus ? 'var(--focus-ring)' : 'none',
      opacity: disabled ? 0.6 : 1,
      transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      ...style,
    },
    ...rest,
  },
    row,
    // Zona de pie propia: el control nunca posiciona nada en absoluto sobre su propia area.
    footer && React.createElement('div', {
      style: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexShrink: 0, paddingTop: 4, minHeight: 16 },
    }, footer)
  );
});

F.ControlShell = ControlShell;
})();

// ---- primitives/shells/Popover.jsx ----
(function(){

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
function Popover({
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

F.Popover = Popover;
})();

// ---- primitives/shells/Listbox.jsx ----
(function(){

const norm = (o) => (typeof o === 'string' ? { value: o, label: o } : o);

/** La maquina de una lista seleccionable. Ver contracts/listbox.json. */
const Listbox = React.forwardRef(function Listbox({
  idPrefix = 'flow-lb', items = [], value, onSelect, multiple = false,
  query = '', groupOrder, renderItem, emptyLabel = 'Sin resultados',
  onActiveIdChange, maxHeight = 260, extraRow,
}, ref) {
  const all = items.map(norm);
  const q = String(query || '').trim().toLowerCase();
  const rows = q
    ? all.filter((o) => (o.label + ' ' + o.value + ' ' + (o.hint || '')).toLowerCase().indexOf(q) > -1)
    : all;

  const groups = [];
  if (rows.some((o) => o.group)) {
    const names = groupOrder || Array.from(new Set(rows.map((o) => o.group || '')));
    names.forEach((g) => {
      const inG = rows.filter((o) => (o.group || '') === g);
      if (inG.length) groups.push({ name: g, items: inG });
    });
  } else {
    groups.push({ name: null, items: rows });
  }
  const flat = groups.reduce((a, g) => a.concat(g.items), []);

  const [active, setActive] = React.useState(0);
  const listRef = React.useRef(null);
  const buf = React.useRef({ s: '', t: 0 });
  React.useEffect(() => { setActive(0); }, [query, items.length]);

  const activeId = flat[active] ? idPrefix + '-' + flat[active].value : undefined;
  React.useEffect(() => { onActiveIdChange && onActiveIdChange(activeId); }, [activeId, onActiveIdChange]);

  // lb-4: mantiene visible la fila activa moviendo el scroll del contenedor, nunca la pagina
  React.useEffect(() => {
    const c = listRef.current;
    if (!c) return;
    const el = c.querySelector('[data-active="1"]');
    if (!el) return;
    const t = el.offsetTop, b = t + el.offsetHeight;
    if (t < c.scrollTop) c.scrollTop = t;
    else if (b > c.scrollTop + c.clientHeight) c.scrollTop = b - c.clientHeight;
  }, [active, query]);

  const pick = (item) => {
    if (!item || item.disabled) return;
    if (multiple) {
      const arr = Array.isArray(value) ? value : [];
      onSelect(arr.indexOf(item.value) > -1 ? arr.filter((v) => v !== item.value) : arr.concat([item.value]));
    } else {
      onSelect(item.value);
    }
  };

  React.useImperativeHandle(ref, () => ({
    get activeItem() { return flat[active]; },
    get count() { return flat.length; },
    onKeyDown(e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, flat.length - 1)); return true; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); return true; }
      if (e.key === 'Home') { e.preventDefault(); setActive(0); return true; }
      if (e.key === 'End') { e.preventDefault(); setActive(Math.max(0, flat.length - 1)); return true; }
      if (e.key === 'Enter') { e.preventDefault(); pick(flat[active]); return true; }
      // lb-3: typeahead cuando no hay campo de busqueda
      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const now = Date.now();
        buf.current.s = now - buf.current.t < 700 ? buf.current.s + e.key : e.key;
        buf.current.t = now;
        const i = flat.findIndex((o) => o.label.toLowerCase().indexOf(buf.current.s.toLowerCase()) === 0);
        if (i > -1) { setActive(i); return true; }
      }
      return false;
    },
  }));

  const isSel = (v) => (multiple ? (Array.isArray(value) ? value.indexOf(v) > -1 : false) : value === v);

  return React.createElement('div', {
    ref: listRef, role: 'listbox', id: idPrefix,
    'aria-multiselectable': multiple || undefined,
    style: { maxHeight, overflowY: 'auto', padding: 6, display: 'flex', flexDirection: 'column', gap: 1 },
  },
    extraRow,
    flat.length === 0 && !extraRow && React.createElement('div', {
      style: { padding: '18px 12px', textAlign: 'center', font: 'var(--type-caption)', color: 'var(--text-muted)' },
    }, emptyLabel),
    groups.map((g) => React.createElement(React.Fragment, { key: g.name || '_' },
      g.name && React.createElement('div', {
        style: { font: 'var(--type-overline)', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-muted)', padding: '10px 12px 4px' },
      }, g.name),
      g.items.map((o) => {
        const i = flat.indexOf(o);
        const sel = isSel(o.value);
        const act = i === active;
        return React.createElement('div', {
          key: o.value, role: 'option', id: idPrefix + '-' + o.value,
          'aria-selected': sel, 'aria-disabled': o.disabled || undefined,
          'data-active': act ? '1' : undefined,
          onMouseEnter: () => setActive(i),
          onMouseDown: (e) => e.preventDefault(),
          onClick: () => pick(o),
          style: {
            display: 'flex', alignItems: 'center', gap: 10,
            minHeight: 44, flexShrink: 0, boxSizing: 'border-box', padding: '10px 12px',
            borderRadius: 'var(--radius-sm)', cursor: o.disabled ? 'not-allowed' : 'pointer',
            font: 'var(--type-body)', opacity: o.disabled ? 0.45 : 1,
            background: act ? 'var(--surface-sunken)' : sel && !multiple ? 'var(--surface-accent-subtle)' : 'transparent',
            color: sel && !multiple ? 'var(--text-accent)' : 'var(--text-primary)',
            fontWeight: sel && !multiple ? 600 : 400,
            transition: 'background var(--dur-instant) var(--ease-out)',
          },
        },
          multiple && React.createElement('span', {
            'aria-hidden': true,
            style: {
              width: 18, height: 18, flexShrink: 0, borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center',
              border: sel ? 'none' : '1.5px solid var(--border-default)',
              background: sel ? 'var(--action-primary)' : 'transparent',
              color: 'var(--text-on-inverse)', fontSize: 14,
            },
          }, sel ? React.createElement('span', { className: 'flow-symbol', style: { fontSize: 14 } }, 'check') : null),
          renderItem ? renderItem(o, { active: act, selected: sel })
            : React.createElement('span', { style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, o.label),
          // hint se pinta, no solo se filtra: un dato por el que se puede buscar y
          // que no se ve deja al usuario adivinando por que aparecio esa fila.
          !renderItem && o.hint && React.createElement('span', {
            style: { font: 'var(--type-data)', fontSize: 11.5, color: act || sel ? 'var(--text-accent)' : 'var(--text-muted)', flexShrink: 0 },
          }, o.hint),
          !multiple && sel && React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 18, flexShrink: 0 } }, 'check')
        );
      })
    ))
  );
});

F.Listbox = Listbox;
})();

// ---- primitives/shells/OverlayShell.jsx ----
(function(){

// Los keyframes de la familia viven en tokens/motion.css (foundations): el shell
// elige la alineacion, no declara el movimiento.
// Pila de capas: solo la de arriba responde a Escape (ov-4).
const stack = [];
let scrollLocks = 0;

const ALIGN = {
  center: { style: { alignItems: 'center', justifyContent: 'center', padding: 24 }, anim: 'flowOvCenter' },
  start: { style: { alignItems: 'flex-start', justifyContent: 'center', padding: '10vh 20px 20px' }, anim: 'flowOvCenter' },
  end: { style: { alignItems: 'stretch', justifyContent: 'flex-end' }, anim: 'flowOvEnd' },
  'side-start': { style: { alignItems: 'stretch', justifyContent: 'flex-start' }, anim: 'flowOvStart' },
  bottom: { style: { flexDirection: 'column', justifyContent: 'flex-end' }, anim: 'flowOvBottom' },
};

const FOCUSABLE = 'a[href],area[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),[tabindex]:not([tabindex="-1"])';
const SKIP = ['SCRIPT', 'STYLE', 'LINK', 'TEMPLATE', 'NOSCRIPT'];

/** Capa modal: backdrop, scroll lock, foco atrapado y devuelto, Escape, apilamiento. Ver contracts/overlay-shell.json. */
function OverlayShell({
  open = false, onClose, align = 'center', dismissOnBackdrop = true,
  labelledBy, label, fixed = true, zIndex = 100, children, backdropStyle,
}) {
  const panelRef = React.useRef(null);
  const backRef = React.useRef(null);
  const restoreRef = React.useRef(null);
  const tokenRef = React.useRef({});
  // onClose suele ser una arrow inline: en un ref, para que el efecto no se reinicie en cada render del padre.
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;
  const [depth, setDepth] = React.useState(0);

  React.useEffect(() => {
    if (!open) return;
    const token = tokenRef.current;
    stack.push(token);
    setDepth(stack.length - 1);
    restoreRef.current = document.activeElement;

    // ov-1: el foco entra al panel. Sincrono, con setTimeout solo como red.
    const focusIn = () => {
      const p = panelRef.current;
      if (!p || p.contains(document.activeElement)) return;
      const first = p.querySelector(FOCUSABLE);
      if (first) first.focus();
      else { p.setAttribute('tabindex', '-1'); p.focus(); }
    };
    focusIn();
    const t = setTimeout(focusIn, 0);

    // ov-3: el fondo no hace scroll y no es alcanzable por lector de pantalla.
    // Los hermanos se ocultan en el contenedor real del backdrop: body con portal, el marco con fixed=false.
    if (fixed) {
      scrollLocks += 1;
      if (scrollLocks === 1) document.body.style.overflow = 'hidden';
    }
    let hidden = [];
    const back = backRef.current;
    const container = back && back.parentNode;
    if (container) {
      hidden = Array.prototype.filter.call(container.children, (el) =>
        el !== back && !el.contains(back) && SKIP.indexOf(el.tagName) < 0 &&
        el.getAttribute('aria-hidden') !== 'true');
      hidden.forEach((el) => el.setAttribute('aria-hidden', 'true'));
    }

    const onKey = (e) => {
      if (stack[stack.length - 1] !== token) return;
      if (e.key === 'Escape') { e.stopPropagation(); closeRef.current && closeRef.current(); return; }
      // ov-2: Tab no escapa del panel
      if (e.key !== 'Tab') return;
      const p = panelRef.current;
      if (!p) return;
      const f = Array.prototype.filter.call(p.querySelectorAll(FOCUSABLE), (el) => el.offsetParent !== null);
      if (!f.length) { e.preventDefault(); return; }
      const first = f[0], last = f[f.length - 1];
      if (!p.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    };
    document.addEventListener('keydown', onKey, true);

    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey, true);
      const i = stack.indexOf(token);
      if (i > -1) stack.splice(i, 1);
      if (fixed) {
        scrollLocks = Math.max(0, scrollLocks - 1);
        if (scrollLocks === 0) document.body.style.overflow = '';
      }
      hidden.forEach((el) => el.removeAttribute('aria-hidden'));
      const b = restoreRef.current;
      if (b && b.focus && document.contains(b)) b.focus();
    };
  }, [open, fixed]);

  if (!open) return null;
  const cfg = ALIGN[align] || ALIGN.center;
  const child = React.Children.only(children);

  const panel = React.cloneElement(child, {
    ref: panelRef,
    role: child.props.role || 'dialog',
    'aria-modal': true,
    'aria-labelledby': labelledBy || undefined,
    'aria-label': !labelledBy ? label : undefined,
    className: [child.props.className, 'flow-ov-panel'].filter(Boolean).join(' '),
    style: Object.assign({}, child.props.style, {
      animation: cfg.anim + ' var(--dur-base) var(--ease-spring)',
    }),
  });

  const back = React.createElement('div', {
    ref: backRef,
    className: 'flow-ov-back',
    onClick: dismissOnBackdrop ? (e) => { if (e.target === e.currentTarget) closeRef.current && closeRef.current(); } : undefined,
    style: Object.assign({
      position: fixed ? 'fixed' : 'absolute', inset: 0,
      zIndex: zIndex + depth * 10,
      display: 'flex',
      background: 'var(--scrim)', backdropFilter: 'blur(4px)',
      animation: 'flowOvFade var(--dur-base) var(--ease-out)',
    }, cfg.style, backdropStyle),
  }, panel);

  // Portal solo cuando la capa es fija: con fixed=false vive dentro de su contenedor (marco de telefono).
  const RD = typeof window !== 'undefined' ? window.ReactDOM : null;
  return fixed && RD && RD.createPortal ? RD.createPortal(back, document.body) : back;
}

F.OverlayShell = OverlayShell;
})();

// ---- primitives/shells/ToggleControl.jsx ----
(function(){

/** Mecanica compartida de Checkbox, Radio y Switch. Ver contracts/toggle-control.json. */
let uid = 0;

function ToggleControl({
  type, checked = false, indeterminate = false, onChange, label, description,
  disabled = false, name, value, renderIndicator, style, ...rest
}) {
  // La descripcion tiene que llegar al control, no solo verse debajo (rdo-2).
  const auto = React.useId ? React.useId() : 'flow-tg-' + (++uid);
  const descId = description ? auto + '-desc' : undefined;
  const [focus, setFocus] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const state = { checked, indeterminate, focus, hover, press, disabled };

  return React.createElement('label', {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => { setHover(false); setPress(false); },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: 'inline-flex', alignItems: description ? 'flex-start' : 'center', gap: 10,
      // tg-1: el target incluye el label y no baja de 44px
      minHeight: 44, boxSizing: 'border-box',
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style,
    },
  },
    React.createElement('span', {
      style: { position: 'relative', display: 'inline-flex', flex: 'none', marginTop: description ? 2 : 0 },
    },
      // tg-2: control nativo real detras
      React.createElement('input', {
        type: type === 'radio' ? 'radio' : 'checkbox',
        role: type === 'switch' ? 'switch' : undefined,
        name, value, checked, disabled,
        'aria-describedby': descId,
        // tg-4: indeterminate va a la propiedad del DOM, no solo al dibujo
        ref: (el) => { if (el && type === 'checkbox') el.indeterminate = indeterminate; },
        onChange: (e) => {
          if (!onChange) return;
          onChange(type === 'radio' ? value : e.target.checked);
        },
        onFocus: () => setFocus(true),
        onBlur: () => setFocus(false),
        style: { position: 'absolute', opacity: 0, width: '100%', height: '100%', margin: 0, cursor: 'inherit' },
        ...rest,
      }),
      renderIndicator(state)
    ),
    (label || description) && React.createElement('span', { style: { display: 'flex', flexDirection: 'column', gap: 2 } },
      label && React.createElement('span', {
        style: { fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: description ? 600 : 400, color: 'var(--text-primary)' },
      }, label),
      description && React.createElement('span', {
        id: descId,
        style: { fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)' },
      }, description))
  );
}

F.ToggleControl = ToggleControl;
})();

// ---- primitives/shells/DataGrid.jsx ----
(function(){

const collator = new Intl.Collator('es');

/** La mecanica de una tabla. Ver contracts/data-grid.json. */
function DataGrid({
  columns = [], rows = [], rowKey, density = 'default', zebra = false,
  stickyHeader = false, sort: sortProp, defaultSort, onSortChange,
  selection, onSelectionChange, editable = false, onEdit,
  tree = false, childrenKey = 'children', renderDetail,
  onRowClick, selectedKey, emptyLabel, style, tableStyle,
}) {
  const [hoverKey, setHoverKey] = React.useState(null);
  const [sortState, setSortState] = React.useState(defaultSort || null);
  const [expanded, setExpanded] = React.useState(() => new Set());
  const [edit, setEdit] = React.useState(null); // {key, col, value}
  const sort = sortProp !== undefined ? sortProp : sortState;

  const py = density === 'dense' ? 10 : 14;
  const keyOf = (row, i) => (rowKey ? row[rowKey] : i);

  const setSort = (next) => {
    if (sortProp === undefined) setSortState(next);
    if (onSortChange) onSortChange(next);
  };

  const sorted = React.useMemo(() => {
    if (!sort || tree) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    const val = (r) => (col.sortValue ? col.sortValue(r) : r[sort.key]);
    return rows.slice().sort((a, b) => {
      const va = val(a), vb = val(b);
      if (va == null) return 1;
      if (vb == null) return -1;
      return (typeof va === 'number' && typeof vb === 'number' ? va - vb : collator.compare(String(va), String(vb))) * sort.dir;
    });
  }, [rows, sort, columns, tree]);

  // Arbol y filas de grupo se resuelven a una lista plana con depth
  const flat = React.useMemo(() => {
    if (!tree) return sorted.map((r) => ({ row: r, depth: 0 }));
    const out = [];
    const walk = (nodes, depth) => {
      nodes.forEach((n) => {
        out.push({ row: n, depth });
        const kids = n[childrenKey];
        if (kids && kids.length && expanded.has(rowKey ? n[rowKey] : n)) walk(kids, depth + 1);
      });
    };
    walk(sorted, 0);
    return out;
  }, [sorted, tree, expanded, childrenKey, rowKey]);

  const toggleExpand = (k) => setExpanded((prev) => {
    const n = new Set(prev);
    if (n.has(k)) n.delete(k); else n.add(k);
    return n;
  });

  const selectable = Array.isArray(selection);
  const allKeys = rows.filter((r) => !r.__group).map((r, i) => keyOf(r, i));
  const allOn = selectable && selection.length > 0 && selection.length === allKeys.length;
  const someOn = selectable && selection.length > 0 && !allOn;
  const toggleAll = () => onSelectionChange && onSelectionChange(allOn ? [] : allKeys);
  const toggleRow = (k) => {
    if (!onSelectionChange) return;
    onSelectionChange(selection.indexOf(k) > -1 ? selection.filter((x) => x !== k) : selection.concat([k]));
  };

  const utilityCol = (tree || renderDetail) ? 1 : 0;
  const nCols = columns.length + utilityCol + (selectable ? 1 : 0);

  const headCell = {
    padding: (py - 2) + 'px 16px', fontSize: 11, fontWeight: 600,
    letterSpacing: 'var(--tracking-overline)', textTransform: 'uppercase',
    color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)',
    background: 'var(--surface-sunken)', whiteSpace: 'nowrap',
    position: stickyHeader ? 'sticky' : undefined, top: stickyHeader ? 0 : undefined, zIndex: stickyHeader ? 2 : undefined,
  };

  const commitEdit = () => {
    if (edit && onEdit) onEdit(edit.key, edit.col, edit.value);
    setEdit(null);
  };

  return React.createElement('div', {
    style: {
      background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      // La tabla se separa de su tarjeta como cualquier otro bloque. Iba a sangre
      // contra el borde mientras el titulo de la tarjeta si respetaba --pad-card,
      // asi que la franja de cabecera parecia pegada al filo.
      padding: '0 var(--pad-card) var(--pad-card)',
      // El eje horizontal siempre desplaza: una tabla mas ancha que su contenedor
      // escondia la ultima columna sin scroll, y ahi viven los botones de accion
      // de cada fila. El vertical sigue dependiendo de la cabecera fija.
      overflowX: 'auto', overflowY: stickyHeader ? 'auto' : 'hidden',
      boxShadow: 'var(--shadow-rest)', ...style,
    },
  },
    React.createElement('table', {
      style: { width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 13, ...tableStyle },
    },
      React.createElement('thead', null,
        React.createElement('tr', null,
          selectable && React.createElement('th', {
            key: '__sel', scope: 'col', style: { ...headCell, width: 44, padding: (py - 2) + 'px 12px', textAlign: 'center' },
          },
            // dg-4: checkbox real con indeterminate en el header
            React.createElement(F.Checkbox, {
              checked: allOn, indeterminate: someOn, onChange: toggleAll,
              style: { minHeight: 0 },
            })),
          utilityCol ? React.createElement('th', {
            key: '__util', scope: 'col', style: { ...headCell, width: 40, padding: (py - 2) + 'px 0 ' + (py - 2) + 'px 12px' },
          }) : null,
          columns.map((c) => {
            const active = sort && sort.key === c.key;
            const st = {
              ...headCell, textAlign: c.align || 'left', width: c.width,
              color: active ? 'var(--text-accent)' : headCell.color,
            };
            if (!c.sortable) return React.createElement('th', { key: c.key, scope: 'col', style: st }, c.label);
            // dg-2: aria-sort y boton enfocable
            return React.createElement('th', {
              key: c.key, scope: 'col',
              'aria-sort': active ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none',
              style: { ...st, padding: 0 },
            },
              React.createElement('button', {
                type: 'button',
                onClick: () => setSort(active && sort.dir === -1 ? null : { key: c.key, dir: active ? -1 : 1 }),
                style: {
                  display: 'inline-flex', alignItems: 'center', gap: 3, width: '100%', border: 'none',
                  background: 'transparent', cursor: 'pointer', font: 'inherit', color: 'inherit',
                  letterSpacing: 'inherit', textTransform: 'inherit',
                  padding: (py - 2) + 'px 16px', justifyContent: c.align === 'right' ? 'flex-end' : 'flex-start',
                },
              },
                c.label,
                React.createElement('span', {
                  className: 'flow-symbol', 'aria-hidden': true,
                  style: {
                    fontSize: 14, opacity: active ? 1 : 0.35,
                    transform: active && sort.dir === -1 ? 'rotate(180deg)' : 'none',
                    transition: 'transform var(--dur-fast) var(--ease-spring), opacity var(--dur-fast) var(--ease-out)',
                  },
                }, 'arrow_upward')));
          }))),
      React.createElement('tbody', null,
        flat.length === 0 && emptyLabel
          ? React.createElement('tr', null, React.createElement('td', {
              colSpan: nCols,
              style: { padding: '28px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 },
            }, emptyLabel))
          : flat.map((entry, i) => {
              const row = entry.row;
              const k = keyOf(row, i);
              const isLast = i === flat.length - 1;

              // fila de grupo: encabezado de seccion dentro del cuerpo
              if (row.__group) {
                return React.createElement('tr', { key: '__g' + i },
                  React.createElement('td', {
                    colSpan: nCols,
                    style: {
                      padding: '12px 14px 6px', fontSize: 11, fontWeight: 700,
                      letterSpacing: 'var(--tracking-overline)', textTransform: 'uppercase',
                      color: 'var(--text-accent)',
                    },
                  }, row.__group));
              }

              const hovered = hoverKey === k;
              const isSel = selectable && selection.indexOf(k) > -1;
              const isPicked = selectedKey != null && selectedKey === k;
              const isOpen = renderDetail && expanded.has(k);
              const kids = tree && row[childrenKey] && row[childrenKey].length;
              const clickable = !!onRowClick || (!!renderDetail && !onRowClick);
              const bg = isSel || isPicked ? 'var(--surface-accent-subtle)'
                : hovered && (clickable || editable) ? 'var(--surface-sunken)'
                : zebra && i % 2 === 1 ? 'var(--surface-sunken)' : 'transparent';
              const bb = (isLast && !isOpen) ? 'none' : '1px solid var(--border-subtle)';

              const act = () => { if (onRowClick) onRowClick(row); else if (renderDetail) toggleExpand(k); };
              const main = React.createElement('tr', {
                key: k,
                onClick: clickable ? act : undefined,
                onMouseEnter: () => setHoverKey(k), onMouseLeave: () => setHoverKey(null),
                // dg-3: enfocable y operable con teclado
                tabIndex: clickable ? 0 : undefined,
                onKeyDown: clickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } } : undefined,
                style: {
                  cursor: clickable ? 'pointer' : 'default', background: bg,
                  boxShadow: isPicked ? 'inset 3px 0 0 var(--action-accent)' : 'none',
                  transition: 'background var(--dur-instant) var(--ease-out)', outline: 'none',
                },
              },
                selectable && React.createElement('td', {
                  key: '__sel',
                  onClick: (e) => e.stopPropagation(),
                  style: { width: 44, padding: py + 'px 12px', textAlign: 'center', borderBottom: bb },
                },
                  React.createElement(F.Checkbox, { checked: isSel, onChange: () => toggleRow(k), style: { minHeight: 0 } })),
                utilityCol ? React.createElement('td', {
                  key: '__util',
                  style: { width: 40, padding: py + 'px 0 ' + py + 'px 12px', borderBottom: bb },
                },
                  (tree ? !!kids : true) && React.createElement('button', {
                    type: 'button',
                    'aria-expanded': (tree ? expanded.has(k) : !!isOpen),
                    'aria-label': (tree ? expanded.has(k) : !!isOpen) ? 'Contraer' : 'Expandir',
                    onClick: (e) => { e.stopPropagation(); toggleExpand(k); },
                    style: {
                      border: 'none', background: 'transparent', cursor: 'pointer', padding: 0,
                      color: 'var(--text-muted)', display: 'inline-flex',
                      transform: (tree ? expanded.has(k) : isOpen) ? 'rotate(90deg)' : 'none',
                      transition: 'transform var(--dur-fast) var(--ease-spring)',
                    },
                  }, React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 18 } }, 'chevron_right'))) : null,
                columns.map((c, ci) => {
                  const editing = editable && c.editable && edit && edit.key === k && edit.col === c.key;
                  return React.createElement('td', {
                    key: c.key,
                    onDoubleClick: editable && c.editable ? () => setEdit({ key: k, col: c.key, value: row[c.key] }) : undefined,
                    style: {
                      padding: py + 'px 16px',
                      paddingLeft: tree && ci === 0 ? (entry.depth * 24 + 16) + 'px' : undefined,
                      textAlign: c.align || 'left',
                      fontFamily: c.mono ? 'var(--font-mono)' : 'var(--font-body)',
                      fontSize: c.mono ? 12.5 : 13,
                      color: 'var(--text-primary)', borderBottom: bb, whiteSpace: 'nowrap',
                      cursor: editable && c.editable ? 'text' : undefined,
                    },
                  },
                    // dg-5: Enter guarda, Escape cancela
                    editing ? React.createElement('input', {
                      autoFocus: true, type: 'text', value: edit.value,
                      onChange: (e) => setEdit({ ...edit, value: e.target.value }),
                      onBlur: commitEdit,
                      onKeyDown: (e) => {
                        if (e.key === 'Enter') { e.preventDefault(); commitEdit(); }
                        if (e.key === 'Escape') { e.preventDefault(); setEdit(null); }
                      },
                      style: {
                        width: '100%', minHeight: 32, boxSizing: 'border-box',
                        border: '1.5px solid var(--border-focus)', borderRadius: 'var(--radius-sm)',
                        padding: '0 8px', font: 'inherit', color: 'inherit', outline: 'none',
                        boxShadow: 'var(--focus-ring)',
                      },
                    }) : React.createElement('span', {
                      style: { display: 'inline-flex', alignItems: 'center', gap: 8 },
                    },
                      c.render ? c.render(row) : row[c.key],
                      editable && c.editable && hovered && React.createElement('span', {
                        className: 'flow-symbol', 'aria-hidden': true,
                        style: { fontSize: 14, color: 'var(--text-muted)', opacity: 0.6, flexShrink: 0 },
                      }, 'edit')));
                }));

              if (!isOpen) return main;
              return [main, React.createElement('tr', { key: k + '__d' },
                React.createElement('td', {
                  colSpan: nCols,
                  style: {
                    padding: '14px 16px 16px 52px', background: 'var(--surface-sunken)',
                    borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
                  },
                }, renderDetail(row)))];
            }))));
}

F.DataGrid = DataGrid;
})();

// ---- primitives/Field.jsx ----
(function(){

let uid = 0;

/** Etiqueta, control, ayuda y error. Ver contracts/field.json.
 *  Asocia por su cuenta: si el consumidor no pasa htmlFor, Field genera el id,
 *  lo inyecta en su hijo y referencia el mensaje. Antes, un Field sin htmlFor
 *  dejaba la etiqueta huerfana en silencio, y cuatro de seis campos de la card
 *  de formularios estaban asi.
 */
function Field({ label, htmlFor, required = false, help, error, children, style }) {
  const auto = React.useId ? React.useId() : 'flow-fld-' + (++uid);
  const hijo = React.isValidElement(children) ? children : null;
  const id = htmlFor || (hijo && hijo.props.id) || (hijo ? auto : undefined);
  const msgId = (error || help) ? auto + '-msg' : undefined;

  const control = hijo
    ? React.cloneElement(hijo, {
        id,
        // Nombres DOM estandar: los controles los reenvian con ...rest a su
        // elemento de campo. Un nombre inventado obligaria a mapearlo en cada uno.
        'aria-describedby': [hijo.props['aria-describedby'], msgId].filter(Boolean).join(' ') || undefined,
        invalid: hijo.props.invalid || !!error || undefined,
        required: hijo.props.required || required || undefined,
      })
    : children;

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, ...style } },
    label && React.createElement('label', {
      htmlFor: id,
      style: { font: 'var(--type-body)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' },
    }, label,
      // El asterisco esta oculto al lector: el control ya dice que es requerido.
      required && React.createElement('span', { 'aria-hidden': true, style: { color: 'var(--text-accent)' } }, ' *')),
    control,
    (error || help) && React.createElement('div', {
      id: msgId,
      role: error ? 'alert' : undefined,
      style: {
        font: 'var(--type-caption)',
        color: error ? 'var(--status-danger-text)' : 'var(--text-muted)',
        display: 'flex', alignItems: 'center', gap: 4,
      },
    },
      error && React.createElement('span', { className: 'flow-symbol', style: { fontSize: 14 }, 'aria-hidden': true }, 'error'),
      error || help)
  );
}

F.Field = Field;
})();

// ---- primitives/Input.jsx ----
(function(){

function Input({
  id, value, onChange, placeholder, type = 'text', icon, suffix,
  revealable = false, disabled = false, invalid = false, mono = false, size = 'md', style, ...rest
}) {
  const [shown, setShown] = React.useState(false);
  // El ojo vive aqui: revelar es una prestacion del control, no un componente aparte.
  const reveal = revealable && React.createElement('button', {
    type: 'button', tabIndex: 0,
    'aria-label': shown ? 'Ocultar' : 'Mostrar',
    'aria-pressed': shown,
    onClick: () => setShown((v) => !v),
    style: {
      // base-3: 44px de target. El margen negativo evita que crezca el padding visual.
      width: 44, height: 44, margin: '0 -12px 0 0', padding: 0, flexShrink: 0,
      border: 'none', background: 'transparent', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--text-muted)',
    },
  }, React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 20 } }, shown ? 'visibility_off' : 'visibility'));

  return React.createElement(F.ControlShell, {
    size, invalid, disabled, leading: icon, trailing: reveal || suffix, style,
  },
    React.createElement('input', {
      id, value, placeholder, disabled,
      type: revealable ? (shown ? 'text' : 'password') : type,
      'aria-invalid': invalid || undefined,
      onChange: (e) => onChange && onChange(e.target.value),
      style: {
        flex: 1, minWidth: 0, alignSelf: 'stretch', border: 'none', outline: 'none', background: 'transparent',
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)', fontSize: 14,
        color: 'var(--text-primary)', padding: 0,
      },
      ...rest,
    })
  );
}

F.Input = Input;
})();

// ---- primitives/Textarea.jsx ----
(function(){

function Textarea({ id, value, onChange, placeholder, rows = 3, maxLength, disabled = false, invalid = false, style, ...rest }) {
  const count = maxLength != null && value != null;
  return React.createElement(F.ControlShell, {
    multiline: true, invalid, disabled, style,
    footer: count && React.createElement('span', {
      style: { fontFamily: 'var(--font-mono)', fontSize: 11, color: value.length >= maxLength ? 'var(--status-danger-text)' : 'var(--text-muted)' },
    }, value.length + '/' + maxLength),
  },
    React.createElement('textarea', {
      id, value, placeholder, rows, maxLength, disabled,
      'aria-invalid': invalid || undefined,
      onChange: (e) => onChange && onChange(e.target.value),
      style: {
        flex: 1, minWidth: 0, width: '100%', boxSizing: 'border-box', resize: 'vertical',
        border: 'none', outline: 'none', background: 'transparent', padding: 0,
        fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.55, color: 'var(--text-primary)',
      },
      ...rest,
    })
  );
}

F.Textarea = Textarea;
})();

// ---- primitives/Select.jsx ----
(function(){

let uid = 0;

/** Seleccion de una lista conocida. Ver contracts/select.json. */
function Select({
  id, value, onChange, options = [], placeholder = 'Selecciona…',
  multiple = false, searchable = false, creatable = false, clearable = false, renderOption,
  icon, size = 'md', disabled = false, invalid = false, emptyLabel = 'Sin resultados', style, ...rest
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [activeId, setActiveId] = React.useState(undefined);
  const anchorRef = React.useRef(null);
  const fieldRef = React.useRef(null);
  const listRef = React.useRef(null);
  const lbId = React.useRef('flow-lb-' + (++uid)).current;
  const onActiveIdChange = React.useCallback((v) => setActiveId(v), []);

  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const typing = searchable || creatable;
  const arr = Array.isArray(value) ? value : [];
  const sel = items.filter((o) => (multiple ? arr.indexOf(o.value) > -1 : o.value === value));

  const label = multiple
    ? (arr.length ? arr.length + ' seleccionado' + (arr.length > 1 ? 's' : '') : placeholder)
    : (sel[0] ? sel[0].label : placeholder);
  const filled = multiple ? arr.length > 0 : !!sel[0];

  const close = () => { setOpen(false); setQuery(''); };
  const commit = (v) => {
    onChange && onChange(v);
    if (!multiple) { close(); if (fieldRef.current) fieldRef.current.focus(); }
  };

  const onKeyDown = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      if (e.key === ' ' && typing) return;
      e.preventDefault(); setOpen(true); return;
    }
    if (open && listRef.current && listRef.current.onKeyDown(e)) return;
    if (e.key === 'Tab' && open) close();
  };

  const q = typing ? query : '';
  const known = items.some((o) => o.label.toLowerCase() === q.trim().toLowerCase());
  const extraRow = creatable && q.trim() && !known
    ? React.createElement('div', {
        role: 'option', 'aria-selected': false, onMouseDown: (e) => e.preventDefault(),
        onClick: () => commit(q.trim()),
        style: {
          display: 'flex', alignItems: 'center', gap: 8, minHeight: 44, flexShrink: 0, boxSizing: 'border-box',
          padding: '10px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
          font: 'var(--type-body)', color: 'var(--text-accent)',
        },
      },
        React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 18 } }, 'add'),
        React.createElement('span', null, 'Usar «' + q.trim() + '»'))
    : null;

  // El trigger tambien puede llevar adorno propio: renderOption recibe trigger:true.
  const triggerNode = renderOption && !multiple && sel[0] && !open
    ? renderOption(sel[0], { active: false, selected: true, trigger: true })
    : null;

  const field = typing
    ? React.createElement('input', {
        id, ref: fieldRef, type: 'text',
        role: 'combobox', 'aria-expanded': open, 'aria-controls': lbId,
        'aria-activedescendant': open ? activeId : undefined,
        'aria-invalid': invalid || undefined, 'aria-autocomplete': 'list',
        disabled, placeholder: filled && !open ? undefined : placeholder,
        value: open ? query : (multiple ? (arr.length ? label : '') : (sel[0] ? sel[0].label : '')),
        onChange: (e) => { setQuery(e.target.value); setOpen(true); },
        onMouseDown: () => setOpen(true),
        onKeyDown,
        style: {
          flex: 1, minWidth: 0, alignSelf: 'stretch', border: 'none', outline: 'none', background: 'transparent', padding: 0,
          font: 'var(--type-body)', color: filled || open ? 'var(--text-primary)' : 'var(--text-muted)',
          textOverflow: 'ellipsis',
        },
        ...rest,
      })
    : React.createElement('button', {
        id, ref: fieldRef, type: 'button', disabled,
        role: 'combobox', 'aria-expanded': open, 'aria-controls': lbId, 'aria-haspopup': 'listbox',
        'aria-activedescendant': open ? activeId : undefined, 'aria-invalid': invalid || undefined,
        onClick: () => (open ? close() : setOpen(true)),
        onKeyDown,
        style: {
          flex: 1, minWidth: 0, alignSelf: 'stretch', display: 'flex', alignItems: 'center', gap: 8,
          border: 'none', outline: 'none', background: 'transparent', padding: 0,
          font: 'var(--type-body)', textAlign: 'left', cursor: disabled ? 'not-allowed' : 'pointer',
          color: filled ? 'var(--text-primary)' : 'var(--text-muted)',
        },
        ...rest,
      },
        renderOption && sel[0] ? renderOption(sel[0], { active: false, selected: true, trigger: true })
          : React.createElement('span', { style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, label));

  return React.createElement(React.Fragment, null,
    React.createElement(F.ControlShell, {
      ref: anchorRef, size, invalid, disabled, leading: icon || (typing ? triggerNode : null), style,
      onShellClick: () => { if (!disabled && fieldRef.current) fieldRef.current.focus(); },
      trailing: React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 } },
        clearable && filled && !open && React.createElement('button', {
          type: 'button', 'aria-label': 'Limpiar seleccion',
          // El boton vive en la zona trailing de la carcasa: un control no dibuja
          // nada encima de su propia area.
          onClick: (e) => { e.stopPropagation(); onChange && onChange(multiple ? [] : undefined); },
          style: {
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            // El glifo mide 16px; el area operable, --hit-target-min. Se estira al
            // alto interior de la carcasa en vez de fijar una caja pequena (a11y-2).
            width: 'var(--hit-target-min)', alignSelf: 'stretch', flexShrink: 0,
            border: 'none', borderRadius: 'var(--radius-pill)',
            background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: 0,
          },
        }, React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 16 } }, 'close')),
        React.createElement('span', {
          className: 'flow-symbol', 'aria-hidden': true,
          style: {
            fontSize: 22, flexShrink: 0, color: 'var(--text-muted)',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform var(--dur-fast) var(--ease-spring)',
          },
        }, 'expand_more')),
    }, field),
    React.createElement(F.Popover, {
      open, onOpenChange: (v) => (v ? setOpen(true) : close()),
      anchorRef, returnFocusRef: fieldRef, minWidth: 220,
    },
      React.createElement(F.Listbox, {
        ref: listRef, idPrefix: lbId, items, value, multiple, query: q,
        onSelect: commit, renderItem: renderOption, emptyLabel, extraRow, onActiveIdChange,
      })
    )
  );
}

F.Select = Select;
})();

// ---- primitives/Checkbox.jsx ----
(function(){

function Checkbox({ checked = false, onChange, label, disabled = false, indeterminate = false, style }) {
  return React.createElement(F.ToggleControl, {
    type: 'checkbox', checked, indeterminate, onChange, label, disabled, style,
    renderIndicator: (s) => React.createElement('span', {
      'aria-hidden': true,
      style: {
        width: 22, height: 22, borderRadius: 'var(--radius-xs)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: s.checked || s.indeterminate ? 'var(--action-accent)' : 'var(--surface-card)',
        border: s.checked || s.indeterminate ? '1.5px solid var(--action-accent)' : '1.5px solid ' + (s.hover ? 'var(--border-strong)' : 'var(--border-default)'),
        boxShadow: s.focus ? 'var(--focus-ring)' : 'none',
        transform: s.hover && !s.disabled ? 'var(--hover-scale)' : 'none',
        transition: 'all var(--dur-fast) var(--ease-spring)',
      },
    }, (s.checked || s.indeterminate) && React.createElement('span', {
      className: 'flow-symbol',
      style: { fontSize: 16, color: 'var(--text-on-inverse)', fontVariationSettings: "'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 20", animation: 'flowScaleIn var(--dur-fast) var(--ease-spring)' },
    }, s.indeterminate ? 'remove' : 'check')),
  });
}

F.Checkbox = Checkbox;
})();

// ---- primitives/Radio.jsx ----
(function(){

function Radio({ name, value, checked = false, onChange, label, description, disabled = false, style }) {
  return React.createElement(F.ToggleControl, {
    type: 'radio', name, value, checked, onChange, label, description, disabled, style,
    renderIndicator: (s) => React.createElement('span', {
      'aria-hidden': true,
      style: {
        width: 22, height: 22, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--surface-card)',
        border: s.checked ? '1.5px solid var(--action-accent)' : '1.5px solid ' + (s.hover ? 'var(--border-strong)' : 'var(--border-default)'),
        boxShadow: s.focus ? 'var(--focus-ring)' : 'none',
        transform: s.hover && !s.disabled ? 'var(--hover-scale)' : 'none',
        transition: 'all var(--dur-fast) var(--ease-spring)',
      },
    }, React.createElement('span', {
      style: {
        width: 11, height: 11, borderRadius: '50%', background: 'var(--action-accent)',
        transform: s.checked ? 'scale(1)' : 'scale(0)',
        transition: 'transform var(--dur-fast) var(--ease-spring)',
      },
    })),
  });
}

F.Radio = Radio;
})();

// ---- primitives/Switch.jsx ----
(function(){

function Switch({ checked = false, onChange, label, disabled = false, style }) {
  return React.createElement(F.ToggleControl, {
    type: 'switch', checked, onChange, label, disabled, style,
    renderIndicator: (s) => React.createElement('span', {
      'aria-hidden': true,
      style: {
        width: 48, height: 28, borderRadius: 999, padding: 3, boxSizing: 'border-box', display: 'flex',
        background: s.checked ? 'var(--action-accent)' : 'var(--border-strong)',
        boxShadow: s.focus ? 'var(--focus-ring)' : 'none',
        transition: 'background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      },
    }, React.createElement('span', {
      style: {
        width: s.press ? 26 : 22, height: 22, borderRadius: 'var(--radius-pill)', background: 'var(--surface-card)',
        boxShadow: 'var(--shadow-thumb)',
        transform: s.checked ? 'translateX(' + (s.press ? 16 : 20) + 'px)' : 'none',
        transition: 'transform var(--dur-fast) var(--ease-spring), width var(--dur-instant) var(--ease-out)',
      },
    })),
  });
}

F.Switch = Switch;
})();

// ---- primitives/Slider.jsx ----
(function(){

function Slider({ value = 0, onChange, min = 0, max = 100, step = 1, label, format, disabled = false, style }) {
  const [drag, setDrag] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const pct = ((value - min) / (max - min)) * 100;
  const fmt = format ? format(value) : String(value);
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8, ...style } },
    (label != null) && React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } },
      React.createElement('span', { style: { fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' } }, label),
      React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: drag ? 'var(--text-accent)' : 'var(--text-secondary)', transition: 'color var(--dur-fast) var(--ease-out)' } }, fmt)),
    // El carril entero es el objetivo, y mide --hit-target-min de alto aunque el
    // pulgar se dibuje de 22px: antes el area arrastrable eran 28px (sld-2).
    React.createElement('div', { style: { position: 'relative', height: 'var(--hit-target-min)', display: 'flex', alignItems: 'center', opacity: disabled ? 0.5 : 1 } },
      React.createElement('div', { style: { position: 'absolute', left: 0, right: 0, height: 6, borderRadius: 999, background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)' } }),
      React.createElement('div', { style: { position: 'absolute', left: 0, width: pct + '%', height: 6, borderRadius: 999, background: 'var(--action-accent)' } }),
      React.createElement('div', {
        'aria-hidden': true,
        style: {
          position: 'absolute', left: 'calc(' + pct + '% - 11px)', width: 22, height: 22, borderRadius: '50%',
          background: 'var(--surface-card)', border: '2px solid var(--action-accent)',
          boxShadow: focus ? 'var(--focus-ring)' : drag ? 'var(--shadow-accent-glow)' : 'var(--shadow-thumb)',
          transform: drag ? 'scale(1.25)' : 'scale(1)', pointerEvents: 'none',
          transition: 'transform var(--dur-fast) var(--ease-spring), box-shadow var(--dur-fast) var(--ease-out)',
        },
      }),
      React.createElement('input', {
        type: 'range', min, max, step, value, disabled, 'aria-label': typeof label === 'string' ? label : undefined,
        // El rango nativo ya expone valuenow, min y max. Lo que no puede saber es
        // la unidad: '40' y '40 km' no son lo mismo al oido (sld-3).
        'aria-valuetext': format ? fmt : undefined,
        onChange: (e) => onChange && onChange(Number(e.target.value)),
        onMouseDown: () => setDrag(true), onMouseUp: () => setDrag(false),
        onTouchStart: () => setDrag(true), onTouchEnd: () => setDrag(false),
        onFocus: () => setFocus(true), onBlur: () => { setFocus(false); setDrag(false); },
        style: { position: 'absolute', inset: 0, width: '100%', opacity: 0, cursor: disabled ? 'not-allowed' : 'grab', margin: 0 },
      })
    )
  );
}

F.Slider = Slider;
})();

// ---- components/DatePicker.jsx ----
(function(){

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS = ['L','M','X','J','V','S','D'];
const pad = (n) => String(n).padStart(2, '0');
const iso = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const parse = (s) => (s ? new Date(s + 'T00:00:00') : null);
const corto = (s) => { const d = parse(s); return d ? pad(d.getDate()) + ' ' + MESES[d.getMonth()].slice(0, 3).toLowerCase() : ''; };

/** El unico calendario del sistema. mode cambia la forma del valor, no la piel:
 *  'single' recibe y devuelve un ISO; 'range' recibe y devuelve {from, to}.
 *  Ver contracts/datepicker.json. Absorbe DateRangePicker.
 */
function DatePicker({
  id, mode = 'single', value, onChange, placeholder, min, max,
  presets = mode === 'range', disabled = false, invalid = false, style, ...rest
}) {
  const rango = mode === 'range';
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const gridRef = React.useRef(null);
  const hoy = new Date();
  const v = rango ? (value || {}) : value;
  const desde = rango ? v.from : v;
  const [vista, setVista] = React.useState(() => parse(desde) || hoy);

  const y = vista.getFullYear(), m = vista.getMonth();
  const primerDow = (new Date(y, m, 1).getDay() + 6) % 7; // lunes primero
  const dias = new Date(y, m + 1, 0).getDate();
  const celdas = [];
  for (let i = 0; i < primerDow; i++) celdas.push(null);
  for (let d = 1; d <= dias; d++) celdas.push(new Date(y, m, d));

  const fuera = (d) => (min && iso(d) < min) || (max && iso(d) > max);
  const etiqueta = rango
    ? (v.from ? corto(v.from) + ' — ' + (v.to ? corto(v.to) : '…') : null)
    : (value ? pad(parse(value).getDate()) + ' ' + MESES[parse(value).getMonth()].slice(0, 3).toLowerCase() + ' ' + parse(value).getFullYear() : null);

  const elegir = (d) => {
    const s = iso(d);
    if (!rango) { onChange && onChange(s); cerrar(); return; }
    if (!v.from || (v.from && v.to)) onChange && onChange({ from: s, to: undefined });
    else if (s < v.from) onChange && onChange({ from: s, to: v.from });
    else { onChange && onChange({ from: v.from, to: s }); cerrar(); }
  };
  const cerrar = () => { setOpen(false); if (triggerRef.current) triggerRef.current.focus(); };
  const atajo = (n) => {
    const to = iso(hoy);
    const f = new Date(hoy); f.setDate(f.getDate() - n + 1);
    onChange && onChange({ from: iso(f), to }); cerrar();
  };

  const esExtremo = (s) => rango ? (s === v.from || s === v.to) : s === value;
  const enMedio = (s) => rango && v.from && v.to && s > v.from && s < v.to;
  // El dia que recibe el foco al tabular: el seleccionado, o hoy, o el primero.
  const foco = celdas.find((d) => d && esExtremo(iso(d))) || celdas.find((d) => d && iso(d) === iso(hoy)) || celdas.find(Boolean);

  // Teclado de rejilla: el calendario se recorre con flechas, no solo con Tab.
  const teclas = (e) => {
    const paso = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    const btns = gridRef.current ? [...gridRef.current.querySelectorAll('button[data-dia]:not([disabled])')] : [];
    const at = btns.indexOf(document.activeElement);
    if (paso != null) {
      e.preventDefault();
      if (at < 0) { btns[0] && btns[0].focus(); return; }
      const next = btns[at + paso];
      if (next) next.focus();
      else setVista(new Date(y, m + (paso < 0 ? -1 : 1), 1));
    } else if (e.key === 'Home') { e.preventDefault(); btns[0] && btns[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); btns[btns.length - 1] && btns[btns.length - 1].focus(); }
    else if (e.key === 'PageUp' || e.key === 'PageDown') { e.preventDefault(); setVista(new Date(y, m + (e.key === 'PageUp' ? -1 : 1), 1)); }
  };

  const nav = (dir) => React.createElement('button', {
    type: 'button', 'aria-label': dir < 0 ? 'Mes anterior' : 'Mes siguiente',
    onClick: () => setVista(new Date(y, m + dir, 1)),
    style: {
      // Objetivo tactil completo: el glifo mide 20, el area --hit-target-min.
      width: 'var(--hit-target-min)', height: 'var(--hit-target-min)',
      border: 'none', background: 'transparent', borderRadius: 'var(--radius-pill)',
      cursor: 'pointer', color: 'var(--text-secondary)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background var(--dur-instant) var(--ease-out)',
    },
    onMouseEnter: (e) => { e.currentTarget.style.background = 'var(--surface-sunken)'; },
    onMouseLeave: (e) => { e.currentTarget.style.background = 'transparent'; },
  }, React.createElement('span', { className: 'flow-symbol', style: { fontSize: 20 }, 'aria-hidden': true }, dir < 0 ? 'chevron_left' : 'chevron_right'));

  return React.createElement(React.Fragment, null,
    React.createElement(F.ControlShell, {
      ref: anchorRef, invalid, disabled, style,
      leading: rango ? 'date_range' : 'calendar_month',
      onShellClick: () => { if (!disabled && triggerRef.current) triggerRef.current.focus(); },
    },
      React.createElement('button', {
        id, ref: triggerRef, type: 'button', disabled,
        'aria-haspopup': 'dialog', 'aria-expanded': open, 'aria-invalid': invalid || undefined,
        onClick: () => setOpen((o) => !o),
        style: {
          flex: 1, minWidth: 0, alignSelf: 'stretch', display: 'flex', alignItems: 'center',
          border: 'none', outline: 'none', background: 'transparent', padding: 0,
          textAlign: 'left', cursor: disabled ? 'not-allowed' : 'pointer',
          font: etiqueta && rango ? 'var(--type-data)' : 'var(--type-body)',
          color: etiqueta ? 'var(--text-primary)' : 'var(--text-muted)',
        },
        ...rest,
      },
        // El recorte va en un span interior, no en el boton: text-overflow no se
        // aplica al texto directo de un contenedor flex, asi que las tres
        // propiedades puestas en el boton cortaban sin puntos suspensivos.
        React.createElement('span', {
          style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        }, etiqueta || placeholder || (rango ? 'Rango de fechas' : 'Selecciona fecha')))),
    React.createElement(F.Popover, {
      open, onOpenChange: (o) => (o ? setOpen(true) : cerrar()),
      anchorRef, returnFocusRef: triggerRef,
      matchAnchorWidth: false, minWidth: 336, autoFocus: true,
    },
      React.createElement('div', { role: 'dialog', 'aria-label': rango ? 'Rango de fechas' : 'Calendario', style: { padding: 14 } },
        presets && React.createElement('div', { style: { display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' } },
          [7, 30, 90].map((n) => React.createElement('button', {
            key: n, type: 'button', onClick: () => atajo(n),
            style: {
              minHeight: 'var(--hit-target-min)', padding: '0 14px',
              border: '1px solid var(--border-default)', background: 'var(--surface-card)',
              borderRadius: 'var(--radius-pill)', cursor: 'pointer',
              font: 'var(--type-caption)', fontWeight: 600, color: 'var(--text-secondary)',
            },
            onMouseEnter: (e) => { e.currentTarget.style.background = 'var(--surface-sunken)'; },
            onMouseLeave: (e) => { e.currentTarget.style.background = 'var(--surface-card)'; },
          }, 'Ultimos ' + n + ' dias'))),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 } },
          nav(-1),
          React.createElement('span', { style: { font: 'var(--type-body-strong)' } }, MESES[m] + ' ' + y),
          nav(1)),
        React.createElement('div', {
          ref: gridRef, role: 'grid', onKeyDown: teclas,
          style: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 },
        },
          DIAS.map((d) => React.createElement('span', {
            key: d, role: 'columnheader',
            style: { textAlign: 'center', font: 'var(--type-overline)', color: 'var(--text-muted)', padding: '6px 0' },
          }, d)),
          celdas.map((d, i) => {
            if (!d) return React.createElement('span', { key: 'e' + i });
            const s = iso(d);
            const ext = esExtremo(s), medio = enMedio(s), off = fuera(d);
            const esHoy = s === iso(hoy);
            return React.createElement('button', {
              key: i, type: 'button', disabled: off, 'data-dia': s,
              tabIndex: d === foco ? 0 : -1,
              'aria-current': esHoy ? 'date' : undefined,
              'aria-pressed': ext || undefined,
              onClick: () => elegir(d),
              style: {
                height: 'var(--hit-target-min)', border: 'none', cursor: off ? 'not-allowed' : 'pointer',
                borderRadius: rango && ext && v.to
                  ? (s === v.from ? 'var(--radius-pill) 0 0 var(--radius-pill)' : '0 var(--radius-pill) var(--radius-pill) 0')
                  : medio ? 0 : 'var(--radius-pill)',
                font: 'var(--type-body)', fontWeight: ext ? 700 : 400,
                background: ext ? 'var(--action-accent)' : medio ? 'var(--surface-accent-subtle)' : 'transparent',
                color: ext ? 'var(--text-on-accent)' : off ? 'var(--text-muted)' : medio ? 'var(--text-accent)' : 'var(--text-primary)',
                opacity: off ? 0.5 : 1,
                // Hoy se marca con un anillo interior. No va en boxShadow porque el
                // anillo de foco tambien lo usa y un estilo inline le ganaria a la
                // regla de :focus-visible: el dia enfocado quedaria sin indicador.
                outline: esHoy && !ext ? '1.5px solid var(--border-strong)' : 'none',
                outlineOffset: '-1.5px',
                transition: 'transform var(--dur-instant) var(--ease-spring), background var(--dur-instant) var(--ease-out)',
              },
              onMouseEnter: (e) => { if (!ext && !off && !medio) { e.currentTarget.style.background = 'var(--surface-sunken)'; } },
              onMouseLeave: (e) => { if (!ext && !medio) { e.currentTarget.style.background = 'transparent'; } },
            }, d.getDate());
          }))))
  );
}

F.DatePicker = DatePicker;
})();

// ---- components/FileUpload.jsx ----
(function(){

/** Controlled file dropzone. files: [{name, size?}] */
function FileUpload({ files = [], onChange, label = 'Arrastra archivos o haz clic', hint, accept, multiple = true, disabled = false, style }) {
  const [drag, setDrag] = React.useState(false);
  const inputRef = React.useRef(null);
  const add = (list) => {
    const arr = Array.from(list).map(f => ({ name: f.name, size: f.size }));
    onChange && onChange(multiple ? [...files, ...arr] : arr.slice(0, 1));
  };
  const fmt = (b) => b == null ? '' : b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'var(--font-body)', ...style } },
    React.createElement('div', {
      role: 'button', tabIndex: disabled ? -1 : 0, 'aria-label': label,
      onClick: () => !disabled && inputRef.current && inputRef.current.click(),
      onKeyDown: (e) => { if (e.key === 'Enter' && !disabled) inputRef.current.click(); },
      onDragOver: (e) => { e.preventDefault(); if (!disabled) setDrag(true); },
      onDragLeave: () => setDrag(false),
      onDrop: (e) => { e.preventDefault(); setDrag(false); if (!disabled) add(e.dataTransfer.files); },
      style: {
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: '28px 20px', borderRadius: 'var(--radius-lg)', cursor: disabled ? 'not-allowed' : 'pointer',
        border: '1.5px dashed ' + (drag ? 'var(--border-focus)' : 'var(--border-default)'),
        background: drag ? 'var(--surface-accent-subtle)' : 'var(--surface-sunken)',
        opacity: disabled ? 0.5 : 1, outline: 'none', textAlign: 'center',
        transform: drag ? 'scale(1.01)' : 'none',
        transition: 'all var(--dur-fast) var(--ease-spring)',
      },
    },
      React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 30, color: drag ? 'var(--text-accent)' : 'var(--text-muted)', transition: 'color var(--dur-fast) var(--ease-out)' } }, 'upload_file'),
      React.createElement('span', { style: { fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' } }, label),
      hint && React.createElement('span', { style: { fontSize: 12, color: 'var(--text-muted)' } }, hint),
      React.createElement('input', { ref: inputRef, type: 'file', accept, multiple, disabled, onChange: (e) => add(e.target.files), style: { display: 'none' } })),
    files.length > 0 && React.createElement('ul', { style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 } },
      files.map((f, i) => React.createElement('li', {
        key: f.name + i,
        style: { display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 14px', animation: 'flowIn var(--dur-fast) var(--ease-out)' },
      },
        React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 20, color: 'var(--text-muted)' } }, 'draft'),
        React.createElement('span', { style: { flex: 1, fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, f.name),
        React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' } }, fmt(f.size)),
        React.createElement('button', {
          type: 'button', 'aria-label': 'Quitar ' + f.name,
          onClick: () => onChange && onChange(files.filter((_, j) => j !== i)),
          style: { border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'inline-flex', padding: 4, borderRadius: '50%' },
        }, React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 18 } }, 'close'))))));
}

F.FileUpload = FileUpload;
})();

// ---- components/OTPInput.jsx ----
(function(){

/** One-time code input. Renders N boxes driven by a single hidden input (autocomplete one-time-code). */
function OTPInput({ length = 6, value = '', onChange, onComplete, invalid = false, disabled = false, autoFocus = false, style }) {
  const ref = React.useRef(null);
  const [focus, setFocus] = React.useState(false);
  const digits = value.slice(0, length).split('');
  const active = Math.min(value.length, length - 1);

  const set = (v) => {
    const clean = v.replace(/\D/g, '').slice(0, length);
    onChange && onChange(clean);
    if (clean.length === length && onComplete) onComplete(clean);
  };

  return React.createElement('div', {
    onClick: () => ref.current && ref.current.focus(),
    style: { position: 'relative', display: 'inline-flex', gap: 8, cursor: disabled ? 'not-allowed' : 'text', animation: invalid ? 'flowShake 320ms var(--ease-out)' : 'none', ...style },
  },
    Array.from({ length }, (_, i) => {
      const filled = digits[i] != null;
      const isActive = focus && i === active && !disabled;
      return React.createElement('div', {
        key: i, 'aria-hidden': true,
        style: {
          width: 44, height: 52, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
          border: invalid ? '1.5px solid var(--status-danger)' : isActive ? '1.5px solid var(--border-focus)' : '1px solid ' + (filled ? 'var(--border-strong)' : 'var(--border-default)'),
          boxShadow: isActive ? 'var(--focus-ring)' : 'none',
          fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 600, color: 'var(--text-primary)',
          transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
        },
      },
        filled ? React.createElement('span', { style: { animation: 'flowPop var(--dur-fast) var(--ease-spring)' } }, digits[i])
          : isActive ? React.createElement('span', { style: { width: 2, height: 24, background: 'var(--action-accent)', borderRadius: 2 } }) : null);
    }),
    React.createElement('input', {
      ref, type: 'text', inputMode: 'numeric', autoComplete: 'one-time-code', pattern: '[0-9]*',
      'aria-label': 'Codigo de ' + length + ' digitos', value, disabled, autoFocus,
      onChange: (e) => set(e.target.value),
      onFocus: () => setFocus(true), onBlur: () => setFocus(false),
      style: { position: 'absolute', inset: 0, width: '100%', opacity: 0, border: 'none', fontSize: 16 },
    }));
}

F.OTPInput = OTPInput;
})();

// ---- components/PasscodeKeypad.jsx ----
(function(){

/** Numeric keypad + dots for mobile passcode. */
function PasscodeKeypad({ length = 6, value = '', onChange, onComplete, invalid = false, biometricIcon, onBiometric, style }) {
  const press = (d) => {
    if (d === 'back') { onChange && onChange(value.slice(0, -1)); return; }
    if (value.length >= length) return;
    const v = value + d;
    onChange && onChange(v);
    if (v.length === length && onComplete) setTimeout(() => onComplete(v), 120);
  };
  const key = (content, onClick, aria) => React.createElement('button', {
    type: 'button', 'aria-label': aria, onClick,
    onMouseDown: (e) => e.currentTarget.style.transform = 'scale(0.92)',
    onMouseUp: (e) => e.currentTarget.style.transform = 'none',
    onMouseLeave: (e) => e.currentTarget.style.transform = 'none',
    style: {
      width: 72, height: 72, borderRadius: '50%', border: 'none', cursor: 'pointer',
      background: 'var(--surface-card)', color: 'var(--text-primary)',
      fontFamily: 'var(--font-body)', fontSize: 24, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: 'var(--shadow-rest)', transition: 'transform var(--dur-instant) var(--ease-spring), background var(--dur-instant) var(--ease-out)',
    },
  }, content);
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, ...style } },
    React.createElement('div', {
      // role=status sin aria-live no se anuncia al cambiar: el texto existia y era
      // estatico, asi que decia el progreso solo a quien lo leyera al entrar.
      role: 'status', 'aria-live': 'polite',
      'aria-label': value.length + ' de ' + length + ' digitos', style: { display: 'flex', gap: 14, animation: invalid ? 'flowShake 320ms var(--ease-out)' : 'none' } },
      Array.from({ length }, (_, i) => React.createElement('span', {
        key: i,
        style: {
          width: 14, height: 14, borderRadius: '50%',
          background: invalid ? 'var(--status-danger)' : i < value.length ? 'var(--action-accent)' : 'transparent',
          border: i < value.length || invalid ? 'none' : '1.5px solid var(--border-strong)',
          transform: i === value.length - 1 ? 'scale(1.15)' : 'scale(1)',
          transition: 'all var(--dur-fast) var(--ease-spring)',
        },
      }))),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 72px)', gap: '14px 22px', justifyItems: 'center' } },
      ...[1,2,3,4,5,6,7,8,9].map(n => key(String(n), () => press(String(n)), String(n))),
      biometricIcon ? key(React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 28, color: 'var(--text-accent)' } }, biometricIcon), onBiometric, 'Usar biometrico') : React.createElement('span', null),
      key('0', () => press('0'), '0'),
      key(React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 24 } }, 'backspace'), () => press('back'), 'Borrar')));
}

F.PasscodeKeypad = PasscodeKeypad;
})();

// ---- components/ChatComposer.jsx ----
(function(){

/** Bottom composer: growing textarea + send button + optional suggestion chips. */
function ChatComposer({ value = '', onChange, onSend, placeholder = 'Pregunta sobre tu flota…', suggestions = [], disabled = false, style }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = 'auto';
    ref.current.style.height = Math.min(120, ref.current.scrollHeight) + 'px';
  }, [value]);
  const send = () => { if (value.trim() && !disabled) onSend && onSend(value.trim()); };
  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 10, ...style } },
    suggestions.length > 0 && React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } },
      suggestions.map((s, i) => React.createElement('button', {
        key: i, type: 'button', onClick: () => onSend && onSend(s),
        style: {
          border: '1px solid var(--border-default)', background: 'var(--surface-card)', borderRadius: 999, padding: '7px 14px',
          fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer',
          transition: 'background var(--dur-instant) var(--ease-out), transform var(--dur-fast) var(--ease-spring)',
        },
        onMouseEnter: (e) => { e.currentTarget.style.background = 'var(--surface-sunken)'; e.currentTarget.style.transform = 'scale(1.03)'; },
        onMouseLeave: (e) => { e.currentTarget.style.background = 'var(--surface-card)'; e.currentTarget.style.transform = 'none'; },
      }, s))),
    React.createElement('div', {
      style: {
        display: 'flex', alignItems: 'flex-end', gap: 8, background: 'var(--surface-card)', border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)', padding: '10px 10px 10px 16px', boxShadow: 'var(--shadow-raised)',
      },
    },
      React.createElement('textarea', {
        ref, value, disabled, rows: 1, placeholder,
        onChange: (e) => onChange && onChange(e.target.value), onKeyDown: onKey,
        style: { flex: 1, resize: 'none', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.5, color: 'var(--text-primary)', padding: '6px 0', maxHeight: 120 },
      }),
      React.createElement('button', {
        type: 'button', 'aria-label': 'Enviar', disabled: disabled || !value.trim(), onClick: send,
        style: {
          width: 'var(--hit-target-min)', height: 'var(--hit-target-min)', borderRadius: 'var(--radius-pill)', border: 'none', flex: 'none',
          background: value.trim() ? 'var(--action-accent)' : 'var(--surface-sunken)',
          color: value.trim() ? 'var(--text-on-accent)' : 'var(--text-muted)', cursor: value.trim() ? 'pointer' : 'not-allowed',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-spring)',
        },
        onMouseEnter: (e) => { if (value.trim()) e.currentTarget.style.transform = 'scale(1.08)'; },
        onMouseLeave: (e) => { e.currentTarget.style.transform = 'none'; },
      }, React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 19 } }, 'arrow_upward'))));
}

F.ChatComposer = ChatComposer;
})();

// ---- components/Card.jsx ----
(function(){

/** Superficie contenedora. variant: 'default' | 'minimal' | 'elevated' | 'ghost'. */
function Card({ children, variant = 'default', accent = 'var(--action-accent)', interactive = false, selected = false, padding = 'var(--pad-card)', onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const lift = interactive && hover;
  const skin = variant === 'minimal' ? {
    background: 'transparent', border: '1px solid transparent', boxShadow: 'none',
  } : variant === 'elevated' ? {
    background: 'var(--surface-card)', border: '2px solid ' + accent, boxShadow: 'var(--shadow-float)',
  } : variant === 'ghost' ? {
    background: 'color-mix(in srgb, var(--surface-card) 40%, transparent)', backdropFilter: 'blur(10px)',
    border: '1px solid color-mix(in srgb, var(--border-subtle) 50%, transparent)', boxShadow: 'none',
  } : {
    background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-rest)',
  };
  const restShadow = lift ? 'var(--shadow-float)' : skin.boxShadow;
  return React.createElement(interactive ? 'button' : 'div', {
    onClick: interactive ? onClick : undefined,
    type: interactive ? 'button' : undefined,
    onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
    onFocus: interactive ? () => setFocus(true) : undefined, onBlur: interactive ? () => setFocus(false) : undefined,
    style: {
      display: 'block', width: interactive ? '100%' : undefined, textAlign: 'left', boxSizing: 'border-box',
      background: skin.background, backdropFilter: skin.backdropFilter,
      border: selected ? '1.5px solid var(--border-focus)' : skin.border,
      borderRadius: 'var(--radius-lg)', padding,
      boxShadow: [focus ? 'var(--focus-ring)' : null, restShadow !== 'none' ? restShadow : null].filter(Boolean).join(', ') || 'none',
      transform: lift ? 'var(--lift-hover)' : 'none',
      cursor: interactive ? 'pointer' : 'default',
      fontFamily: 'var(--font-body)', color: 'var(--text-primary)', outline: 'none',
      transition: 'transform var(--dur-fast) var(--ease-spring), box-shadow var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
      ...style,
    },
  }, children);
}

F.Card = Card;
})();

// ---- primitives/Badge.jsx ----
(function(){

const TONES = {
  neutral: { bg: 'var(--surface-sunken)', fg: 'var(--text-secondary)' },
  success: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' },
  warning: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' },
  danger: { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)' },
  info: { bg: 'var(--status-info-bg)', fg: 'var(--status-info-text)' },
  accent: { bg: 'var(--surface-accent-subtle)', fg: 'var(--text-accent)' },
};

function Badge({ tone = 'neutral', live = false, icon, children, style }) {
  const t = TONES[tone] || TONES.neutral;
  return React.createElement('span', {
    style: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: t.bg, color: t.fg, borderRadius: 'var(--radius-pill)',
      padding: '4px 12px', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
      lineHeight: 1.4, whiteSpace: 'nowrap', ...style,
    },
  },
    live && React.createElement('span', { 'aria-hidden': true, style: { width: 7, height: 7, borderRadius: '50%', background: 'currentColor', animation: 'flowPulse 1.6s ease-in-out infinite' } }),
    icon && React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 14 } }, icon),
    children);
}

F.Badge = Badge;
})();

// ---- primitives/Chip.jsx ----
(function(){

/** Pastilla que se toca. Ver contracts/chip.json.
 *  Con onRemove la raiz deja de ser un boton: quitar y seleccionar son dos
 *  acciones y no pueden anidarse una dentro de la otra.
 */
function Chip({ label, selected = false, onClick, onRemove, icon, disabled = false, style }) {
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
    className: 'flow-symbol' + (selected ? ' flow-symbol--fill' : ''), 'aria-hidden': true,
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
  }, React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 16 } }, 'close'));

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

F.Chip = Chip;
})();

// ---- primitives/Avatar.jsx ----
(function(){

const SIZES = { sm: 28, md: 36, lg: 48, xl: 64 };
const PRESENCIA = {
  online: { color: 'var(--status-success)', texto: 'En linea' },
  busy: { color: 'var(--status-live)', texto: 'Ocupado' },
  offline: { color: 'var(--avatar-offline)', texto: 'Desconectado' },
};

/** Iniciales o foto, con color determinista por nombre. Ver contracts/avatar.json. */
function Avatar({ name = '', src, size = 'md', status, style }) {
  const [falla, setFalla] = React.useState(false);
  const d = SIZES[size] || SIZES.md;
  const iniciales = name.split(' ').map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  // Determinista: la misma persona lleva el mismo color en toda la aplicacion y
  // entre sesiones. El color sale de un token, no de un hex del componente.
  // FNV-1a con avalancha final, porque determinismo no basta: el objetivo es
  // distinguir personas. Con h*31+c y modulo 6, cuatro nombres cortos en espanol
  // caian en dos colores y la fila se veia como tres circulos rojos iguales.
  let hash = 2166136261;
  for (let i = 0; i < name.length; i++) { hash ^= name.charCodeAt(i); hash = Math.imul(hash, 16777619); }
  hash ^= hash >>> 15; hash = Math.imul(hash, 2246822507); hash ^= hash >>> 13;
  const bg = 'var(--avatar-' + ((hash >>> 0) % 6 + 1) + ')';
  const p = PRESENCIA[status];

  return React.createElement('span', { style: { position: 'relative', display: 'inline-flex', flex: 'none', ...style } },
    src && !falla
      ? React.createElement('img', {
          src, alt: name, onError: () => setFalla(true),
          style: { width: d, height: d, borderRadius: 'var(--radius-pill)', objectFit: 'cover' },
        })
      : React.createElement('span', {
          role: 'img', 'aria-label': name || 'Sin nombre',
          style: {
            width: d, height: d, borderRadius: 'var(--radius-pill)', background: bg,
            color: 'var(--text-on-accent)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-body)', fontSize: d * 0.36, fontWeight: 700, letterSpacing: '0.02em',
          },
        }, iniciales || '?'),
    p && React.createElement('span', {
      // La presencia no se comunica solo por color: el punto se anuncia (avt-3).
      role: 'img', 'aria-label': p.texto,
      style: {
        position: 'absolute', right: -1, bottom: -1,
        width: Math.max(9, d * 0.26), height: Math.max(9, d * 0.26),
        borderRadius: 'var(--radius-pill)', background: p.color,
        // El punto se separa del avatar por el anillo, no por contraste de matiz:
        // un punto rojo de "ocupado" sobre un avatar rojo da 1.27:1 y lo unico
        // que lo distingue es este borde. Por eso crece con el tamano.
        border: Math.max(2, Math.round(d * 0.06)) + 'px solid var(--surface-card)',
        boxSizing: 'content-box',
        animation: status === 'busy' ? 'flowPulse 1.6s ease-in-out infinite' : 'none',
      },
    }));
}

F.Avatar = Avatar;
})();

// ---- components/Table.jsx ----
(function(){

/** columns: [{key, label, width?, align?, mono?, sortable?, sortValue?(row), render?(row)}]
 *  dense: paddings compactos. renderDetail?(row): filas expandibles. Ver contracts/table.json. */
function Table({ columns = [], rows = [], rowKey, onRowClick, selectedKey, dense = false, defaultSort, renderDetail, style }) {
  return React.createElement(F.DataGrid, {
    columns, rows, rowKey, onRowClick, selectedKey, defaultSort, renderDetail,
    density: dense ? 'dense' : 'default', style,
  });
}

F.Table = Table;
})();

// ---- primitives/Skeleton.jsx ----
(function(){

function Skeleton({ variant = 'text', width, height, style }) {
  const dims = {
    text: { width: width || '100%', height: height || 14, borderRadius: 6 },
    title: { width: width || '60%', height: height || 22, borderRadius: 8 },
    circle: { width: width || 36, height: height || width || 36, borderRadius: '50%' },
    card: { width: width || '100%', height: height || 96, borderRadius: 'var(--radius-lg)' },
    pill: { width: width || 96, height: height || 36, borderRadius: 999 },
  }[variant];
  return React.createElement('span', {
    'aria-hidden': true,
    style: {
      display: 'block',
      background: 'linear-gradient(90deg, var(--surface-sunken) 25%, var(--border-subtle) 50%, var(--surface-sunken) 75%)',
      backgroundSize: '200% 100%', animation: 'flowShimmer 1.4s ease infinite',
      ...dims, ...style,
    },
  });
}

F.Skeleton = Skeleton;
})();

// ---- components/EmptyState.jsx ----
(function(){

function EmptyState({ icon = 'inbox', title, description, action, style }) {
  return React.createElement('div', {
    style: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 8, padding: '40px 24px', textAlign: 'center', fontFamily: 'var(--font-body)', ...style,
    },
  },
    React.createElement('span', {
      style: {
        width: 64, height: 64, borderRadius: '50%', background: 'var(--surface-sunken)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4,
      },
    }, React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 30, color: 'var(--text-muted)' } }, icon)),
    title && React.createElement('div', { style: { fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' } }, title),
    description && React.createElement('div', { style: { fontSize: 13, color: 'var(--text-muted)', maxWidth: 340, lineHeight: 1.55 } }, description),
    action && React.createElement('div', { style: { marginTop: 10 } }, action));
}

F.EmptyState = EmptyState;
})();

// ---- components/Accordion.jsx ----
(function(){

let uid = 0;

/** Secciones expandibles. Ver contracts/accordion.json. */
function Accordion({ items = [], defaultOpen, multiple = false, style }) {
  const [open, setOpen] = React.useState(() => new Set(defaultOpen ? [defaultOpen] : []));
  // aria-expanded sin aria-controls anuncia "expandido" sin poder decir que se
  // expandio: hacen falta las dos mitades, y para eso hace falta un id (acc-1).
  const base = React.useId ? React.useId() : 'flow-acc-' + (++uid);
  const toggle = (id) => setOpen(prev => {
    const next = new Set(multiple ? prev : []);
    if (prev.has(id)) { if (multiple) next.delete(id); } else next.add(id);
    return next;
  });
  return React.createElement('div', {
    style: { background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-rest)', fontFamily: 'var(--font-body)', ...style },
  }, items.map((it, i) => {
    const isOpen = open.has(it.id);
    const panelId = base + '-p-' + it.id;
    const cabId = base + '-h-' + it.id;
    return React.createElement('div', { key: it.id, style: { borderBottom: i < items.length - 1 ? '1px solid var(--border-subtle)' : 'none' } },
      React.createElement('button', {
        id: cabId, type: 'button', 'aria-expanded': isOpen, 'aria-controls': panelId,
        onClick: () => toggle(it.id),
        onMouseEnter: (e) => e.currentTarget.style.background = 'var(--surface-sunken)',
        onMouseLeave: (e) => e.currentTarget.style.background = 'transparent',
        style: {
          display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 56, padding: '0 20px',
          border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left',
          fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)',
          transition: 'background var(--dur-instant) var(--ease-out)',
        },
      },
        it.icon && React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 20, color: 'var(--text-muted)' } }, it.icon),
        React.createElement('span', { style: { flex: 1 } }, it.title),
        it.meta && React.createElement('span', { style: { fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' } }, it.meta),
        React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 22, color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-base) var(--ease-spring)' } }, 'expand_more')),
      React.createElement('div', {
        id: panelId, role: 'region', 'aria-labelledby': cabId,
        style: { display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition: 'grid-template-rows var(--dur-base) var(--ease-out)' },
      }, React.createElement('div', {
        // Cerrado no basta con alto cero: con overflow hidden el contenido sigue
        // en el orden de tabulacion y en la busqueda de la pagina. visibility lo
        // saca de los dos sin romper la animacion de la rejilla (acc-3).
        style: { overflow: 'hidden', visibility: isOpen ? 'visible' : 'hidden' },
      },
        React.createElement('div', { style: { padding: '2px 20px 18px', fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-secondary)' } }, it.content))));
  }));
}

F.Accordion = Accordion;
})();

// ---- primitives/Sparkline.jsx ----
(function(){

/**
 * Sparkline se queda en SVG a mano a proposito: 60-90px inline dentro de un KPI
 * no justifica montar ECharts, y hay decenas por pantalla.
 */
function Sparkline({ values = [], width = 88, height = 28, color, showDot = true, style }) {
  if (!values.length) return React.createElement('span', { style: { width, height, display: 'inline-block', ...style } });
  const min = Math.min.apply(null, values), max = Math.max.apply(null, values);
  const span = (max - min) || 1;
  const pts = values.map((v, i) => [
    (i / (values.length - 1 || 1)) * (width - 4) + 2,
    height - 3 - ((v - min) / span) * (height - 6),
  ]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const last = pts[pts.length - 1];
  const stroke = color || 'var(--action-accent)';
  return React.createElement('svg', {
    width, height, viewBox: '0 0 ' + width + ' ' + height, 'aria-hidden': true,
    style: { display: 'block', overflow: 'visible', ...style },
  },
    React.createElement('path', { d, fill: 'none', stroke, strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' }),
    showDot && React.createElement('circle', { cx: last[0], cy: last[1], r: 2.75, fill: stroke })
  );
}

F.Sparkline = Sparkline;
})();

// ---- components/Bars.jsx ----
(function(){

/** Barras verticales. Delega en FlowChart; la maxima en accent si highlightMax. */
function Bars({ data = [], height = 200, color, highlightMax = true, format, style }) {
  const labels = data.map((d) => d.label);
  const values = data.map((d) => d.value);
  const maxIdx = values.indexOf(Math.max.apply(null, values));
  const itemColors = highlightMax
    ? values.map((_, i) => (i === maxIdx ? 'var(--viz-accent)' : (color || 'var(--text-primary)')))
    : undefined;
  return React.createElement(F.FlowChart, {
    type: 'bar', height, labels, format, style, itemColors,
    series: [{ label: 'Valor', values, color: color }],
    ariaLabel: 'Barras por ' + labels.join(', '),
  });
}

F.Bars = Bars;
})();

// ---- components/ParetoChart.jsx ----
(function(){

/** Barras ordenadas + acumulado. Las que cruzan el umbral van en accent. */
function ParetoChart({ data = [], height = 240, format, threshold = 0.8, style }) {
  const sorted = data.slice().sort((a, b) => b.value - a.value);
  const total = sorted.reduce((a, d) => a + d.value, 0) || 1;
  let acc = 0;
  const itemColors = sorted.map((d) => {
    const before = acc / total;
    acc += d.value;
    return before < threshold ? 'var(--viz-accent)' : 'var(--viz-neutral)';
  });
  return React.createElement(F.FlowChart, {
    type: 'pareto', height, format, style, itemColors,
    labels: sorted.map((d) => d.label),
    series: [{ label: 'Valor', values: sorted.map((d) => d.value) }],
    ariaLabel: 'Pareto: pocas causas concentran el ' + Math.round(threshold * 100) + '% del total',
  });
}

F.ParetoChart = ParetoChart;
})();

// ---- components/ScatterPlot.jsx ----
(function(){

/** Dispersion con umbrales de cuadrante. Delega en FlowChart. */
function ScatterPlot({
  points = [], xLabel, yLabel, xThreshold, yThreshold, format = {},
  width, height = 260, selectedId, onSelect, style,
}) {
  // width se ignora a proposito: venia de la era SVG y aqui el chart es responsivo.
  const values = points.map((p) => [p.x, p.y, p.label, p.id]);
  const fmt = format.y || format.x || ((v) => v);

  const lines = [].concat(
    xThreshold != null ? [{ xAxis: xThreshold }] : [],
    yThreshold != null ? [{ yAxis: yThreshold }] : []
  );

  return React.createElement(F.FlowChart, {
    type: 'scatter', height, format: fmt,
    style: style,
    series: [{
      label: yLabel || 'Unidades',
      values,
      markLine: lines.length ? {
        silent: true, symbol: 'none',
        lineStyle: { color: 'var(--viz-axis)', type: 'dashed', width: 1 },
        label: { show: false },
        data: lines,
      } : undefined,
    }],
    onSelect: onSelect ? (p) => {
      const hit = points.filter((x) => x.id === (p.value && p.value[3]))[0];
      if (hit) onSelect(hit);
    } : undefined,
    option: {
      grid: { bottom: xLabel ? 30 : 6, left: yLabel ? 24 : 8 },
      xAxis: { name: xLabel, nameLocation: 'middle', nameGap: 30, nameTextStyle: { fontSize: 11, color: 'var(--viz-label)' } },
      yAxis: { name: yLabel, nameLocation: 'middle', nameGap: 42, nameTextStyle: { fontSize: 11, color: 'var(--viz-label)' } },
    },
    ariaLabel: (yLabel || 'Y') + ' contra ' + (xLabel || 'X') + ', ' + points.length + ' unidades',
  });
}

F.ScatterPlot = ScatterPlot;
})();

// ---- components/SmallMultiples.jsx ----
(function(){

/** Grid of mini sparklines, one per entity, sharing the same Y scale so shapes are comparable at a glance. Outliers get accent color. */
function SmallMultiples({ items = [], height = 46, columns = 4, isOutlier, format, onSelect, selectedId, style }) {
  // Sin datos, Math.min de un array vacio da Infinity y la rejilla salia muda:
  // ni dibujo ni texto, indistinguible de un fallo de carga (smm-v1).
  if (!items.length) return React.createElement('div', {
    style: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 6, minHeight: 120, color: 'var(--text-muted)', font: 'var(--type-caption)',
    },
  },
    React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 22 } }, 'bar_chart'),
    'Sin datos para este periodo');
  const all = items.flatMap(it => it.values);
  const min = Math.min(...all), max = Math.max(...all);
  const span = max - min || 1;

  const spark = (values, color) => {
    const w = 140;
    const px = (i) => 3 + (i / (values.length - 1)) * (w - 6);
    const py = (v) => height - 4 - ((v - min) / span) * (height - 8);
    const pts = values.map((v, i) => px(i) + ',' + py(v)).join(' ');
    return React.createElement('svg', { width: '100%', height, viewBox: '0 0 ' + w + ' ' + height, 'aria-hidden': true, style: { display: 'block' } },
      React.createElement('polyline', { points: pts, fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }));
  };

  return React.createElement('div', {
    style: { display: 'grid', gridTemplateColumns: 'repeat(' + columns + ', 1fr)', gap: 10, fontFamily: 'var(--font-body)', ...style },
  }, items.map(it => {
    const out = isOutlier ? isOutlier(it) : false;
    const sel = it.id === selectedId;
    const last = it.values[it.values.length - 1];
    return React.createElement('button', {
      key: it.id, type: 'button', onClick: onSelect ? () => onSelect(it) : undefined,
      style: {
        textAlign: 'left', border: sel ? '1.5px solid var(--border-focus)' : '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '10px 12px 8px', cursor: onSelect ? 'pointer' : 'default',
        boxShadow: sel ? 'var(--focus-ring)' : 'none', transition: 'border-color var(--dur-fast) var(--ease-out)',
      },
    },
      React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 } },
        React.createElement('span', { style: { fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, it.label),
        out && React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 14, color: 'var(--status-danger-text)', marginLeft: 'auto' } }, 'priority_high'),
        React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 600, color: out ? 'var(--status-danger-text)' : 'var(--text-secondary)', marginLeft: out ? 4 : 'auto' } }, format ? format(last) : last)),
      spark(it.values, out ? 'var(--viz-accent)' : 'var(--viz-7)'));
  }));
}

F.SmallMultiples = SmallMultiples;
})();

// ---- components/BulletChart.jsx ----
(function(){

/** Compact real-vs-target bar. rows: [{label, value, target, prev?, max?}]. Denser than a gauge for comparing many entities. */
function BulletChart({ rows = [], format, style }) {
  // Sin filas mostraba solo su leyenda -- Real, Meta, Periodo anterior -- que es
  // una leyenda de nada (blt-v1).
  if (!rows.length) return React.createElement('div', {
    style: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 6, minHeight: 100, color: 'var(--text-muted)', font: 'var(--type-caption)',
    },
  },
    React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 22 } }, 'bar_chart'),
    'Sin datos para este periodo');
  const gmax = Math.max(...rows.map(r => r.max || Math.max(r.value, r.target) * 1.2), 1);
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 14, fontFamily: 'var(--font-body)', ...style } },
    rows.map((r, i) => {
      const over = r.value > r.target;
      const pct = Math.min(100, (r.value / gmax) * 100);
      const tPct = Math.min(100, (r.target / gmax) * 100);
      const prevPct = r.prev != null ? Math.min(100, (r.prev / gmax) * 100) : null;
      return React.createElement('div', { key: i, style: { display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 12, alignItems: 'center' } },
        React.createElement('span', { style: { fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, r.label),
        React.createElement('div', { style: { position: 'relative', height: 18, background: 'var(--surface-sunken)', borderRadius: 6 } },
          prevPct != null && React.createElement('span', { 'aria-hidden': true, style: { position: 'absolute', left: 0, top: '35%', bottom: '35%', width: prevPct + '%', background: 'var(--border-strong)', opacity: 0.4, borderRadius: 4 } }),
          React.createElement('span', {
            'aria-hidden': true,
            style: { position: 'absolute', left: 0, top: 3, bottom: 3, width: pct + '%', borderRadius: 5, background: over ? 'var(--status-danger)' : 'var(--viz-accent)', transition: 'width var(--dur-slow) var(--ease-out)' },
          }),
          React.createElement('span', { 'aria-hidden': true, style: { position: 'absolute', left: tPct + '%', top: -2, bottom: -2, width: 2.5, background: 'var(--text-primary)' } })),
        React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: over ? 'var(--status-danger-text)' : 'var(--text-primary)', minWidth: 60, textAlign: 'right' } },
          format ? format(r.value) : r.value));
    }),
    React.createElement('div', { style: { display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-muted)', marginTop: 2 } },
      React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 5 } }, React.createElement('span', { 'aria-hidden': true, style: { width: 10, height: 10, borderRadius: 3, background: 'var(--viz-accent)' } }), 'Real'),
      React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 5 } }, React.createElement('span', { 'aria-hidden': true, style: { width: 2.5, height: 12, background: 'var(--text-primary)' } }), 'Meta'),
      React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 5 } }, React.createElement('span', { 'aria-hidden': true, style: { width: 10, height: 6, borderRadius: 3, background: 'var(--border-strong)', opacity: 0.5 } }), 'Periodo anterior')));
}

F.BulletChart = BulletChart;
})();

// ---- components/Treemap.jsx ----
(function(){

/** Treemap: tamano = valor, color = desvio vs presupuesto. Delega en FlowChart. */
function Treemap({ nodes = [], width, height = 280, format, onDrill, style }) {
  // width se ignora a proposito: venia de la era SVG y aqui el chart es responsivo.
  const colorFor = (dev) => {
    if (dev == null) return 'var(--viz-neutral)';
    if (dev > 0.1) return 'var(--viz-negative)';
    if (dev > 0) return 'var(--viz-3)';
    return 'var(--viz-positive)';
  };
  const data = nodes.map((n) => ({ label: n.label, value: n.value, color: colorFor(n.deviation) }));
  return React.createElement(F.FlowChart, {
    type: 'treemap', height, format,
    style: style,
    series: [{ data }],
    onSelect: onDrill ? (p) => {
      const hit = nodes.filter((n) => n.label === p.name)[0];
      if (hit) onDrill(hit);
    } : undefined,
    ariaLabel: 'Gasto por region, tamano por valor y color por desvio vs presupuesto',
  });
}

F.Treemap = Treemap;
})();

// ---- components/PaymentCard.jsx ----
(function(){

/** Flow-branded payment card. variant ink/accent/sand; frozen adds frost overlay. */
function PaymentCard({ holder = '', last4 = '0000', variant = 'ink', frozen = false, label, expires, width = 320, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const V = {
    ink: { bg: 'var(--flow-ink-900)', fg: 'var(--card-fg-on-ink)', dim: 'var(--card-dim-on-ink)', logoFilter: 'invert(1)' },
    accent: { bg: 'var(--flow-red-500)', fg: 'var(--card-fg-on-accent)', dim: 'var(--card-dim-on-accent)', logoFilter: 'invert(1)' },
    sand: { bg: 'var(--flow-sand-50)', fg: 'var(--flow-ink-900)', dim: 'var(--flow-ink-500)', logoFilter: 'none', border: '1px solid var(--flow-sand-200)' },
  }[variant] || {};
  const h = Math.round(width / 1.586);
  return React.createElement('div', {
    onClick, role: onClick ? 'button' : undefined, tabIndex: onClick ? 0 : undefined,
    onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
    style: {
      position: 'relative', width, height: h, borderRadius: 20, boxSizing: 'border-box',
      background: V.bg, color: V.fg, border: V.border || 'none', overflow: 'hidden',
      padding: Math.round(width * 0.065), display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-body)', cursor: onClick ? 'pointer' : 'default', flex: 'none',
      boxShadow: hover && onClick ? 'var(--shadow-float)' : 'var(--shadow-raised)',
      transform: hover && onClick ? 'translateY(-3px)' : 'none',
      transition: 'transform var(--dur-fast) var(--ease-spring), box-shadow var(--dur-fast) var(--ease-out)',
      ...style,
    },
  },
    React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start' } },
      React.createElement('img', { src: (window.FLOW_ASSET_BASE || '') + 'assets/flow-logo.png', alt: 'Flow', style: { height: Math.round(width * 0.055), filter: V.logoFilter } }),
      label && React.createElement('span', { style: { marginLeft: 'auto', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: V.dim } }, label)),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto', marginBottom: 8 } },
      React.createElement('span', { 'aria-hidden': true, style: { width: Math.round(width * 0.115), height: Math.round(width * 0.085), borderRadius: 6, background: variant === 'sand' ? 'var(--flow-sand-200)' : 'rgba(255,255,255,.25)', display: 'inline-block' } }),
      React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: Math.round(width * 0.07), color: V.dim } }, 'contactless')),
    React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 10 } },
      React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: Math.round(width * 0.052), fontWeight: 500, letterSpacing: '.08em', whiteSpace: 'nowrap' } }, '•••• ' + last4),
      expires && React.createElement('span', { style: { marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: Math.round(width * 0.038), color: V.dim } }, expires)),
    holder && React.createElement('div', { style: { fontSize: Math.round(width * 0.04), fontWeight: 600, color: V.dim, marginTop: 4, textTransform: 'uppercase', letterSpacing: '.06em' } }, holder),
    frozen && React.createElement('div', {
      style: {
        position: 'absolute', inset: 0, background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        animation: 'flowScaleIn var(--dur-base) var(--ease-out)',
      },
    },
      React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 26, color: 'var(--card-fg-on-accent)', textShadow: '0 1px 6px rgba(0,0,0,.3)' } }, 'ac_unit'),
      React.createElement('span', { style: { fontSize: 14, fontWeight: 700, color: 'var(--card-fg-on-accent)', textShadow: '0 1px 6px rgba(0,0,0,.3)' } }, 'Congelada')));
}

F.PaymentCard = PaymentCard;
})();

// ---- components/TransactionRow.jsx ----
(function(){

const CATS = {
  fuel: ['local_gas_station', 'var(--status-warning-text)', 'var(--status-warning-bg)'],
  charge: ['bolt', 'var(--status-success-text)', 'var(--status-success-bg)'],
  toll: ['toll', 'var(--status-info-text)', 'var(--status-info-bg)'],
  food: ['restaurant', 'var(--text-accent)', 'var(--surface-accent-subtle)'],
  transfer: ['sync_alt', 'var(--text-secondary)', 'var(--surface-sunken)'],
  income: ['south_west', 'var(--status-success-text)', 'var(--status-success-bg)'],
};

/** Movement/transaction list row: category icon, merchant, meta, signed mono amount. */
function TransactionRow({ category = 'transfer', title, subtitle, amount = 0, currency = '$', pending = false, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const [ic, fg, bg] = CATS[category] || CATS.transfer;
  const negative = amount < 0;
  const amt = currency + Math.abs(amount).toLocaleString('es-MX', { minimumFractionDigits: 2 });
  return React.createElement(onClick ? 'button' : 'div', {
    type: onClick ? 'button' : undefined, onClick,
    onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
    style: {
      display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 60, padding: '8px 4px',
      border: 'none', background: hover && onClick ? 'var(--surface-sunken)' : 'transparent',
      borderRadius: 'var(--radius-md)', cursor: onClick ? 'pointer' : 'default', textAlign: 'left',
      fontFamily: 'var(--font-body)', color: 'var(--text-primary)', boxSizing: 'border-box',
      transition: 'background var(--dur-instant) var(--ease-out)', ...style,
    },
  },
    React.createElement('span', {
      'aria-hidden': true,
      style: { width: 42, height: 42, borderRadius: 14, background: bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' },
    }, React.createElement('span', { className: 'flow-symbol', style: { fontSize: 21, color: fg } }, ic)),
    React.createElement('span', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 } },
      React.createElement('span', { style: { fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, title),
      subtitle && React.createElement('span', { style: { fontSize: 12, color: 'var(--text-muted)' } }, subtitle)),
    React.createElement('span', { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, flex: 'none' } },
      React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', color: negative ? 'var(--text-primary)' : 'var(--status-success-text)' } }, (negative ? '\u2212' : '+') + amt),
      pending && React.createElement('span', { style: { fontSize: 11, color: 'var(--text-muted)' } }, 'Pendiente')));
}

F.TransactionRow = TransactionRow;
})();

// ---- components/MapCanvas.jsx ----
(function(){

// Slippy map math
function lon2x(lon, z) { return ((lon + 180) / 360) * Math.pow(2, z); }
function lat2y(lat, z) { const r = lat * Math.PI / 180; return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * Math.pow(2, z); }

/** OpenStreetMap tile map with pins and optional route polyline. Non-interactive pan; pins are buttons. */
function MapCanvas({ center = { lat: 19.4326, lng: -99.1332 }, zoom = 14, width = '100%', height = 360,
  pins = [], selectedId, onPinClick, route = [], dark = false, style }) {
  const ref = React.useRef(null);
  const [size, setSize] = React.useState({ w: 360, h: typeof height === 'number' ? height : 360 });
  React.useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const upd = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    upd();
    const ro = new ResizeObserver(upd); ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const TILE = 256;
  const cx = lon2x(center.lng, zoom), cy = lat2y(center.lat, zoom);
  const px = (lng) => (lon2x(lng, zoom) - cx) * TILE + size.w / 2;
  const py = (lat) => (lat2y(lat, zoom) - cy) * TILE + size.h / 2;

  const x0 = Math.floor(cx - size.w / 2 / TILE), x1 = Math.floor(cx + size.w / 2 / TILE);
  const y0 = Math.floor(cy - size.h / 2 / TILE), y1 = Math.floor(cy + size.h / 2 / TILE);
  const tiles = [];
  for (let tx = x0; tx <= x1; tx++) for (let ty = y0; ty <= y1; ty++) tiles.push([tx, ty]);

  return React.createElement('div', {
    ref,
    style: { position: 'relative', width, height, overflow: 'hidden', borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)', ...style },
  },
    tiles.map(([tx, ty]) => React.createElement('img', {
      key: tx + '_' + ty, alt: '',
      src: 'https://tile.openstreetmap.org/' + zoom + '/' + tx + '/' + ty + '.png',
      style: {
        position: 'absolute', width: TILE, height: TILE, left: (tx - cx) * TILE + size.w / 2, top: (ty - cy) * TILE + size.h / 2,
        filter: dark ? 'invert(1) hue-rotate(180deg) brightness(.9) saturate(.4)' : 'saturate(.85)',
        pointerEvents: 'none', userSelect: 'none',
      },
    })),
    route.length > 1 && React.createElement('svg', {
      'aria-hidden': true,
      style: { position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' },
    },
      React.createElement('polyline', {
        points: route.map(p => px(p.lng) + ',' + py(p.lat)).join(' '),
        fill: 'none', stroke: 'var(--viz-accent)', strokeWidth: 4.5, strokeLinecap: 'round', strokeLinejoin: 'round',
        strokeDasharray: '1 9', opacity: 0.95,
      }),
      React.createElement('circle', { cx: px(route[0].lng), cy: py(route[0].lat), r: 6, fill: 'var(--surface-inverse)', stroke: 'var(--surface-card)', strokeWidth: 2.5 })),
    pins.map(p => {
      const sel = p.id === selectedId;
      return React.createElement('button', {
        key: p.id, type: 'button', 'aria-label': p.ariaLabel || p.label, 'aria-pressed': sel,
        onClick: onPinClick ? () => onPinClick(p) : undefined,
        style: {
          position: 'absolute', left: px(p.lng), top: py(p.lat), transform: 'translate(-50%, -100%)' + (sel ? ' scale(1.12)' : ''),
          transformOrigin: 'bottom center', border: 'none', cursor: 'pointer', padding: 0, background: 'transparent',
          transition: 'transform var(--dur-fast) var(--ease-spring)', zIndex: sel ? 3 : 2,
        },
      },
        React.createElement('span', {
          style: {
            display: 'flex', alignItems: 'center', gap: 5, background: sel ? 'var(--viz-accent)' : 'var(--surface-card)',
            color: sel ? 'var(--text-on-accent)' : 'var(--text-primary)', border: sel ? 'none' : '1px solid var(--border-default)',
            borderRadius: 999, padding: '6px 11px', fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 600,
            boxShadow: sel ? 'var(--shadow-accent-glow)' : 'var(--shadow-raised)', whiteSpace: 'nowrap',
          },
        },
          p.icon && React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 15 } }, p.icon),
          p.label),
        React.createElement('span', {
          'aria-hidden': true,
          style: {
            display: 'block', margin: '0 auto', width: 0, height: 0,
            borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
            borderTop: '7px solid ' + (sel ? 'var(--viz-accent)' : 'var(--surface-card)'),
            filter: 'drop-shadow(var(--shadow-pin))',
          },
        }));
    }),
    React.createElement('span', {
      style: { position: 'absolute', right: 6, bottom: 4, fontSize: 9.5, fontFamily: 'var(--font-body)', color: 'var(--text-muted)', background: 'var(--surface-card)', borderRadius: 6, padding: '1px 6px', zIndex: 4 },
    }, '© OpenStreetMap'));
}

F.MapCanvas = MapCanvas;
})();

// ---- components/StatTile.jsx ----
(function(){

/** Compact KPI tile: overline label, mono value, delta with trend icon. */
function StatTile({ label, value, delta, trend, icon, tone, style }) {
  const deltaColor = trend === 'up' ? 'var(--status-success-text)' : trend === 'down' ? 'var(--status-danger-text)' : 'var(--text-muted)';
  return React.createElement('div', {
    style: {
      background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
      padding: 18, boxShadow: 'var(--shadow-rest)', fontFamily: 'var(--font-body)', minWidth: 0, ...style,
    },
  },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
      icon && React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 18, color: tone || 'var(--text-muted)' } }, icon),
      React.createElement('span', { style: { fontSize: 11, fontWeight: 600, letterSpacing: 'var(--tracking-overline)', textTransform: 'uppercase', color: 'var(--text-muted)' } }, label)),
    React.createElement('div', { style: { fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 600, marginTop: 8, letterSpacing: '-0.01em' } }, value),
    delta && React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600, marginTop: 4, color: deltaColor } },
      trend && React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 14 } }, trend === 'up' ? 'trending_up' : trend === 'down' ? 'trending_down' : 'trending_flat'),
      delta));
}

F.StatTile = StatTile;
})();

// ---- components/Donut.jsx ----
(function(){

/** Donut con etiqueta central y leyenda con porcentajes. Delega en FlowChart. */
function Donut({ segments = [], size = 160, thickness, centerLabel, centerValue, legend = true, style }) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;

  // Mismo criterio que FlowChart (tinta+accent con pocas categorias) resuelto aqui,
  // para que el swatch de la leyenda y la rebanada nunca discrepen.
  const pick = segments.length <= 3
    ? ['var(--text-primary)', 'var(--viz-accent)', 'var(--viz-neutral)']
    : [1, 2, 3, 4, 5, 6, 7, 8].map((n) => 'var(--viz-' + n + ')');
  const colored = segments.map((s, i) => ({ ...s, color: s.color || pick[i % pick.length] }));

  const chart = React.createElement(F.FlowChart, {
    type: 'donut', height: size, legend: false,
    series: [{ data: colored }],
    ariaLabel: 'Reparto: ' + segments.map((s) => s.label).join(', '),
  });

  const center = (centerValue || centerLabel) && React.createElement('div', {
    style: {
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', gap: 1,
    },
  },
    centerValue && React.createElement('div', {
      style: { font: 'var(--type-data-lg)', color: 'var(--text-primary)', lineHeight: 1.1 },
    }, centerValue),
    centerLabel && React.createElement('div', {
      style: { fontSize: 11, color: 'var(--text-muted)' },
    }, centerLabel)
  );

  return React.createElement('div', {
    style: { display: 'flex', alignItems: 'center', gap: 18, ...style },
  },
    React.createElement('div', {
      style: { position: 'relative', width: size, height: size, flex: 'none' },
    }, chart, center),
    legend && React.createElement('div', {
      style: { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0, flex: 1 },
    }, colored.map((s, i) => React.createElement('div', {
      key: s.label,
      style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, minWidth: 0 },
    },
      React.createElement('span', {
        'aria-hidden': true,
        style: {
          width: 9, height: 9, borderRadius: '50%', flex: 'none',
          background: s.color,
        },
      }),
      React.createElement('span', {
        style: { flex: 1, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
      }, s.label),
      React.createElement('span', {
        style: { fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)', flex: 'none' },
      }, Math.round(s.value / total * 100) + '%')
    )))
  );
}

F.Donut = Donut;
})();

// ---- components/RoleMatrix.jsx ----
(function(){

/** Matriz permisos x roles. permissions: [{id,label,group?}] · roles: [{id,label,locked?}] · values: {permId:{roleId:bool}} */
function RoleMatrix({ roles = [], permissions = [], values = {}, onChange, style }) {
  const toggle = (pid, rid) => {
    if (!onChange) return;
    const next = {};
    Object.keys(values).forEach((k) => { next[k] = { ...values[k] }; });
    next[pid] = next[pid] || {};
    next[pid][rid] = !next[pid][rid];
    onChange(next, pid, rid);
  };

  const columns = [{
    key: '__perm', label: 'Permiso', width: 200,
    render: (p) => React.createElement('span', { style: { color: 'var(--text-secondary)', whiteSpace: 'normal' } }, p.label),
  }].concat(roles.map((r) => ({
    key: r.id, align: 'center',
    label: React.createElement(React.Fragment, null,
      r.label,
      r.locked && React.createElement('span', {
        className: 'flow-symbol', 'aria-hidden': true,
        style: { fontSize: 13, verticalAlign: -2, marginLeft: 4 },
      }, 'lock')),
    render: (p) => {
      const on = !!(values[p.id] && values[p.id][r.id]);
      return React.createElement('button', {
        type: 'button', disabled: r.locked,
        'aria-label': p.label + ' — ' + r.label + (on ? ': permitido' : ': no permitido'),
        'aria-pressed': on,
        onClick: () => toggle(p.id, r.id),
        style: {
          width: 'var(--hit-target-min)', height: 'var(--hit-target-min)', borderRadius: 'var(--radius-xs)', cursor: r.locked ? 'not-allowed' : 'pointer',
          border: on ? 'none' : '1.5px solid var(--border-default)',
          background: on ? 'var(--action-accent)' : 'var(--surface-card)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          opacity: r.locked ? 0.55 : 1,
          transition: 'all var(--dur-fast) var(--ease-spring)',
        },
      }, on ? React.createElement('span', {
        className: 'flow-symbol', 'aria-hidden': true,
        style: { fontSize: 16, color: 'var(--text-on-inverse)', animation: 'flowScaleIn var(--dur-fast) var(--ease-spring)' },
      }, 'check') : null);
    },
  })));

  const rows = [];
  const seen = [];
  permissions.forEach((p) => {
    const g = p.group || '';
    if (g && seen.indexOf(g) < 0) { seen.push(g); rows.push({ __group: g }); }
    rows.push(p);
  });

  return React.createElement(F.DataGrid, {
    columns, rows, rowKey: 'id', density: 'dense', style: { overflow: 'auto', ...style },
  });
}

F.RoleMatrix = RoleMatrix;
})();

// ---- components/ChatMessage.jsx ----
(function(){

/** One message bubble. role: 'user' | 'agent'. tool: optional {label, icon, status:'running'|'done'} chip shown above agent text. */
function ChatMessage({ role = 'agent', text, tool, streaming = false, children, timestamp, style }) {
  const isUser = role === 'user';
  return React.createElement('div', {
    style: { display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', gap: 6, ...style },
  },
    tool && React.createElement('div', {
      style: {
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px 7px 10px', borderRadius: 999,
        background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)',
      },
    },
      tool.status === 'running'
        ? React.createElement('span', { 'aria-hidden': true, style: { width: 13, height: 13, border: '2px solid var(--border-strong)', borderTopColor: 'var(--action-accent)', borderRadius: '50%', animation: 'flowSpin 0.8s linear infinite' } })
        : React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 15, color: 'var(--status-success-text)' } }, 'check_circle'),
      React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 15 } }, tool.icon || 'bolt'),
      tool.label),
    React.createElement('div', {
      style: {
        maxWidth: '82%', padding: children ? '14px 16px' : '11px 16px', borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser ? 'var(--surface-inverse)' : 'var(--surface-card)',
        color: isUser ? 'var(--text-on-inverse)' : 'var(--text-primary)',
        border: isUser ? 'none' : '1px solid var(--border-subtle)',
        fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.55, boxShadow: isUser ? 'none' : 'var(--shadow-rest)',
        animation: 'flowIn var(--dur-fast) var(--ease-out)',
      },
    },
      text && React.createElement('span', null, text),
      streaming && React.createElement('span', {
        'aria-label': 'Escribiendo', role: 'status',
        style: { display: 'inline-flex', gap: 3, marginLeft: text ? 6 : 0, verticalAlign: 'middle' },
      }, [0, 1, 2].map(i => React.createElement('span', {
        key: i, 'aria-hidden': true,
        style: { width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', animation: 'flowDotPulse 1.1s ' + (i * 0.15) + 's ease-in-out infinite' },
      }))),
      children),
    timestamp && React.createElement('span', { style: { fontSize: 10.5, color: 'var(--text-muted)', padding: '0 4px' } }, timestamp));
}

F.ChatMessage = ChatMessage;
})();

// ---- components/ChatThread.jsx ----
(function(){

/** Scrollable message list; auto-scrolls to bottom on new messages. messages: [{id,role,text,tool,streaming,timestamp,content}] */
function ChatThread({ messages = [], emptyState, style }) {
  const ref = React.useRef(null);
  React.useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [messages.length, messages[messages.length - 1] && messages[messages.length - 1].text]);
  if (messages.length === 0 && emptyState) return emptyState;
  const ChatMessage = (window.Flow && window.Flow.ChatMessage) || function () { return null; };
  return React.createElement('div', { ref, style: { display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto', padding: '4px 2px', ...style } },
    messages.map(m => React.createElement(F.ChatMessage, {
      key: m.id, role: m.role, text: m.text, tool: m.tool, streaming: m.streaming, timestamp: m.timestamp,
    }, m.content)));
}

F.ChatThread = ChatThread;
})();

// ---- components/Tabs.jsx ----
(function(){

/** items: [{value, label, icon?, count?}] */
function Tabs({ items = [], value, onChange, variant = 'pill', style }) {
  const refs = React.useRef({});
  const [ind, setInd] = React.useState(null);
  const idx = items.findIndex((t) => t.value === value);

  React.useLayoutEffect(() => {
    const el = refs.current[value];
    if (el) setInd({ left: el.offsetLeft, width: el.offsetWidth });
  }, [value, items.length]);

  const onKey = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (idx + (e.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
    onChange && onChange(items[next].value);
    const el = refs.current[items[next].value];
    if (el) el.focus();
  };

  const pill = variant === 'pill';
  return React.createElement('div', {
    role: 'tablist', onKeyDown: onKey,
    style: {
      position: 'relative', display: 'inline-flex', gap: pill ? 4 : 20,
      background: pill ? 'var(--surface-sunken)' : 'transparent',
      borderRadius: pill ? 'var(--radius-pill)' : 0, padding: pill ? 4 : 0,
      borderBottom: pill ? 'none' : '1px solid var(--border-subtle)',
      fontFamily: 'var(--font-body)', ...style,
    },
  },
    ind && React.createElement('span', {
      'aria-hidden': true,
      style: pill ? {
        position: 'absolute', top: 4, bottom: 4, left: ind.left, width: ind.width,
        background: 'var(--surface-card)', borderRadius: 'var(--radius-pill)', boxShadow: 'var(--shadow-raised)',
        transition: 'left var(--dur-base) var(--ease-spring), width var(--dur-base) var(--ease-spring)',
      } : {
        position: 'absolute', bottom: -1, height: 2.5, left: ind.left, width: ind.width,
        background: 'var(--action-accent)', borderRadius: 999,
        transition: 'left var(--dur-base) var(--ease-spring), width var(--dur-base) var(--ease-spring)',
      },
    }),
    items.map((t) => {
      const active = t.value === value;
      return React.createElement('button', {
        key: t.value, role: 'tab', 'aria-selected': active, tabIndex: active ? 0 : -1, type: 'button',
        ref: (el) => { refs.current[t.value] = el; },
        onClick: () => onChange && onChange(t.value),
        style: {
          position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 6,
          // Las dos variantes parten de --hit-target-min: pill medía 36 y underline
          // 40, y una pestana es un objetivo tactil (tab-2).
          minHeight: 'var(--hit-target-min)', padding: pill ? '0 16px' : '0 2px',
          background: 'transparent', border: 'none', borderRadius: pill ? 'var(--radius-pill)' : 0,
          fontFamily: 'inherit', fontSize: 13.5, fontWeight: active ? 700 : 500, whiteSpace: 'nowrap',
          color: active ? 'var(--text-primary)' : 'var(--text-muted)', cursor: 'pointer', outline: 'none',
          transition: 'color var(--dur-fast) var(--ease-out)',
        },
      },
        t.icon && React.createElement('span', { className: 'flow-symbol' + (active ? ' flow-symbol--fill' : ''), 'aria-hidden': true, style: { fontSize: 18 } }, t.icon),
        t.label,
        t.count != null && React.createElement('span', {
          style: { fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, background: active ? 'var(--surface-accent-subtle)' : 'var(--border-subtle)', color: active ? 'var(--text-accent)' : 'var(--text-muted)', borderRadius: 999, padding: '1px 7px' },
        }, t.count));
    }));
}

F.Tabs = Tabs;
})();

// ---- components/Stepper.jsx ----
(function(){

/** steps: [{label, description?}] · current: 0-based index */
function Stepper({ steps = [], current = 0, orientation = 'horizontal', style }) {
  const horiz = orientation === 'horizontal';
  return React.createElement('ol', {
    style: {
      display: 'flex', flexDirection: horiz ? 'row' : 'column', alignItems: horiz ? 'flex-start' : 'stretch',
      gap: horiz ? 0 : 4, listStyle: 'none', margin: 0, padding: 0, fontFamily: 'var(--font-body)', ...style,
    },
  },
    // El progreso se dice en texto para quien no ve los circulos: aria-current
    // marca el paso, pero "paso 2 de 4" es lo que se puede oir (stp-1).
    React.createElement('span', {
      style: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' },
    }, 'Paso ' + (current + 1) + ' de ' + steps.length + (steps[current] ? ': ' + (steps[current].label || '') : '')),
  steps.map((s, i) => {
    const done = i < current, active = i === current;
    const dot = React.createElement('span', {
      'aria-hidden': true,
      style: {
        width: 30, height: 30, borderRadius: '50%', flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: done ? 'var(--action-accent)' : active ? 'var(--surface-inverse)' : 'var(--surface-card)',
        color: done || active ? 'var(--text-on-inverse)' : 'var(--text-muted)',
        border: done || active ? 'none' : '1.5px solid var(--border-default)',
        fontSize: 13, fontWeight: 700,
        boxShadow: active ? 'var(--shadow-accent-glow)' : 'none',
        transform: active ? 'scale(1.1)' : 'scale(1)',
        transition: 'all var(--dur-base) var(--ease-spring)',
      },
    }, done ? React.createElement('span', { className: 'flow-symbol', style: { fontSize: 16, animation: 'flowScaleIn var(--dur-fast) var(--ease-spring)' } }, 'check') : i + 1);
    const text = React.createElement('span', { style: { display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 } },
      React.createElement('span', { style: { fontSize: 13, fontWeight: active ? 700 : 500, color: active || done ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' } }, s.label),
      s.description && React.createElement('span', { style: { fontSize: 11.5, color: 'var(--text-muted)' } }, s.description));
    const connector = i < steps.length - 1 && React.createElement('span', {
      'aria-hidden': true,
      style: horiz
        ? { flex: 1, height: 2, margin: '14px 10px 0', borderRadius: 999, background: i < current ? 'var(--action-accent)' : 'var(--border-default)', minWidth: 24, transition: 'background var(--dur-base) var(--ease-out)' }
        : { width: 2, height: 22, margin: '2px 0 2px 14px', borderRadius: 999, background: i < current ? 'var(--action-accent)' : 'var(--border-default)', transition: 'background var(--dur-base) var(--ease-out)' },
    });
    return React.createElement(React.Fragment, { key: i },
      React.createElement('li', {
        'aria-current': active ? 'step' : undefined,
        style: { display: 'flex', alignItems: 'center', gap: 10, flexDirection: horiz ? 'column' : 'row', textAlign: horiz ? 'center' : 'left', flex: 'none' },
      }, dot, text),
      connector);
  }));
}

F.Stepper = Stepper;
})();

// ---- components/Breadcrumb.jsx ----
(function(){

/** items: [{label, href?, onClick?}] — last item is the current page */
function Breadcrumb({ items = [], style }) {
  return React.createElement('nav', { 'aria-label': 'Ruta', style: { fontFamily: 'var(--font-body)', ...style } },
    React.createElement('ol', { style: { display: 'flex', alignItems: 'center', gap: 4, listStyle: 'none', margin: 0, padding: 0, flexWrap: 'wrap' } },
      items.map((it, i) => {
        const last = i === items.length - 1;
        return React.createElement('li', { key: i, style: { display: 'flex', alignItems: 'center', gap: 4 } },
          last
            ? React.createElement('span', { 'aria-current': 'page', style: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', minHeight: 'var(--hit-target-min)', padding: '0 6px' } }, it.label)
            : React.createElement('a', {
              href: it.href || '#',
              onClick: it.onClick ? (e) => { e.preventDefault(); it.onClick(); } : undefined,
              style: {
                fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none',
                // El enlace es un objetivo tactil: medía 16px de alto (brc-4).
                display: 'inline-flex', alignItems: 'center', minHeight: 'var(--hit-target-min)',
                padding: '0 6px', borderRadius: 'var(--radius-sm)',
                transition: 'color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)',
              },
              onMouseEnter: (e) => { e.currentTarget.style.color = 'var(--text-accent)'; e.currentTarget.style.background = 'var(--surface-sunken)'; },
              onMouseLeave: (e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; },
            }, it.label),
          !last && React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 16, color: 'var(--text-disabled)' } }, 'chevron_right'));
      })));
}

F.Breadcrumb = Breadcrumb;
})();

// ---- components/Pagination.jsx ----
(function(){

function Pagination({ page = 1, pages = 1, onChange, style }) {
  const go = (p) => { if (p >= 1 && p <= pages && p !== page) onChange && onChange(p); };
  const nums = [];
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - page) <= 1) nums.push(p);
    else if (nums[nums.length - 1] !== '…') nums.push('…');
  }
  const btn = (content, opts) => React.createElement('button', {
    type: 'button', disabled: opts.disabled,
    'aria-label': opts.aria, 'aria-current': opts.current ? 'page' : undefined,
    onClick: opts.onClick,
    onMouseEnter: (e) => { if (!opts.disabled && !opts.current) e.currentTarget.style.background = 'var(--surface-sunken)'; },
    onMouseLeave: (e) => { if (!opts.current) e.currentTarget.style.background = 'transparent'; },
    style: {
      minWidth: 'var(--hit-target-min)', height: 'var(--hit-target-min)', padding: '0 8px', border: 'none', borderRadius: 'var(--radius-pill)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: opts.current ? 700 : 500,
      background: opts.current ? 'var(--surface-inverse)' : 'transparent',
      color: opts.current ? 'var(--text-on-inverse)' : opts.disabled ? 'var(--text-disabled)' : 'var(--text-secondary)',
      cursor: opts.disabled || opts.current ? 'default' : 'pointer',
      transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-spring)',
    },
  }, content);
  return React.createElement('nav', { 'aria-label': 'Paginación', style: { display: 'flex', alignItems: 'center', gap: 4, ...style } },
    btn(React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 18 } }, 'chevron_left'), { aria: 'Página anterior', disabled: page <= 1, onClick: () => go(page - 1) }),
    nums.map((n, i) => n === '…'
      ? React.createElement('span', { key: 'e' + i, style: { padding: '0 4px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13 } }, '…')
      : btn(n, { key: n, aria: 'Página ' + n, current: n === page, onClick: () => go(n) })),
    btn(React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 18 } }, 'chevron_right'), { aria: 'Página siguiente', disabled: page >= pages, onClick: () => go(page + 1) }));
}

F.Pagination = Pagination;
})();

// ---- components/SegmentedControl.jsx ----
(function(){

/** Full-width equal-segment switcher for mobile. items: [{value,label,icon?}] */
function SegmentedControl({ items = [], value, onChange, style }) {
  const refs = React.useRef({});
  const [ind, setInd] = React.useState(null);
  React.useLayoutEffect(() => {
    const el = refs.current[value];
    if (el) setInd({ left: el.offsetLeft, width: el.offsetWidth });
  }, [value, items.length]);
  return React.createElement('div', {
    role: 'tablist',
    style: { position: 'relative', display: 'flex', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-pill)', padding: 4, fontFamily: 'var(--font-body)', ...style },
  },
    ind && React.createElement('span', {
      'aria-hidden': true,
      style: { position: 'absolute', top: 4, bottom: 4, left: ind.left, width: ind.width, background: 'var(--surface-card)', borderRadius: 999, boxShadow: 'var(--shadow-raised)', transition: 'left var(--dur-base) var(--ease-spring), width var(--dur-base) var(--ease-spring)' },
    }),
    items.map(t => {
      const active = t.value === value;
      return React.createElement('button', {
        key: t.value, role: 'tab', 'aria-selected': active, type: 'button',
        ref: el => { refs.current[t.value] = el; },
        onClick: () => onChange && onChange(t.value),
        style: {
          position: 'relative', zIndex: 1, flex: 1, minHeight: 'var(--hit-target-min)', border: 'none', background: 'transparent',
          borderRadius: 999, fontFamily: 'inherit', fontSize: 13.5, fontWeight: active ? 700 : 500,
          color: active ? 'var(--text-primary)' : 'var(--text-muted)', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          transition: 'color var(--dur-fast) var(--ease-out)',
        },
      },
        t.icon && React.createElement('span', { className: 'flow-symbol' + (active ? ' flow-symbol--fill' : ''), 'aria-hidden': true, style: { fontSize: 17 } }, t.icon),
        t.label);
    }));
}

F.SegmentedControl = SegmentedControl;
})();

// ---- primitives/Spinner.jsx ----
(function(){

function Spinner({ size = 24, color = 'var(--action-accent)', label = 'Cargando', style }) {
  return React.createElement('span', {
    role: 'status', 'aria-label': label,
    style: {
      display: 'inline-block', width: size, height: size, flex: 'none',
      border: Math.max(2, size / 9) + 'px solid var(--border-subtle)',
      borderTopColor: color, borderRadius: '50%',
      animation: 'flowSpin .7s linear infinite', ...style,
    },
  });
}

F.Spinner = Spinner;
})();

// ---- primitives/Progress.jsx ----
(function(){

function Progress({ value = 0, max = 100, label, showValue = false, tone = 'accent', size = 'md', style }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const color = { accent: 'var(--action-accent)', success: 'var(--status-success)', warning: 'var(--status-warning)', ink: 'var(--surface-inverse)' }[tone] || 'var(--action-accent)';
  const h = size === 'sm' ? 6 : 10;
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)', ...style } },
    (label || showValue) && React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } },
      React.createElement('span', { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' } }, label),
      showValue && React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' } }, Math.round(pct) + '%')),
    React.createElement('div', {
      role: 'progressbar', 'aria-valuenow': value, 'aria-valuemin': 0, 'aria-valuemax': max, 'aria-label': label,
      style: { height: h, borderRadius: 999, background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', overflow: 'hidden' },
    }, React.createElement('div', {
      style: { width: pct + '%', height: '100%', borderRadius: 999, background: color, transition: 'width var(--dur-slow) var(--ease-out)' },
    })));
}

F.Progress = Progress;
})();

// ---- components/Tooltip.jsx ----
(function(){

/** Burbuja de apoyo. El anclaje, la colision, el portal y Escape los resuelve
 *  Popover con surface="none": la piel inversa la pinta este archivo, la
 *  posicion no. Ver contracts/popover.json.
 */
function Tooltip({ content, position = 'top', children, style }) {
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
    React.createElement(F.Popover, {
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

F.Tooltip = Tooltip;
})();

// ---- components/Dialog.jsx ----
(function(){

let uid = 0;

function Dialog({ open = false, onClose, title, description, children, actions, width = 440, tone, style }) {
  const titleId = React.useRef('flow-dlg-' + (++uid)).current;
  const toneIcon = { danger: ['warning', 'var(--status-danger)', 'var(--status-danger-bg)'], success: ['check_circle', 'var(--status-success-text)', 'var(--status-success-bg)'] }[tone];

  return React.createElement(F.OverlayShell, {
    open, onClose, align: 'center',
    labelledBy: typeof title === 'string' ? titleId : undefined,
    label: typeof title === 'string' ? undefined : 'Diálogo',
  },
    React.createElement('div', {
      style: {
        background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)', width, maxWidth: '100%',
        boxShadow: 'var(--shadow-overlay)', padding: 28, boxSizing: 'border-box',
        fontFamily: 'var(--font-body)', color: 'var(--text-primary)', ...style,
      },
    },
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 14 } },
        toneIcon && React.createElement('span', {
          style: { width: 44, height: 44, borderRadius: '50%', background: toneIcon[2], display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' },
        }, React.createElement('span', { className: 'flow-symbol flow-symbol--fill', 'aria-hidden': true, style: { fontSize: 24, color: toneIcon[1] } }, toneIcon[0])),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          title && React.createElement('div', { id: titleId, style: { fontSize: 18, fontWeight: 700, letterSpacing: 'var(--tracking-tight)' } }, title),
          description && React.createElement('div', { style: { fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55, marginTop: 6 } }, description)),
        onClose && React.createElement('button', {
          type: 'button', 'aria-label': 'Cerrar', onClick: onClose,
          style: { width: 'var(--hit-target-min)', height: 'var(--hit-target-min)', flex: 'none', border: 'none', background: 'transparent', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background var(--dur-instant) var(--ease-out)', margin: '-6px -6px 0 0' },
          onMouseEnter: (e) => e.currentTarget.style.background = 'var(--surface-sunken)',
          onMouseLeave: (e) => e.currentTarget.style.background = 'transparent',
        }, React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 20 } }, 'close'))),
      children && React.createElement('div', { style: { marginTop: 18 } }, children),
      actions && React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 } }, actions)));
}

F.Dialog = Dialog;
})();

// ---- components/Toast.jsx ----
(function(){

const TONES = {
  neutral: { icon: 'info', color: 'var(--text-on-inverse)' },
  success: { icon: 'check_circle', color: 'var(--status-success)' },
  warning: { icon: 'warning', color: 'var(--status-warning)' },
  danger: { icon: 'error', color: 'var(--status-danger)' },
};

function Toast({ tone = 'neutral', message, actionLabel, onAction, onDismiss, style }) {
  const t = TONES[tone] || TONES.neutral;
  return React.createElement('div', {
    role: 'status',
    style: {
      display: 'flex', alignItems: 'center', gap: 12,
      background: 'var(--surface-inverse)', color: 'var(--text-on-inverse)',
      borderRadius: 'var(--radius-lg)', padding: '14px 18px', minWidth: 280, maxWidth: 420,
      boxShadow: 'var(--shadow-overlay)', fontFamily: 'var(--font-body)', fontSize: 13.5,
      animation: 'flowIn var(--dur-base) var(--ease-spring)', ...style,
    },
  },
    React.createElement('span', { className: 'flow-symbol flow-symbol--fill', 'aria-hidden': true, style: { fontSize: 20, color: t.color, flex: 'none' } }, t.icon),
    React.createElement('span', { style: { flex: 1, lineHeight: 1.45 } }, message),
    actionLabel && React.createElement('button', {
      type: 'button', onClick: onAction,
      style: { border: 'none', background: 'transparent', color: 'var(--text-accent-on-inverse)', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: '6px 8px', borderRadius: 8, whiteSpace: 'nowrap' },
    }, actionLabel),
    onDismiss && React.createElement('button', {
      type: 'button', 'aria-label': 'Cerrar aviso', onClick: onDismiss,
      style: { border: 'none', background: 'transparent', color: 'inherit', opacity: 0.6, cursor: 'pointer', display: 'inline-flex', padding: 4, borderRadius: '50%' },
    }, React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 18 } }, 'close')));
}

/** Fixed-position stack, bottom center. */
function ToastStack({ children, style }) {
  return React.createElement('div', {
    style: { position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 90, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', ...style },
  }, children);
}

F.Toast = Toast;
})();

// ---- components/Drawer.jsx ----
(function(){

let uid = 0;

function Drawer({ open = false, onClose, title, children, footer, width = 400, side = 'right', style }) {
  const titleId = React.useRef('flow-drw-' + (++uid)).current;
  return React.createElement(F.OverlayShell, {
    open, onClose, align: side === 'right' ? 'end' : 'side-start', zIndex: 95,
    labelledBy: typeof title === 'string' ? titleId : undefined,
    label: typeof title === 'string' ? undefined : 'Panel',
  },
    React.createElement('aside', {
      style: {
        width, maxWidth: '92vw', height: '100%', boxSizing: 'border-box',
        background: 'var(--surface-card)', boxShadow: 'var(--shadow-overlay)',
        borderRadius: side === 'right' ? '28px 0 0 28px' : '0 28px 28px 0',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font-body)', color: 'var(--text-primary)', ...style,
      },
    },
      React.createElement('header', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '22px 24px 14px', flex: 'none' } },
        React.createElement('div', { id: titleId, style: { flex: 1, fontSize: 17, fontWeight: 700, letterSpacing: 'var(--tracking-tight)' } }, title),
        onClose && React.createElement('button', {
          type: 'button', 'aria-label': 'Cerrar', onClick: onClose,
          style: { width: 'var(--hit-target-min)', height: 'var(--hit-target-min)', border: 'none', background: 'transparent', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background var(--dur-instant) var(--ease-out)' },
          onMouseEnter: (e) => e.currentTarget.style.background = 'var(--surface-sunken)',
          onMouseLeave: (e) => e.currentTarget.style.background = 'transparent',
        }, React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 20 } }, 'close'))),
      React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '4px 24px 24px' } }, children),
      footer && React.createElement('footer', { style: { flex: 'none', padding: '14px 24px 22px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: 10 } }, footer)));
}

F.Drawer = Drawer;
})();

// ---- components/BottomSheet.jsx ----
(function(){

let uid = 0;

/** Sheet movil con asa. fixed=false para vivir dentro de un contenedor relativo (marco de telefono). */
function BottomSheet({ open = false, onClose, title, children, height = 'auto', fixed = true, style }) {
  const titleId = React.useRef('flow-bs-' + (++uid)).current;
  return React.createElement(F.OverlayShell, {
    open, onClose, align: 'bottom', fixed, zIndex: 96,
    labelledBy: typeof title === 'string' ? titleId : undefined,
    label: typeof title === 'string' ? undefined : 'Panel',
  },
    React.createElement('section', {
      style: {
        background: 'var(--surface-card)', borderRadius: '28px 28px 0 0', boxShadow: 'var(--shadow-overlay)',
        maxHeight: '86%', height, display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font-body)', color: 'var(--text-primary)', ...style,
      },
    },
      React.createElement('button', {
        type: 'button', 'aria-label': 'Cerrar', onClick: onClose,
        style: { border: 'none', background: 'transparent', padding: 0, minHeight: 'var(--hit-target-min)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' },
      }, React.createElement('span', { 'aria-hidden': true, style: { width: 40, height: 5, borderRadius: 999, background: 'var(--border-default)' } })),
      title && React.createElement('div', { id: titleId, style: { padding: '6px 24px 12px', fontSize: 17, fontWeight: 700, letterSpacing: 'var(--tracking-tight)', flex: 'none' } }, title),
      React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '0 24px 28px' } }, children)));
}

F.BottomSheet = BottomSheet;
})();

// ---- components/BiometricPrompt.jsx ----
(function(){

/** Biometric auth sheet: face or fingerprint, with scanning/success/error states. */
function BiometricPrompt({ method = 'face', state = 'idle', title, description, onUse, onFallback, fallbackLabel = 'Usar passcode', style }) {
  const icon = method === 'face' ? 'ar_on_you' : 'fingerprint';
  const stateColor = { idle: 'var(--text-primary)', scanning: 'var(--text-accent)', success: 'var(--status-success-text)', error: 'var(--status-danger-text)' }[state];
  const stateIcon = state === 'success' ? 'check_circle' : state === 'error' ? 'error' : icon;
  return React.createElement('div', {
    style: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center',
      background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)', padding: '32px 28px 24px',
      boxShadow: 'var(--shadow-overlay)', fontFamily: 'var(--font-body)', maxWidth: 320,
      animation: state === 'error' ? 'flowShake 320ms var(--ease-out)' : 'none', ...style,
    },
  },
    React.createElement('span', {
      style: {
        width: 84, height: 84, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: state === 'success' ? 'var(--status-success-bg)' : state === 'error' ? 'var(--status-danger-bg)' : 'var(--surface-sunken)',
        position: 'relative',
      },
    },
      state === 'scanning' && React.createElement('span', {
        'aria-hidden': true,
        style: { position: 'absolute', inset: -4, borderRadius: '50%', border: '2.5px solid var(--action-accent)', borderTopColor: 'transparent', animation: 'flowSpin 1s linear infinite' },
      }),
      React.createElement('span', {
        className: 'flow-symbol' + (state === 'success' ? ' flow-symbol--fill' : ''), 'aria-hidden': true,
        style: { fontSize: 44, color: stateColor, animation: state === 'success' ? 'flowScaleIn var(--dur-base) var(--ease-spring)' : 'none', transition: 'color var(--dur-fast) var(--ease-out)' },
      }, stateIcon)),
    React.createElement('div', { style: { fontSize: 16, fontWeight: 700, marginTop: 6 } }, title || (method === 'face' ? 'Face ID' : 'Huella digital')),
    React.createElement('div', { role: 'status', style: { fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55 } },
      description || { idle: 'Confirma tu identidad para continuar.', scanning: 'Verificando…', success: 'Identidad confirmada.', error: 'No pudimos verificarte. Intenta de nuevo.' }[state]),
    onUse && state !== 'success' && React.createElement('button', {
      type: 'button', onClick: onUse,
      style: { marginTop: 10, minHeight: 44, padding: '0 24px', border: 'none', borderRadius: 999, background: 'var(--action-primary)', color: 'var(--text-on-inverse)', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'transform var(--dur-fast) var(--ease-spring)' },
      onMouseEnter: (e) => e.currentTarget.style.transform = 'scale(1.04)',
      onMouseLeave: (e) => e.currentTarget.style.transform = 'none',
    }, state === 'error' ? 'Reintentar' : 'Verificar'),
    onFallback && React.createElement('button', {
      type: 'button', onClick: onFallback,
      style: { border: 'none', background: 'transparent', color: 'var(--text-accent)', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', padding: '10px 12px', borderRadius: 10 },
    }, fallbackLabel));
}

F.BiometricPrompt = BiometricPrompt;
})();

// ---- components/NotificationCenter.jsx ----
(function(){

const TONE = {
  info: ['info', 'var(--status-info-text)', 'var(--status-info-bg)'],
  success: ['check_circle', 'var(--status-success-text)', 'var(--status-success-bg)'],
  warning: ['warning', 'var(--status-warning-text)', 'var(--status-warning-bg)'],
  danger: ['error', 'var(--status-danger-text)', 'var(--status-danger-bg)'],
};

/** Bell trigger + dropdown panel of notifications. items: [{id,tone,title,desc,time,read}] */
function NotificationCenter({ items = [], onItemClick, onMarkAllRead, align = 'right', style }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const unread = items.filter(i => !i.read).length;

  React.useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return React.createElement('div', { ref, style: { position: 'relative', display: 'inline-flex', ...style } },
    React.createElement('button', {
      type: 'button', 'aria-label': 'Notificaciones' + (unread ? ' (' + unread + ' sin leer)' : ''), onClick: () => setOpen(!open),
      style: {
        position: 'relative', width: 'var(--hit-target-min)', height: 'var(--hit-target-min)', borderRadius: 'var(--radius-pill)', border: 'none',
        background: 'var(--surface-sunken)', color: 'var(--text-primary)', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'transform var(--dur-fast) var(--ease-spring)',
      },
      onMouseEnter: (e) => e.currentTarget.style.transform = 'scale(1.06)',
      onMouseLeave: (e) => e.currentTarget.style.transform = 'none',
    },
      React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 20 } }, 'notifications'),
      unread > 0 && React.createElement('span', {
        'aria-hidden': true,
        style: {
          position: 'absolute', top: 5, right: 6, minWidth: 16, height: 16, borderRadius: 999, background: 'var(--status-live)',
          color: 'var(--text-on-accent)', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px',
          border: '2px solid var(--surface-card)', animation: 'flowScaleIn var(--dur-fast) var(--ease-spring)',
        },
      }, unread > 9 ? '9+' : unread)),
    open && React.createElement('div', {
      role: 'dialog', 'aria-label': 'Notificaciones',
      style: {
        position: 'absolute', top: 'calc(100% + 8px)', [align === 'right' ? 'right' : 'left']: 0, zIndex: 60, width: 360,
        background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-float)', overflow: 'hidden', animation: 'flowScaleIn var(--dur-fast) var(--ease-out)',
        transformOrigin: align === 'right' ? 'top right' : 'top left',
      },
    },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', padding: '14px 16px 10px', borderBottom: '1px solid var(--border-subtle)' } },
        React.createElement('span', { style: { fontSize: 14, fontWeight: 700 } }, 'Notificaciones'),
        unread > 0 && onMarkAllRead && React.createElement('button', {
          type: 'button', onClick: onMarkAllRead,
          style: { marginLeft: 'auto', border: 'none', background: 'transparent', color: 'var(--text-accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
        }, 'Marcar todo leido')),
      React.createElement('div', { style: { maxHeight: 360, overflowY: 'auto' } },
        items.length === 0
          ? React.createElement('div', { style: { padding: '32px 16px', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' } }, 'Sin notificaciones nuevas.')
          : items.map(it => {
            const [icon, fg, bg] = TONE[it.tone] || TONE.info;
            return React.createElement('button', {
              key: it.id, type: 'button', onClick: onItemClick ? () => onItemClick(it) : undefined,
              style: {
                display: 'flex', gap: 12, width: '100%', textAlign: 'left', border: 'none', background: it.read ? 'transparent' : 'var(--surface-accent-subtle)',
                borderBottom: '1px solid var(--border-subtle)', padding: '12px 16px', cursor: onItemClick ? 'pointer' : 'default', fontFamily: 'var(--font-body)',
              },
              onMouseEnter: (e) => e.currentTarget.style.background = 'var(--surface-sunken)',
              onMouseLeave: (e) => e.currentTarget.style.background = it.read ? 'transparent' : 'var(--surface-accent-subtle)',
            },
              React.createElement('span', { 'aria-hidden': true, style: { width: 34, height: 34, borderRadius: '50%', background: bg, flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' } },
                React.createElement('span', { className: 'flow-symbol', style: { fontSize: 17, color: fg } }, icon)),
              React.createElement('span', { style: { flex: 1, minWidth: 0 } },
                React.createElement('div', { style: { fontSize: 13, fontWeight: it.read ? 500 : 700, color: 'var(--text-primary)' } }, it.title),
                it.desc && React.createElement('div', { style: { fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 } }, it.desc),
                it.time && React.createElement('div', { style: { fontSize: 11, color: 'var(--text-muted)', marginTop: 3 } }, it.time)),
              !it.read && React.createElement('span', { 'aria-hidden': true, style: { width: 8, height: 8, borderRadius: '50%', background: 'var(--status-live)', flex: 'none', marginTop: 4 } }));
          }))));
}

F.NotificationCenter = NotificationCenter;
})();

// ---- components/InputAmount.jsx ----
(function(){

/** Control de monto: prefijo de moneda, miles y decimales de la locale, alineado a la derecha.
 *  No trae label: eso es Field. Ver contracts/input-amount.json. */
function InputAmount({
  id, value = '', onChange, placeholder = '0.00', currency = '$', locale = 'es-MX',
  size = 'md', disabled = false, invalid = false, style, ...rest
}) {
  // La locale decide los separadores. es-MX usa punto decimal y coma de miles:
  // asumir el patron de es-ES rompia todo monto escrito en Mexico.
  const parts = React.useMemo(() => {
    const s = (1234.5).toLocaleString(locale, { minimumFractionDigits: 2 });
    return { group: s.replace(/[\d]/g, '').charAt(0), decimal: s.replace(/[\d]/g, '').slice(-1) };
  }, [locale]);

  const toNumber = (raw) => {
    const cleaned = String(raw)
      .split(parts.group).join('')
      .split(parts.decimal).join('.')
      .replace(/[^\d.]/g, '');
    const n = parseFloat(cleaned);
    return isNaN(n) ? null : n;
  };

  // Mientras el campo tiene foco se muestra lo que la persona escribe: reformatear en
  // cada tecla mueve el caret detras de los decimales y la siguiente tecla cae ahi.
  const [draft, setDraft] = React.useState(null);
  const formatted = React.useMemo(() => {
    if (value === '' || value == null) return '';
    const n = typeof value === 'number' ? value : toNumber(value);
    if (n == null) return '';
    return n.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [value, locale]);
  const display = draft != null ? draft : formatted;

  return React.createElement(F.ControlShell, {
    size, invalid, disabled, style,
    leading: React.createElement('span', {
      style: { fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', flexShrink: 0 },
    }, currency),
  },
    React.createElement('input', {
      id, type: 'text', inputMode: 'decimal', disabled, placeholder,
      'aria-invalid': invalid || undefined,
      value: display,
      onChange: (e) => {
        setDraft(e.target.value);
        if (!onChange) return;
        const n = toNumber(e.target.value);
        onChange(n == null ? '' : n);
      },
      onBlur: (e) => {
        setDraft(null);
        if (rest.onBlur) rest.onBlur(e);
      },
      style: {
        flex: 1, minWidth: 0, alignSelf: 'stretch', border: 'none', outline: 'none', background: 'transparent', padding: 0,
        fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-primary)', textAlign: 'right',
      },
      ...rest,
    })
  );
}

F.InputAmount = InputAmount;
})();

// ---- components/InputPhone.jsx ----
(function(){

/** Control telefonico: lada como prefijo fijo y agrupacion 3-3-4 sobre los digitos.
 *  No trae label: eso es Field. El pais se elige con Select, no aqui. */
function InputPhone({
  id, value = '', onChange, placeholder = '55 1234 5678', prefix = '+52',
  size = 'md', disabled = false, invalid = false, style, ...rest
}) {
  const mask = (digits) => {
    const d = String(digits).replace(/\D/g, '').slice(0, 10);
    if (d.length <= 2) return d;
    if (d.length <= 6) return d.slice(0, 2) + ' ' + d.slice(2);
    return d.slice(0, 2) + ' ' + d.slice(2, 6) + ' ' + d.slice(6);
  };

  return React.createElement(F.ControlShell, {
    size, invalid, disabled, style,
    leading: React.createElement('span', {
      style: { fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-muted)', flexShrink: 0 },
    }, prefix),
  },
    React.createElement('input', {
      id, type: 'tel', inputMode: 'tel', disabled, placeholder,
      'aria-invalid': invalid || undefined,
      value: mask(value),
      onChange: (e) => onChange && onChange(String(e.target.value).replace(/\D/g, '').slice(0, 10)),
      style: {
        flex: 1, minWidth: 0, alignSelf: 'stretch', border: 'none', outline: 'none', background: 'transparent', padding: 0,
        fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-primary)',
      },
      ...rest,
    })
  );
}

F.InputPhone = InputPhone;
})();

// ---- components/TableTree.jsx ----
(function(){

/** Tabla en arbol. rows: [{id, label, ...data, children: []}] */
function TableTree({ columns = [], rows = [], rowKey = 'id', onRowClick, selectedKey, style }) {
  return React.createElement(F.DataGrid, {
    columns, rows, rowKey, onRowClick, selectedKey, tree: true, style,
  });
}

F.TableTree = TableTree;
})();

// ---- components/BulkActionsTable.jsx ----
(function(){

/** Pattern de seleccion multiple + toolbar de acciones. La grid la pone DataGrid; esto es el flujo. */
function BulkActionsTable({ columns = [], rows = [], rowKey, actions = [], onActionClick, style }) {
  const [selection, setSelection] = React.useState([]);
  const n = selection.length;

  return React.createElement('div', { style: { ...style } },
    n > 0 && React.createElement('div', {
      role: 'toolbar', 'aria-label': 'Acciones sobre la selección',
      style: {
        background: 'var(--surface-accent-subtle)', border: '1px solid var(--border-focus)',
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        animation: 'flowScaleIn var(--dur-fast) var(--ease-out)',
      },
    },
      React.createElement('span', {
        'aria-live': 'polite',
        style: { fontSize: 13, fontWeight: 600, color: 'var(--text-accent)' },
      }, n + ' seleccionado' + (n > 1 ? 's' : '')),
      React.createElement('div', { style: { flex: 1 } }),
      actions.map((a) => React.createElement(F.Button, {
        // El borde, el radio y el foco los pone Button: esta barra los declaraba
        // por su cuenta y era una de las dos infracciones de R3 que quedaban.
        key: a.id, variant: a.danger ? 'danger' : 'secondary', size: 'sm', icon: a.icon,
        onClick: () => onActionClick && onActionClick(a.id, selection.slice()),
      }, a.label)),
      React.createElement(F.IconButton, {
        // El glifo mide 18; el objetivo, --hit-target-min. Medía 18x18.
        icon: 'close', ariaLabel: 'Limpiar selección', variant: 'ghost', size: 'sm',
        onClick: () => setSelection([]),
      })),
    React.createElement(F.DataGrid, {
      columns, rows, rowKey, zebra: true,
      selection, onSelectionChange: setSelection,
      style: n > 0 ? { borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', borderTop: 'none' } : undefined,
    }));
}

F.BulkActionsTable = BulkActionsTable;
})();

// ---- components/CardMedia.jsx ----
(function(){

/** Card con imagen de fondo o portada. */
function CardMedia({ 
  image, title, description, interactive = false, onClick, style 
}) {
  const [hover, setHover] = React.useState(false);
  const lift = interactive && hover;

  return React.createElement(interactive ? 'button' : 'div', {
    onClick: interactive ? onClick : undefined,
    type: interactive ? 'button' : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'block', width: interactive ? '100%' : undefined, textAlign: 'left', boxSizing: 'border-box',
      overflow: 'hidden', borderRadius: 'var(--radius-lg)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      cursor: interactive ? 'pointer' : 'default',
      boxShadow: lift ? 'var(--shadow-float)' : 'var(--shadow-rest)',
      transform: lift ? 'var(--lift-hover)' : 'none',
      transition: 'transform var(--dur-fast) var(--ease-spring), box-shadow var(--dur-fast) var(--ease-out)',
      outline: 'none',
      ...style,
    },
  },
    image && React.createElement('div', {
      style: {
        width: '100%', height: 200, background: `url(${image})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }
    }),
    React.createElement('div', { style: { padding: 'var(--pad-card)' } },
      title && React.createElement('h3', {
        style: { margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }
      }, title),
      description && React.createElement('p', {
        style: { margin: title ? '8px 0 0 0' : 0, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }
      }, description)
    )
  );
}

F.CardMedia = CardMedia;
})();

// ---- components/GanttChart.jsx ----
(function(){

/** Gantt chart: timeline de tareas con dependencias. */
function GanttChart({
  tasks = [], style
}) {
  // tasks: [{id, name, start, end, progress, color}]
  if (!tasks.length) return React.createElement('div', {
    style: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 6, minHeight: 120, color: 'var(--text-muted)', font: 'var(--type-caption)',
    },
  },
    React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 22 } }, 'bar_chart'),
    'Sin datos para este periodo');
  const dates = tasks.flatMap(t => [new Date(t.start), new Date(t.end)]);
  const minDate = dates.length > 0 ? new Date(Math.min(...dates)) : new Date();
  const maxDate = dates.length > 0 ? new Date(Math.max(...dates)) : new Date();
  const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) || 1;
  const msPerDay = totalDays > 0 ? 100 / totalDays : 100;

  const getPosition = (dateStr) => {
    const d = new Date(dateStr);
    const days = (d - minDate) / (1000 * 60 * 60 * 24);
    return days * msPerDay;
  };

  const getWidth = (start, end) => {
    const startDays = (new Date(start) - minDate) / (1000 * 60 * 60 * 24);
    const endDays = (new Date(end) - minDate) / (1000 * 60 * 60 * 24);
    return (endDays - startDays) * msPerDay;
  };

  return React.createElement('div', {
    style: {
      background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', padding: '16px', boxShadow: 'var(--shadow-rest)',
      ...style
    }
  },
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
      tasks.map((task) => React.createElement('div', {
        key: task.id, style: { display: 'flex', alignItems: 'center', gap: 12 }
      },
        React.createElement('div', {
          style: { width: 120, flexShrink: 0, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }
        }, task.name),
        React.createElement('div', {
          style: {
            flex: 1, position: 'relative', height: 24, background: 'var(--surface-sunken)',
            borderRadius: 'var(--radius-sm)', overflow: 'hidden'
          }
        },
          React.createElement('div', {
            style: {
              position: 'absolute', left: getPosition(task.start) + '%', width: getWidth(task.start, task.end) + '%',
              height: '100%', background: task.color || 'var(--action-accent)',
              borderRadius: 'var(--radius-sm)', opacity: task.progress ? 1 : 0.4,
              transition: 'all var(--dur-fast) var(--ease-out)',
            }
          },
            task.progress && React.createElement('div', {
              style: {
                position: 'absolute', top: 0, left: 0, height: '100%',
                width: (task.progress * 100) + '%', background: 'var(--status-success)',
                opacity: 0.6, transition: 'width var(--dur-fast) var(--ease-out)',
              }
            })
          )
        )
      ))
    )
  );
}

F.GanttChart = GanttChart;
})();

// ---- components/KanbanBoard.jsx ----
(function(){

const R = React.createElement;
const SR = { position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 };

/**
 * Tablero por etapa. El board pone columnas, movimiento y el shell del detalle;
 * la tarjeta la dibuja la pantalla con renderCard. Ver contracts/chart-kanban.json.
 *
 * El rechazo no se anima con keyframes a proposito: el borde de la columna cambia
 * por transicion y el mensaje sale por la region viva, asi que R3 sigue en pie y
 * el aviso llega tambien a quien no ve el tablero.
 */
function KanbanBoard({
  columns = [], items = [], columnKey = 'columnId', itemKey = 'id',
  renderCard, renderColumnHeader, columnStyle, onMove, onAdvance, abandonColumn, renderDetail,
  detailKey, onDetailChange, style,
}) {
  const [drag, setDrag] = React.useState(null);
  const [over, setOver] = React.useState(null);
  const [reject, setReject] = React.useState(null);
  const [msg, setMsg] = React.useState('');
  const [openLocal, setOpenLocal] = React.useState(null);
  const [focusKey, setFocusKey] = React.useState(null);
  const cards = React.useRef({});
  const scroller = React.useRef(null);

  const all = abandonColumn ? columns.concat([{ ...abandonColumn, abandon: true }]) : columns;
  const keyOf = (it) => String(it[itemKey]);
  const grouped = {};
  all.forEach((c) => { grouped[c.id] = []; });
  items.forEach((it) => { const c = String(it[columnKey]); if (grouped[c]) grouped[c].push(it); });

  const controlled = detailKey !== undefined;
  const openId = controlled ? detailKey : openLocal;
  const setOpen = (k) => {
    if (!controlled) setOpenLocal(k);
    if (onDetailChange) onDetailChange(k);
  };

  React.useEffect(() => {
    if (!reject) return;
    const t = setTimeout(() => setReject(null), 1100);
    return () => clearTimeout(t);
  }, [reject]);

  React.useEffect(() => {
    if (!focusKey) return;
    const n = cards.current[focusKey];
    if (n && n.focus) n.focus();
    setFocusKey(null);
  }, [focusKey]);

  // Un solo camino para arrastre, teclado y avanzar: el board no decide reglas de
  // negocio, pero tampoco finge que movio (kb-4).
  function tryMove(key, toId) {
    const col = all.filter((c) => c.id === toId)[0];
    const item = items.filter((it) => keyOf(it) === String(key))[0];
    if (!col || !item || String(item[columnKey]) === String(toId)) return false;
    if (col.limit && grouped[toId].length >= col.limit) {
      setReject(toId);
      setMsg(col.label + ' esta en su limite de ' + col.limit + '. La tarjeta no se movio.');
      return false;
    }
    const res = onMove ? onMove(String(key), toId) : undefined;
    if (res === false) {
      setReject(toId);
      setMsg('El movimiento a ' + col.label + ' no se acepto. La tarjeta no se movio.');
      return false;
    }
    setMsg('Movida a ' + col.label + '.');
    setFocusKey(String(key));
    return true;
  }

  function advance(key, colIdx) {
    const next = all[colIdx + 1];
    if (!next || next.abandon) return;
    if (onAdvance) { onAdvance(String(key)); setMsg('Avanzada a ' + next.label + '.'); setFocusKey(String(key)); return; }
    tryMove(key, next.id);
  }

  function focusCell(colIdx, rowIdx) {
    for (let i = colIdx; i >= 0 && i < all.length; i += (colIdx <= i ? 1 : -1)) {
      const list = grouped[all[i].id];
      if (!list.length) { if (i === colIdx) continue; break; }
      const it = list[Math.max(0, Math.min(rowIdx, list.length - 1))];
      const n = cards.current[keyOf(it)];
      if (n && n.focus) { n.focus(); return; }
      break;
    }
  }

  function onCardKey(e, item, colIdx, rowIdx) {
    const k = e.key;
    if (k === 'Enter' || k === ' ') {
      if (!renderDetail) return;
      e.preventDefault();
      setOpen(keyOf(item));
      return;
    }
    const h = k === 'ArrowRight' ? 1 : k === 'ArrowLeft' ? -1 : 0;
    const v = k === 'ArrowDown' ? 1 : k === 'ArrowUp' ? -1 : 0;
    if (!h && !v) return;
    e.preventDefault();
    // Shift + flecha horizontal es el equivalente por teclado del arrastre (kb-1).
    if (h && e.shiftKey) {
      const to = all[colIdx + h];
      if (to) tryMove(keyOf(item), to.id);
      return;
    }
    if (v) focusCell(colIdx, rowIdx + v);
    else focusCell(colIdx + h, rowIdx);
  }

  const openItem = openId == null ? null : items.filter((it) => keyOf(it) === String(openId))[0];

  return R('div', { style: { position: 'relative', fontFamily: 'var(--font-body)', ...style } },
    R('div', { role: 'status', 'aria-live': 'polite', style: SR }, msg),
    R('div', {
      ref: scroller,
      onDragOver: (e) => {
        // kb-7: cerca del borde el tablero se desplaza solo, o la columna destino
        // queda fuera de pantalla justo cuando hace falta.
        const el = scroller.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (e.clientX > r.right - 72) el.scrollLeft += 20;
        else if (e.clientX < r.left + 72) el.scrollLeft -= 20;
      },
      style: { display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 6, alignItems: 'flex-start' },
    },
      all.map((col, colIdx) => {
        const list = grouped[col.id];
        const atLimit = !!col.limit && list.length >= col.limit;
        const isOver = over === col.id;
        const isReject = reject === col.id;
        return R('section', {
          key: col.id,
          role: 'group',
          'aria-label': col.label + ', ' + list.length + ' tarjeta' + (list.length === 1 ? '' : 's') +
            (col.limit ? ', limite ' + col.limit : '') + (col.abandon ? ', columna de salida' : ''),
          onDragOver: (e) => { e.preventDefault(); if (over !== col.id) setOver(col.id); },
          onDragLeave: (e) => { if (e.currentTarget === e.target) setOver(null); },
          onDrop: (e) => {
            e.preventDefault();
            if (drag) tryMove(drag, col.id);
            setDrag(null); setOver(null);
          },
          style: {
            flex: '0 0 268px', minWidth: 268, boxSizing: 'border-box',
            background: col.abandon ? 'transparent' : 'var(--surface-sunken)',
            border: (isReject ? '1.5px solid var(--status-danger)'
              : isOver ? '1.5px solid var(--border-strong)'
                : col.abandon ? '1.5px dashed var(--border-default)' : '1px solid var(--border-subtle)'),
            borderRadius: 'var(--radius-lg)', padding: 12,
            display: 'flex', flexDirection: 'column', gap: 10,
            transition: 'border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)',
            // El hueco simetrico a renderCard: la pantalla puede ajustar la caja de
            // la columna sin tocar el board. Se mezcla al final, como style en el
            // resto del sistema, y no puede quitar el borde de rechazo porque ese
            // se recalcula en cada render.
            ...(typeof columnStyle === 'function' ? columnStyle(col, { atLimit, isOver, isReject }) : columnStyle),
          },
        },
          // renderColumnHeader recibe el mismo trato que renderCard: si la pantalla
          // lo da, dibuja ella; si no, el board pone su cabecera por defecto. El
          // nombre accesible de la columna lo sigue poniendo el board en los dos
          // casos, para que personalizar no pueda romper la lectura por audio.
          renderColumnHeader
            ? renderColumnHeader(col, { count: list.length, atLimit, isOver })
            : R('header', { style: { display: 'flex', alignItems: 'center', gap: 8, minHeight: 24 } },
            col.color && !col.abandon ? R('span', {
              'aria-hidden': true,
              style: { width: 8, height: 8, borderRadius: '50%', background: col.color, flex: 'none' },
            }) : null,
            R('span', {
              style: {
                flex: 1, fontSize: 12, fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: col.abandon ? 'var(--text-muted)' : 'var(--text-secondary)',
              },
            }, col.label),
            R(Badge, { tone: atLimit ? 'warning' : 'neutral' },
              String(list.length) + (col.limit ? '/' + col.limit : ''))),
          R('div', { style: { display: 'flex', flexDirection: 'column', gap: 8, minHeight: 40 } },
            list.map((item, rowIdx) => {
              const k = keyOf(item);
              const dragging = drag === k;
              const canAdvance = !col.abandon && !!all[colIdx + 1] && !all[colIdx + 1].abandon;
              return R('div', {
                key: k,
                ref: (n) => { if (n) cards.current[k] = n; else delete cards.current[k]; },
                role: 'button',
                tabIndex: 0,
                'aria-roledescription': 'tarjeta de tablero',
                draggable: true,
                onDragStart: (e) => { setDrag(k); if (e.dataTransfer) { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', k); } },
                onDragEnd: () => { setDrag(null); setOver(null); },
                onKeyDown: (e) => onCardKey(e, item, colIdx, rowIdx),
                onClick: renderDetail ? () => setOpen(k) : undefined,
                onFocus: (e) => { e.currentTarget.style.boxShadow = 'var(--focus-ring)'; },
                onBlur: (e) => { e.currentTarget.style.boxShadow = 'none'; },
                style: {
                  position: 'relative', background: 'var(--surface-card)',
                  border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
                  padding: 12, cursor: renderDetail ? 'pointer' : 'grab',
                  opacity: dragging ? 0.45 : 1, textAlign: 'left',
                  transition: 'opacity var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
                },
              },
                renderCard ? renderCard(item, { dragging }) : null,
                // kb-2: la tarjeta anuncia su columna y su posicion sin pintarlas.
                R('span', { style: SR }, ' — columna ' + col.label + ', ' + (rowIdx + 1) + ' de ' + list.length),
                canAdvance ? R('div', { style: { position: 'absolute', top: 6, right: 6 } },
                  R(IconButton, {
                    icon: 'arrow_forward', size: 'sm', variant: 'ghost',
                    ariaLabel: 'Avanzar a ' + all[colIdx + 1].label,
                    onClick: (e) => { if (e && e.stopPropagation) e.stopPropagation(); advance(k, colIdx); },
                  })) : null);
            }),
            list.length === 0 ? R('p', {
              style: { margin: 0, padding: '10px 2px', fontSize: 12.5, color: 'var(--text-muted)' },
            }, col.abandon ? 'Sin salidas' : 'Vacia') : null));
      })),
    renderDetail && openItem ? R(OverlayShell, {
      open: true, onClose: () => setOpen(null), align: 'end', zIndex: 95, label: 'Detalle de la tarjeta',
    },
      R('aside', {
        style: {
          width: 420, maxWidth: '92vw', height: '100%', boxSizing: 'border-box',
          background: 'var(--surface-card)', boxShadow: 'var(--shadow-overlay)',
          borderLeft: '1.5px solid var(--border-strong)',
          display: 'flex', flexDirection: 'column', color: 'var(--text-primary)',
        },
      },
        R('header', {
          style: {
            flex: 'none', display: 'flex', alignItems: 'center', gap: 12,
            padding: '18px 20px 14px', borderBottom: '1px solid var(--border-subtle)',
          },
        },
          R('span', { style: { flex: 1, fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' } }, 'Detalle'),
          R(IconButton, { icon: 'close', size: 'sm', variant: 'ghost', ariaLabel: 'Cerrar', onClick: () => setOpen(null) })),
        R('div', { style: { flex: 1, overflowY: 'auto', padding: '16px 20px 24px' } }, renderDetail(openItem)))) : null);
}

F.KanbanBoard = KanbanBoard;
})();

// ---- components/FilterableEditableTable.jsx ----
(function(){

/** Pattern de filtros + edicion en linea. La grid y la celda editable las pone DataGrid. */
function FilterableEditableTable({ columns = [], rows = [], rowKey, onUpdate, onFilter, style }) {
  const [filters, setFilters] = React.useState({});

  const setFilter = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    if (onFilter) onFilter(next);
  };

  const filtered = React.useMemo(() => rows.filter((row) =>
    Object.keys(filters).every((k) => {
      const f = filters[k];
      if (!f) return true;
      return String(row[k] == null ? '' : row[k]).toLowerCase().indexOf(String(f).toLowerCase()) > -1;
    })), [rows, filters]);

  const dirty = Object.keys(filters).some((k) => filters[k]);

  return React.createElement('div', { style: { ...style } },
    React.createElement('div', {
      style: {
        background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      },
    },
      React.createElement('span', {
        style: {
          fontSize: 12, fontWeight: 600, color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: 'var(--tracking-overline)',
        },
      }, 'Filtrar:'),
      // El borde, el radio y el anillo de foco los pone ControlShell a traves de
      // Input: estos filtros los declaraban por su cuenta y eran la otra
      // infraccion de R3. El nombre accesible sigue diciendo la columna (fie-1).
      columns.filter((c) => c.filterable).map((c) => React.createElement(F.Input, {
        key: c.key, size: 'sm',
        'aria-label': 'Filtrar por ' + c.label,
        placeholder: c.label + '…',
        value: filters[c.key] || '',
        onChange: (v) => setFilter(c.key, v),
        style: { minWidth: 140 },
      })),
      dirty && React.createElement('button', {
        type: 'button',
        onClick: () => { setFilters({}); if (onFilter) onFilter({}); },
        style: {
          marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer',
          fontSize: 13, fontWeight: 600, color: 'var(--text-muted)',
        },
      }, 'Limpiar')),
    React.createElement(F.DataGrid, {
      columns, rows: filtered, rowKey, editable: true, onEdit: onUpdate,
      emptyLabel: dirty ? 'Ningún registro coincide con el filtro' : undefined,
      style: { borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', borderTop: 'none' },
    }));
}

F.FilterableEditableTable = FilterableEditableTable;
})();

// ---- components/HelpCenter.jsx ----
(function(){

/** Help Center pattern: sidebar de navegación + contenido + búsqueda. */
function HelpCenter({
  articles = [], style
}) {
  // articles: [{id, category, title, content, keywords}]
  const [search, setSearch] = React.useState('');
  const [selectedId, setSelectedId] = React.useState(articles[0]?.id || null);
  const [expandedCategories, setExpandedCategories] = React.useState(new Set());

  const categories = React.useMemo(() => {
    const cats = new Set(articles.map(a => a.category));
    return Array.from(cats).sort();
  }, [articles]);

  const filtered = React.useMemo(() => {
    if (!search) return articles;
    const query = search.toLowerCase();
    return articles.filter(a =>
      a.title.toLowerCase().includes(query) ||
      a.category.toLowerCase().includes(query) ||
      a.keywords?.some(k => k.toLowerCase().includes(query)) ||
      a.content.toLowerCase().includes(query)
    );
  }, [articles, search]);

  const toggleCategory = (cat) => {
    const next = new Set(expandedCategories);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setExpandedCategories(next);
  };

  const selectedArticle = articles.find(a => a.id === selectedId);

  return React.createElement('div', {
    style: {
      display: 'flex', gap: 0, background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
      overflow: 'hidden', boxShadow: 'var(--shadow-rest)', minHeight: 600,
      ...style
    }
  },
    // Sidebar
    React.createElement('div', {
      style: {
        width: 280, flexShrink: 0, background: 'var(--surface-sunken)',
        borderRight: '1px solid var(--border-subtle)', overflow: 'auto',
        display: 'flex', flexDirection: 'column',
      }
    },
      // Búsqueda
      React.createElement('div', {
        style: { padding: '16px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }
      },
        React.createElement('input', {
          type: 'text', placeholder: 'Busca…',
          value: search,
          onChange: (e) => setSearch(e.target.value),
          style: {
            width: '100%', minHeight: 'var(--hit-target-min)', boxSizing: 'border-box',
            border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)',
            padding: '0 12px', fontFamily: 'var(--font-body)', fontSize: 13,
            background: 'var(--surface-card)', outline: 'none',
          }
        })
      ),
      // Listado de artículos
      React.createElement('div', {
        style: { flex: 1, overflow: 'auto', padding: '8px' }
      },
        search ? (
          // Resultados de búsqueda
          React.createElement('div', {
            style: { display: 'flex', flexDirection: 'column', gap: 4 }
          },
            filtered.length > 0 ? filtered.map((article) => React.createElement('button', {
              key: article.id, type: 'button',
              onClick: () => setSelectedId(article.id),
              style: {
                display: 'block', width: '100%', textAlign: 'left', border: 'none',
                background: selectedId === article.id ? 'var(--surface-accent-subtle)' : 'transparent',
                borderRadius: 'var(--radius-sm)', padding: '10px 12px',
                cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13,
                color: selectedId === article.id ? 'var(--text-accent)' : 'var(--text-primary)',
                transition: 'all var(--dur-fast) var(--ease-out)',
              }
            },
              React.createElement('div', { style: { fontWeight: 600, marginBottom: 2 } }, article.title),
              React.createElement('div', { style: { fontSize: 11, color: 'var(--text-muted)' } }, article.category)
            )) : React.createElement('div', {
              style: { padding: '16px 12px', textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }
            }, 'Sin resultados')
          )
        ) : (
          // Navegación por categorías
          React.createElement('div', {
            style: { display: 'flex', flexDirection: 'column', gap: 0 }
          },
            categories.map((cat) => {
              const catArticles = filtered.filter(a => a.category === cat);
              const isExpanded = expandedCategories.has(cat) || search;
              return React.createElement('div', {
                key: cat,
              },
                React.createElement('button', {
                  type: 'button',
                  onClick: () => toggleCategory(cat),
                  style: {
                    display: 'flex', alignItems: 'center', gap: 8, width: '100%', border: 'none',
                    background: 'transparent', padding: '10px 12px',
                    cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                    color: 'var(--text-muted)', textAlign: 'left',
                    transition: 'color var(--dur-fast) var(--ease-out)',
                  }
                },
                  React.createElement('span', { className: 'flow-symbol', style: { fontSize: 14, transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-spring)' } }, 'chevron_right'),
                  cat
                ),
                isExpanded && React.createElement('div', {
                  style: { display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 8, paddingBottom: 4 }
                },
                  catArticles.map((article) => React.createElement('button', {
                    key: article.id, type: 'button',
                    onClick: () => setSelectedId(article.id),
                    style: {
                      display: 'block', width: '100%', textAlign: 'left', border: 'none',
                      background: selectedId === article.id ? 'var(--surface-accent-subtle)' : 'transparent',
                      borderRadius: 'var(--radius-sm)', padding: '8px 12px',
                      cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12,
                      color: selectedId === article.id ? 'var(--text-accent)' : 'var(--text-primary)',
                      transition: 'all var(--dur-fast) var(--ease-out)',
                    }
                  }, article.title))
                )
              );
            })
          )
        )
      )
    ),

    // Contenido
    React.createElement('div', {
      style: {
        flex: 1, padding: '32px', overflow: 'auto',
        display: 'flex', flexDirection: 'column', gap: 16,
      }
    },
      selectedArticle ? (
        React.createElement('div', {},
          React.createElement('span', {
            style: { fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 'var(--tracking-overline)', color: 'var(--text-muted)' }
          }, selectedArticle.category),
          React.createElement('h2', {
            style: { margin: '8px 0 0 0', fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }
          }, selectedArticle.title),
          React.createElement('div', {
            style: {
              marginTop: 24, fontSize: 14, lineHeight: 1.8, color: 'var(--text-primary)',
              display: 'flex', flexDirection: 'column', gap: 12,
            }
          },
            selectedArticle.content.split('\n').filter(p => p.trim()).map((paragraph, i) => React.createElement('p', {
              key: i, style: { margin: 0 }
            }, paragraph))
          ),
          selectedArticle.keywords && React.createElement('div', {
            style: { marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 6, flexWrap: 'wrap' }
          },
            React.createElement('span', { style: { fontSize: 11, color: 'var(--text-muted)' } }, 'Tags:'),
            selectedArticle.keywords.map((tag) => React.createElement('span', {
              key: tag,
              style: {
                fontSize: 11, padding: '4px 8px', background: 'var(--surface-sunken)',
                borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)'
              }
            }, tag))
          )
        )
      ) : (
        React.createElement('div', {
          style: { textAlign: 'center', color: 'var(--text-muted)' }
        }, 'Selecciona un artículo')
      )
    )
  );
}

F.HelpCenter = HelpCenter;
})();

// ---- components/TabBar.jsx ----
(function(){

/** Bottom tab bar for mobile shells. items: [{id, icon, label, badge?}] */
function TabBar({ items = [], activeId, onChange, style }) {
  return React.createElement('nav', {
    'aria-label': 'Navegación principal',
    style: {
      position: 'sticky', bottom: 0, display: 'flex',
      background: 'var(--surface-card)', borderTop: '1px solid var(--border-subtle)',
      padding: '6px 8px calc(6px + env(safe-area-inset-bottom))', fontFamily: 'var(--font-body)',
      ...style,
    },
  }, items.map(it => {
    const active = it.id === activeId;
    return React.createElement('button', {
      key: it.id, type: 'button', 'aria-current': active ? 'page' : undefined,
      onClick: () => onChange && onChange(it.id),
      style: {
        flex: 1, minHeight: 52, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 2, border: 'none', background: 'transparent', cursor: 'pointer',
        fontFamily: 'inherit', position: 'relative',
        color: active ? 'var(--text-accent)' : 'var(--text-muted)',
        transition: 'color var(--dur-fast) var(--ease-out)',
      },
    },
      React.createElement('span', { style: { position: 'relative', display: 'inline-flex' } },
        React.createElement('span', {
          className: 'flow-symbol' + (active ? ' flow-symbol--fill' : ''), 'aria-hidden': true,
          style: { fontSize: 24, display: 'block', transform: active ? 'scale(1.12)' : 'none', transition: 'transform var(--dur-fast) var(--ease-spring)' },
        }, it.icon),
        it.badge && React.createElement('span', {
          'aria-hidden': true,
          style: {
            position: 'absolute', top: -2, right: -6, minWidth: 15, height: 15, borderRadius: 999,
            background: 'var(--action-accent)', color: 'var(--text-on-accent)', fontSize: 9.5, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px', boxSizing: 'border-box',
          },
        }, typeof it.badge === 'number' ? (it.badge > 9 ? '9+' : it.badge) : '')),
      React.createElement('span', { style: { fontSize: 10.5, fontWeight: active ? 700 : 500 } }, it.label));
  }));
}

F.TabBar = TabBar;
})();

// ---- primitives/Divider.jsx ----
(function(){

/** Content separator. Optional centered label splits the line ("O", "12 mar"). Vertical for inline groups (toolbars). */
function Divider({ orientation = 'horizontal', label, style }) {
  if (orientation === 'vertical') {
    return React.createElement('span', {
      role: 'separator', 'aria-orientation': 'vertical',
      style: { display: 'inline-block', width: 1, alignSelf: 'stretch', background: 'var(--border-subtle)', ...style },
    });
  }
  if (!label) {
    return React.createElement('hr', {
      role: 'separator',
      style: { border: 'none', height: 1, background: 'var(--border-subtle)', margin: 0, width: '100%', ...style },
    });
  }
  return React.createElement('div', {
    role: 'separator', 'aria-label': label,
    style: {
      display: 'flex', alignItems: 'center', gap: 12, width: '100%', color: 'var(--text-muted)',
      fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', ...style,
    },
  },
    React.createElement('span', { style: { flex: 1, height: 1, background: 'var(--border-subtle)' } }),
    React.createElement('span', null, label),
    React.createElement('span', { style: { flex: 1, height: 1, background: 'var(--border-subtle)' } }));
}

F.Divider = Divider;
})();

// ---- components/CircularProgress.jsx ----
(function(){

/** Circular determinate progress/gauge. Compact alternative to Progress for dashboard tiles and connection states. */
function CircularProgress({ value = 0, max = 100, size = 56, strokeWidth = 5, label, showValue = false, tone = 'accent', style }) {
  const pct = Math.max(0, Math.min(1, max > 0 ? value / max : 0));
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const color = { accent: 'var(--action-accent)', success: 'var(--status-success)', warning: 'var(--status-warning)', ink: 'var(--text-primary)' }[tone] || 'var(--action-accent)';
  return React.createElement('div', {
    style: { display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', ...style },
  },
    React.createElement('span', { style: { position: 'relative', width: size, height: size, display: 'inline-flex' } },
      React.createElement('svg', { width: size, height: size, style: { transform: 'rotate(-90deg)' } },
        React.createElement('circle', { cx: size / 2, cy: size / 2, r, fill: 'none', stroke: 'var(--border-subtle)', strokeWidth }),
        React.createElement('circle', {
          cx: size / 2, cy: size / 2, r, fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round',
          strokeDasharray: c, strokeDashoffset: c * (1 - pct),
          style: { transition: 'stroke-dashoffset var(--dur-base) var(--ease-out)' },
        })),
      showValue && React.createElement('span', {
        style: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: size * 0.24, color: 'var(--text-primary)' },
      }, Math.round(pct * 100) + '%')),
    label && React.createElement('span', { style: { fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 } }, label));
}

F.CircularProgress = CircularProgress;
})();

// ---- components/Timeline.jsx ----
(function(){

const STATUS = {
  done: { color: 'var(--status-success)', icon: 'check' },
  active: { color: 'var(--action-accent)', icon: 'radio_button_checked' },
  pending: { color: 'var(--text-disabled)', icon: 'radio_button_unchecked' },
  error: { color: 'var(--status-danger)', icon: 'close' },
};

const ETIQUETA = { done: 'Completado', active: 'En curso', pending: 'Pendiente', error: 'Error' };

/** Historial vertical de un registro. Ver contracts/timeline.json.
 *
 *  mode cambia la presentacion de los mismos datos, no los datos:
 *  'steps' es el recorrido de un registro, con icono de estado y conector;
 *  'events' es una cronologia, con punto compacto y el estado dicho en texto.
 *  Absorbe TableTimeline, que se llamaba tabla sin tener columnas y calculaba
 *  una posicion proporcional al tiempo que nunca llegaba a dibujar.
 */
function Timeline({ items = [], mode = 'steps', style }) {
  const eventos = mode === 'events';
  return React.createElement('ol', {
    style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: eventos ? 20 : 0, fontFamily: 'var(--font-body)', ...style },
  },
    items.map((it, i) => {
      const st = STATUS[it.status] || STATUS.pending;
      const last = i === items.length - 1;
      if (eventos) {
        return React.createElement('li', { key: it.id || i, style: { display: 'flex', gap: 14, alignItems: 'flex-start' } },
          React.createElement('span', {
            'aria-hidden': true,
            style: {
              width: 12, height: 12, borderRadius: 'var(--radius-pill)', flex: 'none', marginTop: 5,
              background: st.color, boxShadow: '0 0 0 3px var(--surface-card), 0 0 0 4px ' + st.color,
            },
          }),
          React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: 4 } },
            React.createElement('div', { style: { display: 'flex', gap: 10, alignItems: 'baseline' } },
              React.createElement('span', { style: { flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' } }, it.title),
              // El estado va en texto, no solo en el color del punto (tml-1).
              React.createElement('span', {
                style: { font: 'var(--type-overline)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-overline)', color: st.color, flex: 'none' },
              }, ETIQUETA[it.status] || ETIQUETA.pending),
              it.timestamp && React.createElement('span', {
                style: { font: 'var(--type-data)', fontSize: 11.5, color: 'var(--text-muted)', flex: 'none' },
              }, it.timestamp)),
            it.description && React.createElement('span', { style: { fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.5 } }, it.description)));
      }
      return React.createElement('li', { key: it.id || i, style: { display: 'flex', gap: 14 } },
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none' } },
          React.createElement('span', {
            'aria-hidden': true,
            style: {
              width: 26, height: 26, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: it.status === 'pending' ? 'var(--surface-sunken)' : st.color,
              color: it.status === 'pending' ? 'var(--text-muted)' : 'var(--text-on-accent)',
              boxShadow: it.status === 'active' ? 'var(--shadow-accent-glow)' : 'none',
            },
          }, React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 15 } }, it.icon || st.icon)),
          !last && React.createElement('span', { style: { width: 2, flex: 1, minHeight: 24, background: 'var(--border-subtle)', marginTop: 2 } })),
        React.createElement('div', { style: { paddingBottom: last ? 0 : 22, flex: 1 } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' } },
            React.createElement('span', { style: { fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' } }, it.title),
            it.timestamp && React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-muted)', flex: 'none' } }, it.timestamp)),
          it.description && React.createElement('div', { style: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 2 } }, it.description)));
    }));
}

F.Timeline = Timeline;
})();

// ---- components/OnboardingCarousel.jsx ----
(function(){

const PALETTE = [1, 2, 3, 4, 5, 6].map((i) => 'var(--illustration-' + i + ')');

function DefaultIllustration({ icon, index }) {
  const color = PALETTE[index % PALETTE.length];
  return React.createElement('div', {
    style: { width: 168, height: 168, borderRadius: '50%', background: color + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  },
    React.createElement('div', {
      style: { width: 108, height: 108, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 28px ' + color + '40' },
    }, React.createElement('span', { className: 'flow-symbol flow-symbol--fill', 'aria-hidden': true, style: { fontSize: 52, color: 'var(--text-on-accent)' } }, icon || 'auto_awesome')));
}

/** Onboarding slides with illustration, dot pagination, and swipe. slides: [{icon?, illustration?(node), title, description}] */
function OnboardingCarousel({ slides = [], index = 0, onIndexChange, onSkip, onDone, skipLabel = 'Omitir', doneLabel = 'Empezar', style }) {
  const touch = React.useRef(null);
  const go = (i) => onIndexChange && onIndexChange(Math.max(0, Math.min(slides.length - 1, i)));
  const last = index === slides.length - 1;
  const slide = slides[index] || {};

  return React.createElement('div', {
    style: { display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--font-body)', ...style },
    onTouchStart: (e) => { touch.current = e.touches[0].clientX; },
    onTouchEnd: (e) => {
      if (touch.current == null) return;
      const dx = e.changedTouches[0].clientX - touch.current;
      if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
      touch.current = null;
    },
  },
    onSkip && !last && React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end', padding: '4px 4px 0' } },
      React.createElement('button', {
        type: 'button', onClick: onSkip,
        style: { border: 'none', background: 'transparent', color: 'var(--text-muted)', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', padding: 8 },
      }, skipLabel)),
    React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 24, padding: '8px 28px' } },
      slide.illustration || React.createElement(DefaultIllustration, { icon: slide.icon, index }),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
        React.createElement('div', { style: { font: 'var(--type-title-sm)', color: 'var(--text-primary)' } }, slide.title),
        slide.description && React.createElement('div', { style: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.55, maxWidth: 300 } }, slide.description))),
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 18, padding: '0 24px 8px', alignItems: 'center' } },
      React.createElement('div', { style: { display: 'flex', gap: 6 } },
        slides.map((_, i) => React.createElement('button', {
          key: i, type: 'button', 'aria-label': 'Ir a diapositiva ' + (i + 1), onClick: () => go(i),
          style: {
            width: i === index ? 20 : 6, height: 6, borderRadius: 999, border: 'none', padding: 0, cursor: 'pointer',
            background: i === index ? 'var(--action-accent)' : 'var(--border-default)',
            transition: 'width var(--dur-base) var(--ease-spring), background var(--dur-fast) var(--ease-out)',
          },
        }))),
      React.createElement('button', {
        type: 'button', onClick: () => (last ? onDone && onDone() : go(index + 1)),
        style: { width: '100%', minHeight: 52, border: 'none', borderRadius: 999, background: 'var(--action-primary)', color: 'var(--text-on-inverse)', fontFamily: 'inherit', fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'transform var(--dur-fast) var(--ease-spring)' },
        onMouseEnter: (e) => e.currentTarget.style.transform = 'scale(1.02)',
        onMouseLeave: (e) => e.currentTarget.style.transform = 'none',
      }, last ? doneLabel : 'Continuar')));
}

F.OnboardingCarousel = OnboardingCarousel;
})();

// ---- components/StatusView.jsx ----
(function(){

const CONFIG = {
  success: { icon: 'check_circle', color: 'var(--status-success-text)', bg: 'var(--status-success-bg)' },
  error: { icon: 'error', color: 'var(--status-danger-text)', bg: 'var(--status-danger-bg)' },
  pending: { icon: 'schedule', color: 'var(--status-warning-text)', bg: 'var(--status-warning-bg)' },
  loading: { icon: 'sync', color: 'var(--text-accent)', bg: 'var(--surface-sunken)' },
  offline: { icon: 'cloud_off', color: 'var(--text-muted)', bg: 'var(--surface-sunken)' },
};

/** Full state screen for connection/validation flows: API, base de datos, biometricos, pagos, GPS. */
function StatusView({ status = 'loading', title, description, primaryAction, secondaryAction, fullScreen = false, style }) {
  const cfg = CONFIG[status] || CONFIG.loading;
  return React.createElement('div', {
    style: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      gap: 8, padding: '40px 28px', fontFamily: 'var(--font-body)', boxSizing: 'border-box',
      ...(fullScreen ? { minHeight: '100%', flex: 1 } : {}), ...style,
    },
  },
    React.createElement('span', {
      style: { position: 'relative', width: 84, height: 84, borderRadius: '50%', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
    },
      status === 'loading' && React.createElement('span', {
        'aria-hidden': true,
        style: { position: 'absolute', inset: -4, borderRadius: '50%', border: '2.5px solid var(--action-accent)', borderTopColor: 'transparent', animation: 'flowSpin 1s linear infinite' },
      }),
      React.createElement('span', {
        className: 'flow-symbol' + (status === 'success' || status === 'error' ? ' flow-symbol--fill' : ''), 'aria-hidden': true,
        style: {
          fontSize: 40, color: cfg.color,
          animation: status === 'loading' ? 'flowSpin 1.4s linear infinite' : (status === 'success' ? 'flowScaleIn var(--dur-base) var(--ease-spring)' : 'none'),
        },
      }, cfg.icon)),
    title && React.createElement('div', { style: { fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' } }, title),
    description && React.createElement('div', { role: 'status', style: { fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.55, maxWidth: 320 } }, description),
    (primaryAction || secondaryAction) && React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14, width: '100%', maxWidth: 280 } }, primaryAction, secondaryAction));
}

F.StatusView = StatusView;
})();

// ---- components/Sidebar.jsx ----
(function(){

/** Nav lateral de escritorio. Ver contracts/sidebar.json.
 *
 *  Escrito en React.createElement como el resto del sistema. Estaba en JSX y el
 *  bundle no transpila: era una de las dos fuentes que el generador tenia que
 *  copiar sin regenerar, o sea un cambio aqui no llegaba al bundle.
 */
function Sidebar({
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
        h('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 20, flex: 'none' } }, item.icon),
        !collapsed && h('span', { key: 'lbl', style: { flex: 1, textAlign: 'left' } }, item.label),
        !collapsed && esSeccion && h('span', {
          key: 'chev', className: 'flow-symbol', 'aria-hidden': true,
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

F.Sidebar = Sidebar;
})();

// ---- components/TopBar.jsx ----
(function(){

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
function TopBar({
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

F.TopBar = TopBar;
})();

// ---- components/GlobalSearch.jsx ----
(function(){

/**
 * Búsqueda global de entidades: agrupa resultados por tipo, navega con teclado,
 * y expone modo 'palette' (overlay ⌘K) o 'inline' (dropdown bajo el input).
 *
 * Los resultados son del contenedor: pasa `results` ya resueltos y `loading`.
 * El componente no busca — orquesta la UI de búsqueda.
 */
function GlobalSearch({
  mode = 'palette',
  open = false,
  onOpenChange,
  value = '',
  onValueChange,
  results = [],
  groupOrder = [],
  loading = false,
  recents = [],
  onSelect,
  onClearRecents,
  placeholder = 'Busca unidades, conductores, viajes…',
  emptyHint = 'Prueba con una placa, un nombre o un ID de viaje.',
  shortcut = true,
  minChars = 1,
  style,
}) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef(null);
  const listRef = React.useRef(null);
  const rootRef = React.useRef(null);

  const showRecents = value.length < minChars && recents.length > 0;
  const items = showRecents ? recents : results;

  // agrupa preservando groupOrder, luego alfabético para grupos no listados
  const groups = React.useMemo(() => {
    const by = new Map();
    items.forEach((r) => {
      const g = showRecents ? 'Recientes' : (r.group || 'Otros');
      if (!by.has(g)) by.set(g, []);
      by.get(g).push(r);
    });
    const names = Array.from(by.keys()).sort((a, b) => {
      const ia = groupOrder.indexOf(a);
      const ib = groupOrder.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
    return names.map((name) => ({ name, items: by.get(name) }));
  }, [items, groupOrder, showRecents]);

  const flat = React.useMemo(() => groups.flatMap((g) => g.items), [groups]);

  React.useEffect(() => { setActiveIndex(0); }, [value, showRecents]);

  // ⌘K / Ctrl+K abre, Escape cierra
  React.useEffect(() => {
    if (!shortcut || mode !== 'palette') return;
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange && onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [shortcut, mode, open, onOpenChange]);

  React.useEffect(() => {
    if (mode === 'palette' && open && inputRef.current) inputRef.current.focus();
  }, [mode, open]);

  // click fuera cierra el dropdown inline
  React.useEffect(() => {
    if (mode !== 'inline' || !open) return;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) onOpenChange && onOpenChange(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [mode, open, onOpenChange]);

  function commit(item) {
    if (!item) return;
    onSelect && onSelect(item);
    onOpenChange && onOpenChange(false);
  }

  function onInputKeyDown(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!flat.length) return;
      const dir = e.key === 'ArrowDown' ? 1 : -1;
      const next = (activeIndex + dir + flat.length) % flat.length;
      setActiveIndex(next);
      const node = listRef.current && listRef.current.querySelector('[data-idx="' + next + '"]');
      if (node && node.parentNode) {
        const box = node.parentNode.parentNode;
        if (box && box.scrollTop !== undefined) {
          const top = node.offsetTop;
          if (top < box.scrollTop) box.scrollTop = top - 8;
          else if (top + node.offsetHeight > box.scrollTop + box.clientHeight) {
            box.scrollTop = top + node.offsetHeight - box.clientHeight + 8;
          }
        }
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      commit(flat[activeIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onOpenChange && onOpenChange(false);
    }
  }

  // resalta la coincidencia sin innerHTML
  function highlight(text) {
    if (!value || showRecents) return text;
    const i = String(text).toLowerCase().indexOf(value.toLowerCase());
    if (i === -1) return text;
    return [
      String(text).slice(0, i),
      React.createElement('mark', {
        key: 'm',
        style: { background: 'var(--surface-accent-subtle)', color: 'var(--text-accent)', fontWeight: 700, borderRadius: 3, padding: '0 1px' },
      }, String(text).slice(i, i + value.length)),
      String(text).slice(i + value.length),
    ];
  }

  const searchField = React.createElement('div', {
    style: { display: 'flex', alignItems: 'center', gap: 10, padding: mode === 'palette' ? '14px 16px' : '0 12px', borderBottom: mode === 'palette' ? '1px solid var(--border-subtle)' : 'none', flex: mode === 'palette' ? 'none' : 1, minWidth: 0 },
  },
    React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 20, color: 'var(--text-muted)', flex: 'none' } }, 'search'),
    React.createElement('input', {
      ref: inputRef,
      type: 'text',
      role: 'combobox',
      'aria-expanded': true,
      'aria-controls': 'flow-search-list',
      'aria-activedescendant': flat[activeIndex] ? 'flow-search-opt-' + activeIndex : undefined,
      'aria-label': placeholder,
      autoComplete: 'off',
      placeholder: placeholder,
      value: value,
      onChange: (e) => onValueChange && onValueChange(e.target.value),
      onKeyDown: onInputKeyDown,
      style: {
        flex: 1, border: 'none', outline: 'none', background: 'transparent',
        fontSize: mode === 'palette' ? 15 : 13, fontFamily: 'inherit',
        color: 'var(--text-primary)', minHeight: 44, padding: 0,
      },
    }),
    value
      ? React.createElement('button', {
          type: 'button', onClick: () => { onValueChange && onValueChange(''); inputRef.current && inputRef.current.focus(); },
          'aria-label': 'Limpiar búsqueda',
          style: { border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4, minWidth: 'var(--hit-target-min)', minHeight: 'var(--hit-target-min)', alignItems: 'center', justifyContent: 'center', flex: 'none' },
        }, React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 18 } }, 'close'))
      : (mode === 'palette' && shortcut && React.createElement('kbd', {
          'aria-hidden': true,
          style: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: '2px 6px', flex: 'none' },
        }, '⌘K')));

  let body;
  if (loading) {
    body = React.createElement('div', {
      role: 'status', 'aria-live': 'polite',
      style: { padding: '28px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--text-secondary)', fontSize: 13 },
    },
      React.createElement('span', {
        'aria-hidden': true,
        style: { width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--border-subtle)', borderTopColor: 'var(--action-accent)', animation: 'flowSpin 700ms linear infinite' },
      }),
      'Buscando…');
  } else if (!flat.length) {
    body = React.createElement('div', {
      style: { padding: '28px 20px', textAlign: 'center' },
    },
      React.createElement('div', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 28, color: 'var(--text-muted)' } }, value.length >= minChars ? 'search_off' : 'search'),
      React.createElement('p', { style: { margin: '8px 0 2px', fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' } },
        value.length >= minChars ? 'Sin resultados para «' + value + '»' : 'Busca en toda la plataforma'),
      React.createElement('p', { style: { margin: 0, fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 } }, emptyHint));
  } else {
    let idx = -1;
    body = React.createElement('div', {
      id: 'flow-search-list', role: 'listbox', ref: listRef,
      style: { overflowY: 'auto', maxHeight: mode === 'palette' ? 380 : 320, padding: '6px 0' },
    }, groups.map((g) =>
      React.createElement('div', { key: g.name, role: 'group', 'aria-labelledby': 'flow-sg-' + g.name },
        React.createElement('div', {
          id: 'flow-sg-' + g.name,
          style: { padding: '8px 16px 4px', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        },
          g.name,
          showRecents && onClearRecents && React.createElement('button', {
            type: 'button', onClick: onClearRecents,
            style: { border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase' },
          }, 'Limpiar')),
        g.items.map((r) => {
          idx += 1;
          const i = idx;
          const active = i === activeIndex;
          return React.createElement('div', {
            key: r.id, id: 'flow-search-opt-' + i, 'data-idx': i,
            role: 'option', 'aria-selected': active,
            onMouseEnter: () => setActiveIndex(i),
            onClick: () => commit(r),
            style: {
              display: 'flex', alignItems: 'center', gap: 12, padding: '9px 16px', cursor: 'pointer',
              minHeight: 44, boxSizing: 'border-box',
              background: active ? 'var(--surface-sunken)' : 'transparent',
            },
          },
            r.icon && React.createElement('span', {
              className: 'flow-symbol', 'aria-hidden': true,
              style: { fontSize: 20, color: active ? 'var(--text-primary)' : 'var(--text-muted)', flex: 'none' },
            }, r.icon),
            React.createElement('div', { style: { flex: 1, minWidth: 0 } },
              React.createElement('div', {
                style: {
                  fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)',
                  fontFamily: r.mono ? 'var(--font-mono)' : 'inherit',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                },
              }, highlight(r.label)),
              r.meta && React.createElement('div', {
                style: { fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 1 },
              }, r.meta)),
            r.trailing && React.createElement('div', { style: { flex: 'none' } }, r.trailing),
            active && React.createElement('span', {
              className: 'flow-symbol', 'aria-hidden': true,
              style: { fontSize: 16, color: 'var(--text-muted)', flex: 'none' },
            }, 'keyboard_return'));
        }))));
  }

  const footer = mode === 'palette' && React.createElement('div', {
    style: { display: 'flex', gap: 16, padding: '9px 16px', borderTop: '1px solid var(--border-subtle)', fontSize: 11, color: 'var(--text-secondary)', flex: 'none' },
  },
    React.createElement('span', null, '↑↓ navegar'),
    React.createElement('span', null, '↵ abrir'),
    React.createElement('span', null, 'esc cerrar'));

  if (mode === 'inline') {
    return React.createElement('div', { ref: rootRef, style: { position: 'relative', ...style } },
      React.createElement('div', {
        style: {
          display: 'flex', alignItems: 'center', background: 'var(--surface-sunken)',
          border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
        },
        onFocus: () => onOpenChange && onOpenChange(true),
      }, searchField),
      open && React.createElement('div', {
        style: {
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 60,
          background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-float)', overflow: 'hidden',
          animation: 'flowScaleIn var(--dur-fast) var(--ease-out)', transformOrigin: 'top center',
        },
      }, body));
  }

  return React.createElement(F.OverlayShell, {
    open, onClose: () => onOpenChange && onOpenChange(false),
    align: 'start', zIndex: 900, label: 'Búsqueda global', backdropStyle: style,
  },
    React.createElement('div', {
      style: {
        width: '100%', maxWidth: 560, background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-overlay)', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font-body)',
      },
    }, searchField, body, footer));
}

F.GlobalSearch = GlobalSearch;
})();

// ---- primitives/FlowChart.jsx ----
(function(){

/**
 * FlowChart — un solo envoltorio de ECharts con el tema de Flow.
 *
 * Lee los tokens del DOM en tiempo de ejecucion, asi que Canvas y su modo oscuro
 * salen del mismo componente sin configuracion. Re-tematiza al cambiar data-mode.
 *
 * ECharts se carga del CDN una sola vez y se comparte entre instancias.
 */

const ECHARTS_SRC = 'https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js';
let echartsPromise = null;

function loadEcharts(src = ECHARTS_SRC) {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.echarts) return Promise.resolve(window.echarts);
  if (echartsPromise) return echartsPromise;
  echartsPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve(window.echarts);
    s.onerror = () => { echartsPromise = null; reject(new Error('ECharts no cargo')); };
    document.head.appendChild(s);
  });
  return echartsPromise;
}

/** ECharts quiere una lista de familias sin comillas sueltas. */
function cleanFont(v) {
  return String(v).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean).join(', ');
}

function readTokens(el) {
  const cs = getComputedStyle(el);
  const t = (name, fallback) => (cs.getPropertyValue(name) || '').trim() || fallback;
  // Los kits pasan colores como 'var(--flow-red-500)'; ECharts no resuelve custom props.
  const resolve = (c) => {
    let v = String(c || '');
    for (let i = 0; i < 4 && /^var\(/.test(v); i++) {
      const inner = v.slice(4, -1).split(',')[0].trim();
      v = (cs.getPropertyValue(inner) || '').trim() || v.slice(4, -1).split(',').slice(1).join(',').trim();
    }
    return v || c;
  };
  const theme = (el.closest('[data-mode]') || document.documentElement).getAttribute('data-mode') || 'light';
  // --type-data-lg: "600 26px/1.15 var(--font-mono)" — el mismo token que los KPIs
  const kpi = t('--type-data-lg', '600 26px/1.15').match(/(\d{3})\s+(\d+(?:\.\d+)?)px/);
  return {
    resolve,
    theme,
    palette: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => t('--viz-' + i, '#2E7CF6')),
    ramp: [1, 2, 3, 4, 5, 6].map((i) => t('--viz-ramp-' + i, '#E7F0FE')),
    accent: t('--viz-accent', '#FF3617'),
    positive: t('--viz-positive', '#12B76A'),
    negative: t('--viz-negative', '#D92D20'),
    neutral: t('--viz-neutral', '#B5B1AA'),
    grid: t('--viz-grid', '#EEEBE6'),
    axis: t('--viz-axis', '#E0DDD7'),
    label: t('--viz-label', '#55534E'),
    tipBg: t('--viz-tooltip-bg', '#17171A'),
    tipText: t('--viz-tooltip-text', '#F4F3F1'),
    card: t('--surface-card', '#FFFFFF'),
    text: t('--text-primary', '#17171A'),
    muted: t('--text-muted', '#8A8781'),
    fontBody: cleanFont(t('--font-body', 'sans-serif')),
    fontMono: cleanFont(t('--font-mono', 'monospace')),
    kpiWeight: kpi ? Number(kpi[1]) : 600,
    kpiSize: kpi ? parseFloat(kpi[2]) : 26,
  };
}

/**
 * Resuelve var(--x) en TODO el arbol de opciones, una sola vez y justo antes de
 * entregarlo a ECharts: cubre colores de series, passthroughs de adaptadores
 * (markLine) y cualquier `option` del llamador. Las funciones pasan intactas —
 * son formatters.
 */
function resolveVars(o, rz) {
  if (typeof o === 'string') return /var\(--/.test(o) ? rz(o) : o;
  if (typeof o === 'function' || o == null) return o;
  if (Array.isArray(o)) return o.map((v) => resolveVars(v, rz));
  if (typeof o === 'object') {
    if (o instanceof Date) return o;
    const out = {};
    Object.keys(o).forEach((k) => { out[k] = resolveVars(o[k], rz); });
    return out;
  }
  return o;
}

function isReduced() {
  return typeof window !== 'undefined' && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Luminancia relativa WCAG de un hex, para decidir texto claro u oscuro encima. */
function luminance(hex) {
  const m = String(hex).trim().replace('#', '');
  const full = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
  const n = parseInt(full, 16);
  if (isNaN(n) || full.length !== 6) return 1;
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

function contrast(a, b) {
  const l1 = luminance(a), l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/**
 * Texto legible sobre un relleno de chart. Prefiere los tokens, pero si ninguno
 * llega a AA (pasa en los tonos medios de la rampa) cae a los extremos puros:
 * el relleno no es una superficie del tema, es un dato.
 */
function onColor(fill, dark, light) {
  const best = (list) => list.reduce((a, c) => (contrast(fill, c) > contrast(fill, a) ? c : a));
  const tokenBest = best([dark, light]);
  return contrast(fill, tokenBest) >= 4.5 ? tokenBest : best(['#000000', '#FFFFFF']);
}

/** Une objetos en profundidad: el override del usuario gana siempre. */
function merge(base, extra) {
  if (!extra) return base;
  const out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
  Object.keys(extra).forEach((k) => {
    const a = out[k];
    const b = extra[k];
    out[k] = (b && typeof b === 'object' && !Array.isArray(b) && a && typeof a === 'object' && !Array.isArray(a))
      ? merge(a, b) : b;
  });
  return out;
}

/**
 * Con 1-3 series Flow no usa la paleta categorica: usa tinta + el accent.
 * Ocho colores es un default de libreria; dos es una decision.
 */
function paletteFor(count, mode, tk) {
  const duo = [tk.text, tk.accent, tk.neutral];
  if (mode === 'categorical') return tk.palette;
  if (mode === 'duo') return duo;
  return count <= 3 ? duo : tk.palette;
}

function buildOption(type, props, tk) {
  const {
    series = [], labels = [], format, legend = false, stack = false, smooth = true,
    highlight, horizontal = false, matrix, indicators, target, max, min,
    showValues = false, area, palette = 'auto', animate = true, itemColors,
  } = props;

  const motion = animate && !isReduced();
  const fmt = typeof format === 'function' ? format : (v) => v;
  const axisFmt = (v) => (typeof v === 'number' ? fmt(v) : v);

  const rz = tk.resolve || ((c) => c);
  // Claves que consume el builder; el resto se pasa tal cual a la serie de ECharts
  // para que un adaptador pueda añadir markLine, markArea o lo que necesite.
  const OWN = ['label', 'values', 'data', 'color', 'symbolSize'];
  const extra = (s) => {
    const o = {};
    Object.keys(s || {}).forEach((k) => { if (OWN.indexOf(k) === -1) o[k] = s[k]; });
    return o;
  };
  const pal = paletteFor(series.length, palette, tk);
  // Con highlight, el accent queda reservado para esa serie: las demas lo saltan.
  const rest = highlight ? pal.filter((c) => c !== tk.accent) : pal;
  const assigned = [];
  let slot = 0;
  series.forEach((s) => {
    assigned.push((highlight && s.label === highlight) ? tk.accent : (s.color ? rz(s.color) : rest[slot++ % rest.length]));
  });
  const colorFor = (i, label) =>
    (highlight && label === highlight) ? tk.accent
      : (assigned[i] || rest[i % rest.length] || tk.text);

  const textStyle = { fontFamily: tk.fontBody, fontSize: 12, color: tk.label };
  const monoStyle = { fontFamily: tk.fontMono, fontSize: 11.5, color: tk.label };

  // Toda cifra en mono, tambien dentro del tooltip: en Flow el numero es mono, siempre.
  const num = (v) => '<span style="font-family:' + tk.fontMono + ';font-weight:600">' + v + '</span>';
  const tipHead = (s) => '<div style="font-size:11.5px;opacity:.65;margin-bottom:3px">' + s + '</div>';
  const tipRow = (marker, name, val) =>
    '<div style="display:flex;align-items:center;gap:6px">' + (marker || '')
    + '<span style="flex:1">' + (name || '') + '</span>' + num(val) + '</div>';

  const dur = 620;
  const stagger = 36;
  const mount = (perPoint) => (motion ? {
    animation: true,
    animationDuration: dur,
    animationEasing: 'cubicOut',
    animationDelay: perPoint ? (i) => i * stagger : 0,
  } : { animation: false });

  const base = {
    color: pal,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: tk.fontBody, color: tk.text },
    animation: motion,
    animationDuration: dur,
    animationEasing: 'cubicOut',
    grid: { left: 8, right: 14, top: legend ? 34 : 14, bottom: 6, containLabel: true },
    legend: legend ? {
      show: true, top: 0, left: 0, itemGap: 16, icon: 'roundRect',
      itemWidth: 10, itemHeight: 10, textStyle: textStyle,
    } : { show: false },
    tooltip: {
      backgroundColor: tk.tipBg,
      borderWidth: 0,
      padding: [9, 12],
      extraCssText: 'border-radius:' + (10) + 'px;box-shadow:var(--shadow-float)',
      textStyle: { color: tk.tipText, fontFamily: tk.fontBody, fontSize: 12.5 },
      axisPointer: { type: 'line', lineStyle: { color: tk.axis, width: 1 } },
    },
  };

  // Geometria: sin lineas de eje, solo horizontales punteadas. Menos rejilla, mas aire.
  const catAxis = {
    type: 'category',
    data: labels,
    boundaryGap: type === 'bar' || type === 'stackedBar' || type === 'stacked100' || type === 'waterfall' || type === 'pareto',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: tk.label, fontFamily: tk.fontBody, fontSize: 11.5, hideOverlap: true, margin: 12 },
  };
  const valAxis = {
    type: 'value',
    splitLine: { lineStyle: { color: tk.grid, type: 'dashed' } },
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: tk.label, fontFamily: tk.fontMono, fontSize: 11, formatter: axisFmt, margin: 12 },
    min: min, max: max,
  };

  // Barra en pill: el radio es la mitad del ancho, como el Switch y el Progress.
  const BAR_W = 34;
  const cap = BAR_W / 2;
  const barRadius = (stacked) => {
    if (stacked) return 0;
    return horizontal ? [0, cap, cap, 0] : [cap, cap, 0, 0];
  };

  const label = showValues
    ? { show: true, position: horizontal ? 'right' : 'top', fontFamily: tk.fontMono, fontSize: 11, fontWeight: 600, color: tk.label, formatter: (p) => fmt(p.value) }
    : { show: false };

  switch (type) {
    case 'line':
    case 'area': {
      const isArea = type === 'area' || area;
      return merge(base, {
        tooltip: {
          trigger: 'axis',
          formatter: (ps) => tipHead(ps[0].axisValueLabel)
            + ps.map((p) => tipRow(p.marker, p.seriesName, fmt(p.value))).join(''),
        },
        xAxis: catAxis,
        yAxis: valAxis,
        series: series.map((s, i) => {
          const c = s.color || colorFor(i, s.label);
          return merge({
            name: s.label, type: 'line', data: s.values, smooth: smooth ? 0.35 : false,
            showSymbol: false, symbolSize: 7,
            lineStyle: { width: 2.25, color: c, cap: 'round', join: 'round' },
            itemStyle: { color: c },
            stack: stack ? 'total' : undefined,
            emphasis: { focus: 'series', scale: 1.4 },
            areaStyle: isArea ? { opacity: 0.14, color: c } : undefined,
          }, motion ? {
            // La linea se dibuja de izquierda a derecha; cada serie entra detras de la anterior.
            animationDuration: 900,
            animationDelay: i * 160,
            animationEasing: 'cubicOut',
          } : { animation: false });
        }),
      });
    }
    case 'bar':
    case 'stackedBar': {
      const stacked = type === 'stackedBar' || stack;
      return merge(base, {
        tooltip: {
          trigger: 'axis', axisPointer: { type: 'shadow' },
          formatter: (ps) => tipHead(ps[0].axisValueLabel)
            + ps.map((p) => tipRow(p.marker, p.seriesName, fmt(p.value))).join(''),
        },
        xAxis: horizontal ? valAxis : catAxis,
        yAxis: horizontal ? merge(catAxis, { boundaryGap: true, inverse: true }) : valAxis,
        series: series.map((s, i) => merge({
          name: s.label, type: 'bar',
          data: itemColors
            ? s.values.map((v, j) => ({ value: v, itemStyle: { color: rz(itemColors[j] || colorFor(i, s.label)) } }))
            : s.values,
          stack: stacked ? 'total' : undefined,
          barMaxWidth: BAR_W,
          itemStyle: { color: rz(s.color || colorFor(i, s.label)), borderRadius: barRadius(stacked) },
          emphasis: { focus: 'series' },
          label: label,
        }, mount(true))),
      });
    }
    case 'stacked100': {
      const n = (series[0] && series[0].values.length) || 0;
      const totals = Array.from({ length: n }, (_, j) => series.reduce((a, s) => a + (s.values[j] || 0), 0) || 1);
      return merge(base, {
        tooltip: {
          trigger: 'axis', axisPointer: { type: 'shadow' },
          formatter: (ps) => tipHead(ps[0].axisValueLabel) + ps.map((p) =>
            tipRow(p.marker, p.seriesName, Math.round(p.value / totals[p.dataIndex] * 100) + '%')
          ).join(''),
        },
        xAxis: horizontal ? merge(valAxis, { max: 'dataMax', axisLabel: { show: false } }) : catAxis,
        yAxis: horizontal ? merge(catAxis, { boundaryGap: true, inverse: true }) : merge(valAxis, { max: 'dataMax', axisLabel: { show: false } }),
        series: series.map((s, i) => merge({
          name: s.label, type: 'bar', stack: 'total', data: s.values, barMaxWidth: BAR_W,
          itemStyle: { color: rz(s.color || colorFor(i, s.label)) },
          emphasis: { focus: 'series' },
        }, mount(true))),
      });
    }
    case 'donut':
    case 'pie': {
      const data = (series[0] ? series[0].data || series[0].values : series) || [];
      const items = data.map((d, i) => (typeof d === 'number'
        ? { name: labels[i] || String(i), value: d }
        : { name: d.label || d.name, value: d.value, itemStyle: { color: rz(d.color || colorFor(i, d.label || d.name)) } }));
      const wedgePal = paletteFor(items.length, palette, tk);
      return merge(base, {
        color: wedgePal,
        tooltip: {
          trigger: 'item',
          formatter: (p) => tipRow(p.marker, p.name, fmt(p.value)) + tipHead(p.percent + '% del total'),
        },
        legend: legend ? { show: true, orient: 'vertical', right: 0, top: 'middle', itemGap: 12, icon: 'circle', itemWidth: 9, itemHeight: 9, textStyle: textStyle } : { show: false },
        series: [merge({
          type: 'pie',
          radius: type === 'donut' ? ['58%', '82%'] : ['0%', '80%'],
          center: legend ? ['36%', '52%'] : ['50%', '52%'],
          data: items.map((it, i) => merge({ itemStyle: { color: wedgePal[i % wedgePal.length] } }, it)),
          itemStyle: { borderColor: tk.card, borderWidth: 2, borderRadius: 3 },
          label: { show: false },
          emphasis: { scale: true, scaleSize: 5, itemStyle: { shadowBlur: 14, shadowColor: 'rgba(0,0,0,.14)' } },
        }, motion ? {
          // Barre como un reloj en vez de aparecer de golpe.
          animationType: 'expansion', animationDuration: 760, animationEasing: 'cubicOut',
        } : { animation: false })],
      });
    }
    case 'scatter': {
      return merge(base, {
        tooltip: {
          trigger: 'item',
          formatter: (p) => tipHead(p.seriesName) + tipRow('', fmt(p.value[0]), fmt(p.value[1])),
        },
        xAxis: merge(valAxis, { splitLine: { show: true, lineStyle: { color: tk.grid, type: 'dashed' } } }),
        yAxis: valAxis,
        series: series.map((s, i) => merge({
          name: s.label, type: 'scatter', data: s.values, symbolSize: s.symbolSize || 10,
          itemStyle: { color: rz(s.color || colorFor(i, s.label)), opacity: 0.78 },
          emphasis: { focus: 'series', itemStyle: { opacity: 1 } },
        }, merge(extra(s), motion ? {
          animationDuration: 700,
          animationDelay: (idx) => idx * 22 + i * 90,
          animationEasing: 'cubicOut',
        } : { animation: false }))),
      });
    }
    case 'heatmap': {
      const m = matrix || { rows: [], cols: [], values: [] };
      const vals = m.values.map((v) => v[2]);
      return merge(base, {
        tooltip: {
          position: 'top',
          formatter: (p) => tipHead(m.cols[p.value[0]] + ' · ' + m.rows[p.value[1]]) + num(fmt(p.value[2])),
        },
        grid: { left: 8, right: 14, top: 14, bottom: 46, containLabel: true },
        xAxis: merge(catAxis, { data: m.cols, boundaryGap: true, splitArea: { show: false }, axisLine: { show: false } }),
        yAxis: merge(catAxis, { data: m.rows, boundaryGap: true, splitArea: { show: false }, axisLine: { show: false }, inverse: true }),
        visualMap: {
          min: Math.min.apply(null, vals.concat([0])), max: Math.max.apply(null, vals.concat([1])),
          orient: 'horizontal', left: 'center', bottom: 0, itemWidth: 11, itemHeight: 90,
          inRange: { color: tk.ramp }, textStyle: monoStyle, formatter: (v) => String(fmt(Math.round(v))),
        },
        series: [merge({
          type: 'heatmap', data: m.values,
          itemStyle: { borderColor: tk.card, borderWidth: 2, borderRadius: 4 },
          emphasis: { itemStyle: { borderColor: tk.text, borderWidth: 1.5 } },
        }, mount(true))],
      });
    }
    case 'radar': {
      const inds = (indicators || labels).map((x) => (typeof x === 'string' ? { name: x, max: max || 100 } : x));
      return merge(base, {
        tooltip: { trigger: 'item' },
        radar: {
          indicator: inds, radius: '66%', splitNumber: 4,
          axisName: { color: tk.label, fontFamily: tk.fontBody, fontSize: 11.5 },
          splitLine: { lineStyle: { color: tk.grid, type: 'dashed' } },
          splitArea: { show: false },
          axisLine: { lineStyle: { color: tk.grid } },
        },
        series: [merge({
          type: 'radar',
          data: series.map((s, i) => {
            const c = s.color || colorFor(i, s.label);
            return {
              name: s.label, value: s.values,
              lineStyle: { color: c, width: 2.25, join: 'round' }, itemStyle: { color: c },
              areaStyle: { color: c, opacity: 0.16 },
            };
          }),
        }, mount(false))],
      });
    }
    case 'waterfall': {
      const vals = (series[0] && series[0].values) || [];
      const helper = [];
      const bars = [];
      let run = 0;
      vals.forEach((v, i) => {
        const isTotal = props.totals && props.totals.indexOf(i) !== -1;
        if (isTotal) {
          // Un total es absoluto: usa su propio valor, o el acumulado si viene en 0.
          const abs = v !== 0 ? v : run;
          helper.push(0);
          bars.push(abs);
          run = abs;
          return;
        }
        helper.push(v >= 0 ? run : run + v);
        bars.push(Math.abs(v));
        run += v;
      });
      return merge(base, {
        tooltip: {
          trigger: 'axis', axisPointer: { type: 'shadow' },
          formatter: (ps) => {
            const p = ps.filter((x) => x.seriesName !== '__helper')[0];
            if (!p) return '';
            const raw = vals[p.dataIndex];
            const isTotal = props.totals && props.totals.indexOf(p.dataIndex) !== -1;
            return tipHead(p.name) + num(isTotal ? fmt(bars[p.dataIndex]) : (raw >= 0 ? '+' : '−') + fmt(Math.abs(raw)));
          },
        },
        xAxis: catAxis,
        yAxis: valAxis,
        series: [
          { name: '__helper', type: 'bar', stack: 'wf', silent: true, itemStyle: { color: 'transparent' }, emphasis: { itemStyle: { color: 'transparent' } }, data: helper, animation: false },
          merge({
            name: series[0] ? series[0].label : 'Cambio', type: 'bar', stack: 'wf', barMaxWidth: 38,
            data: bars.map((v, i) => {
              const isTotal = props.totals && props.totals.indexOf(i) !== -1;
              return { value: v, itemStyle: { color: isTotal ? tk.neutral : (vals[i] >= 0 ? tk.positive : tk.negative), borderRadius: 6 } };
            }),
            label: label,
          }, mount(true)),
        ],
      });
    }
    case 'pareto': {
      const data = (series[0] && series[0].values) || [];
      const total = data.reduce((a, b) => a + b, 0) || 1;
      let acc = 0;
      const cum = data.map((v) => { acc += v; return +(acc / total * 100).toFixed(1); });
      return merge(base, {
        tooltip: {
          trigger: 'axis', axisPointer: { type: 'shadow' },
          formatter: (ps) => tipHead(ps[0].name) + ps.map((p) =>
            tipRow(p.marker, p.seriesName, p.seriesIndex === 1 ? p.value + '%' : fmt(p.value))).join(''),
        },
        legend: legend ? { show: true, top: 0, left: 0, textStyle: textStyle } : { show: false },
        xAxis: catAxis,
        yAxis: [
          valAxis,
          merge(valAxis, { max: 100, axisLabel: { formatter: (v) => v + '%' }, splitLine: { show: false } }),
        ],
        series: [
          merge({
            name: series[0] ? series[0].label : 'Frecuencia', type: 'bar', barMaxWidth: BAR_W,
            data: itemColors
              ? data.map((v, j) => ({ value: v, itemStyle: { color: rz(itemColors[j] || tk.text) } }))
              : data,
            itemStyle: { color: tk.text, borderRadius: barRadius(false) },
          }, mount(true)),
          merge({
            name: 'Acumulado', type: 'line', yAxisIndex: 1, data: cum, smooth: false,
            lineStyle: { color: tk.accent, width: 2.25, cap: 'round', join: 'round' }, itemStyle: { color: tk.accent }, symbolSize: 6,
          }, motion ? { animationDuration: 900, animationDelay: 260 } : { animation: false }),
        ],
      });
    }
    case 'gauge': {
      const v = target != null ? target : (series[0] && series[0].values[0]) || 0;
      const cap2 = max != null ? max : 100;
      return merge(base, {
        tooltip: { show: false },
        series: [{
          type: 'gauge', startAngle: 200, endAngle: -20, min: min || 0, max: cap2,
          radius: '96%', center: ['50%', '62%'],
          progress: { show: true, width: 14, roundCap: true, itemStyle: { color: v / cap2 >= 0.85 ? tk.negative : tk.text } },
          axisLine: { lineStyle: { width: 14, color: [[1, tk.grid]] }, roundCap: true },
          axisTick: { show: false }, splitLine: { show: false },
          axisLabel: { show: false },
          pointer: { show: false },
          anchor: { show: false },
          title: { show: false },
          detail: {
            valueAnimation: motion, offsetCenter: [0, '-6%'],
            fontFamily: tk.fontMono, fontSize: tk.kpiSize, fontWeight: tk.kpiWeight, color: tk.text,
            formatter: (x) => String(fmt(x)),
          },
          data: [{ value: v }],
          animation: motion,
          animationDuration: 900,
          animationEasing: 'cubicOut',
        }],
      });
    }
    case 'funnel': {
      const data = (series[0] && (series[0].data || series[0].values)) || [];
      const items = data.map((d, i) => (typeof d === 'number'
        ? { name: labels[i] || String(i), value: d }
        : { name: d.label || d.name, value: d.value }));
      return merge(base, {
        tooltip: { trigger: 'item', formatter: (p) => tipRow(p.marker, p.name, fmt(p.value)) },
        series: [merge({
          type: 'funnel', left: '4%', right: '4%', top: legend ? 34 : 10, bottom: 6,
          minSize: '24%', gap: 2, sort: 'descending',
          data: items.map((it, i) => {
            const fill = tk.ramp[Math.max(0, tk.ramp.length - 1 - i)];
            return merge(it, {
              itemStyle: { color: fill, borderWidth: 0, borderRadius: 4 },
              label: { color: onColor(fill, tk.text, tk.card) },
            });
          }),
          label: { show: true, position: 'inside', fontFamily: tk.fontBody, fontSize: 12, fontWeight: 600, formatter: (p) => p.name },
          emphasis: { label: { fontSize: 12.5 } },
        }, mount(true))],
      });
    }
    case 'treemap': {
      const data = (series[0] && (series[0].data || series[0].values)) || [];
      return merge(base, {
        tooltip: { formatter: (p) => tipRow('', p.name, fmt(p.value)) },
        series: [merge({
          type: 'treemap', roam: false, nodeClick: false, breadcrumb: { show: false },
          left: 0, right: 0, top: legend ? 34 : 0, bottom: 0,
          itemStyle: { borderColor: tk.card, borderWidth: 2, gapWidth: 2, borderRadius: 4 },
          label: { fontFamily: tk.fontBody, fontSize: 12, fontWeight: 600 },
          data: data.map((d, i) => {
            const fill = rz(d.color || colorFor(i, d.label || d.name));
            return {
              name: d.label || d.name, value: d.value,
              itemStyle: { color: fill },
              label: { color: onColor(fill, tk.text, tk.card) },
            };
          }),
        }, mount(false))],
      });
    }
    case 'boxplot': {
      return merge(base, {
        tooltip: { trigger: 'item' },
        xAxis: merge(catAxis, { boundaryGap: true }),
        yAxis: valAxis,
        series: [merge({
          type: 'boxplot', data: (series[0] && series[0].values) || [],
          itemStyle: { color: tk.card, borderColor: tk.text, borderWidth: 1.5 },
          emphasis: { itemStyle: { borderColor: tk.accent, borderWidth: 2 } },
        }, mount(true))],
      });
    }
    default:
      return base;
  }
}

function FlowChart({
  type = 'line',
  height = 280,
  loading = false,
  emptyLabel = 'Sin datos para este periodo',
  option: override,
  onSelect,
  ariaLabel,
  style,
  ...rest
}) {
  const hostRef = React.useRef(null);
  const chartRef = React.useRef(null);
  const rafRef = React.useRef(0);
  const lastSize = React.useRef({ w: 0, h: 0 });
  const [ready, setReady] = React.useState(typeof window !== 'undefined' && !!window.echarts);
  const [failed, setFailed] = React.useState(false);
  const [themeKey, setThemeKey] = React.useState(0);

  const props = rest;
  const hasData = React.useMemo(() => {
    if (props.target != null) return true;
    if (props.matrix) return (props.matrix.values || []).length > 0;
    const s = props.series || [];
    return s.length > 0 && s.some((x) => ((x.values || x.data || []).length > 0));
  }, [props.series, props.matrix, props.target]);

  React.useEffect(() => {
    let alive = true;
    loadEcharts().then(() => { if (alive) setReady(true); }).catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
  }, []);

  // Re-tematiza cuando cambia data-mode en cualquier ancestro
  React.useEffect(() => {
    if (typeof MutationObserver === 'undefined') return;
    const obs = new MutationObserver(() => setThemeKey((k) => k + 1));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });
    let node = hostRef.current && hostRef.current.parentElement;
    while (node && node !== document.documentElement) {
      obs.observe(node, { attributes: true, attributeFilter: ['data-mode'] });
      node = node.parentElement;
    }
    return () => obs.disconnect();
  }, [ready]);

  React.useEffect(() => {
    if (!ready || !hostRef.current || !hasData) return;
    const ec = window.echarts;
    if (!chartRef.current || chartRef.current.isDisposed()) {
      chartRef.current = ec.init(hostRef.current, null, { renderer: 'canvas' });
      if (onSelect) chartRef.current.on('click', (p) => onSelect(p));
    }
    const tk = readTokens(hostRef.current);
    const opt = resolveVars(merge(buildOption(type, props, tk), override), tk.resolve);
    chartRef.current.setOption(opt, true);

    // La animacion de entrada arranca las series en su frame cero: barra de altura 0,
    // linea sin trazo, punto sin escala. Si el rAF del contenedor no avanza (iframe
    // en segundo plano, pestana oculta, preview throttleado) el frame cero se queda
    // fijo y el chart se ve como ejes vacios. Probamos el loop y, si no corre,
    // repintamos el estado final sin animacion.
    let looped = false;
    const probe = requestAnimationFrame(() => { looped = true; });
    const settle = setTimeout(() => {
      if (looped) return;
      const c = chartRef.current;
      if (!c || c.isDisposed()) return;
      // Se reconstruye la opcion por la rama sin motion: apagar la bandera global no
      // basta porque cada serie trae su propia animation con animationDelay, y la
      // configuracion por serie gana. Y hay que vaciar la instancia antes de repintar:
      // setOption no reconstruye los elementos ya atascados en su frame cero.
      const still = resolveVars(merge(buildOption(type, Object.assign({}, props, { animate: false }), tk), override), tk.resolve);
      still.animation = false;
      if (still.series) still.series = still.series.map(function (sr) {
        return Object.assign({}, sr, { animation: false, animationDuration: 0, animationDelay: 0, animationDurationUpdate: 0 });
      });
      c.clear();
      c.setOption(still, true);
    }, 320);
    return () => { cancelAnimationFrame(probe); clearTimeout(settle); };
  }, [ready, hasData, type, themeKey, override, JSON.stringify(props.series || null), JSON.stringify(props.matrix || null), props.highlight, props.stack, props.legend, props.horizontal, props.showValues, props.palette, props.animate]);

  React.useEffect(() => {
    if (!chartRef.current) return;
    if (loading) chartRef.current.showLoading('default', {
      text: '', maskColor: 'transparent', color: readTokens(hostRef.current).accent, spinnerRadius: 9, lineWidth: 2,
    });
    else chartRef.current.hideLoading();
  }, [loading, ready, hasData]);

  // El resize se difiere fuera del callback del observer: llamar a chart.resize()
  // dentro de la misma entrega re-ensucia el elemento observado y el navegador
  // aborta el ciclo ("loop completed with undelivered notifications").
  React.useEffect(() => {
    if (!hostRef.current || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const el = hostRef.current;
        if (!el || !chartRef.current || chartRef.current.isDisposed()) return;
        const w = el.clientWidth, h = el.clientHeight;
        if (w === lastSize.current.w && h === lastSize.current.h) return;
        lastSize.current = { w: w, h: h };
        chartRef.current.resize();
      });
    });
    ro.observe(hostRef.current);
    return () => { ro.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, [ready]);

  React.useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    if (chartRef.current && !chartRef.current.isDisposed()) chartRef.current.dispose();
    chartRef.current = null;
  }, []);

  const frame = {
    position: 'relative', width: '100%', height: height,
    fontFamily: 'var(--font-body)', ...style,
  };

  if (failed || !hasData) {
    return React.createElement('div', {
      style: merge(frame, { display: 'flex', alignItems: 'center', justifyContent: 'center' }),
      role: 'img', 'aria-label': failed ? 'La grafica no pudo cargar' : emptyLabel,
    }, React.createElement('div', {
      style: { textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 },
    },
      React.createElement('span', {
        className: 'flow-symbol', 'aria-hidden': true,
        style: { fontSize: 26, color: 'var(--text-muted)', display: 'block', marginBottom: 4 },
      }, failed ? 'cloud_off' : 'bar_chart'),
      failed ? 'La grafica no pudo cargar' : emptyLabel));
  }

  return React.createElement('div', {
    ref: hostRef,
    role: 'img',
    'aria-label': ariaLabel || ('Grafica ' + type),
    style: frame,
  });
}

F.FlowChart = FlowChart;
})();

// ---- primitives/Flag.jsx ----
(function(){

/**
 * Flag — bandera de pais desde flag-icons (SVG, no emoji).
 *
 * Usa la variante cuadrada (1:1) para que la mascara circular recorte parejo.
 * El anillo interior evita que las banderas con blanco al borde (JP, PL) se
 * desvanezcan sobre --surface-card.
 */

const FLAG_CSS = 'https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/css/flag-icons.min.css';

/** Inyecta la hoja de flag-icons una sola vez por documento. */
function ensureFlagCss(href = FLAG_CSS) {
  if (typeof document === 'undefined') return;
  if (document.querySelector('link[data-flow-flags]')) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = href;
  l.setAttribute('data-flow-flags', '');
  document.head.appendChild(l);
}

const RADIUS = {
  circle: '50%',
  rounded: 'var(--radius-xs)',
  square: '0',
};

function Flag({
  country,
  size = 20,
  shape = 'circle',
  label,
  ring = true,
  style,
}) {
  React.useEffect(() => { ensureFlagCss(); }, []);

  const cc = String(country || '').toLowerCase();

  return React.createElement('span', {
    className: 'fi fi-' + cc + ' fis',
    role: label ? 'img' : undefined,
    'aria-label': label || undefined,
    'aria-hidden': label ? undefined : true,
    style: {
      width: size, height: size, flex: 'none', display: 'inline-block',
      borderRadius: RADIUS[shape] || RADIUS.circle,
      backgroundSize: 'cover', backgroundPosition: 'center',
      boxShadow: ring ? 'var(--shadow-inset-ring)' : 'none',
      ...style,
    },
  });
}

F.Flag = Flag;
F.ensureFlagCss = ensureFlagCss;
})();

window.Flow = F;
})();
