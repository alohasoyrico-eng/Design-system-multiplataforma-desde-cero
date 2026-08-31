import React from 'react';

/** Full-width equal-segment switcher for mobile. items: [{value,label,icon?}] */
export function SegmentedControl({ items = [], value, onChange, style }) {
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
        t.icon && React.createElement('span', { className: 'flow-icon' + (active ? ' flow-icon--fill' : ''), 'aria-hidden': true, style: { fontSize: 17 } }, t.icon),
        t.label);
    }));
}
