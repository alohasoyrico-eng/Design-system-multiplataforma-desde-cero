import React from 'react';

export function Slider({ value = 0, onChange, min = 0, max = 100, step = 1, label, format, disabled = false, style }) {
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
