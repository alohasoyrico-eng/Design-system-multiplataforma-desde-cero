import React from 'react';
import { ControlShell } from '../primitives/shells/ControlShell';
import { Popover } from '../primitives/shells/Popover';

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
export function DatePicker({
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
  }, React.createElement('span', { className: 'flow-icon', style: { fontSize: 20 }, 'aria-hidden': true }, dir < 0 ? 'chevron_left' : 'chevron_right'));

  return React.createElement(React.Fragment, null,
    React.createElement(ControlShell, {
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
    React.createElement(Popover, {
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
