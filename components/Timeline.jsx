import React from 'react';

const STATUS = {
  done: { color: 'var(--status-success)', icon: 'check' },
  active: { color: 'var(--action-accent)', icon: 'radio_button_checked' },
  pending: { color: 'var(--flow-ink-300)', icon: 'radio_button_unchecked' },
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
export function Timeline({ items = [], mode = 'steps', style }) {
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
          }, React.createElement('span', { className: 'flow-icon', 'aria-hidden': true, style: { fontSize: 15 } }, it.icon || st.icon)),
          !last && React.createElement('span', { style: { width: 2, flex: 1, minHeight: 24, background: 'var(--border-subtle)', marginTop: 2 } })),
        React.createElement('div', { style: { paddingBottom: last ? 0 : 22, flex: 1 } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' } },
            React.createElement('span', { style: { fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' } }, it.title),
            it.timestamp && React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-muted)', flex: 'none' } }, it.timestamp)),
          it.description && React.createElement('div', { style: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 2 } }, it.description)));
    }));
}
