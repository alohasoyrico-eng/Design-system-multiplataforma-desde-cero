import React from 'react';
import { OverlayShell } from '../primitives/shells/OverlayShell';
import { Badge } from '../primitives/Badge';
import { IconButton } from '../primitives/IconButton';

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
export function KanbanBoard({
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
