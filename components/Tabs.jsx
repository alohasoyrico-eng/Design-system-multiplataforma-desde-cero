import React from 'react';

/** items: [{value, label, icon?, count?}] */
export function Tabs({ items = [], value, onChange, variant = 'pill', style }) {
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
        t.icon && React.createElement('span', { className: 'flow-icon' + (active ? ' flow-icon--fill' : ''), 'aria-hidden': true, style: { fontSize: 18 } }, t.icon),
        t.label,
        t.count != null && React.createElement('span', {
          style: { fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, background: active ? 'var(--surface-accent-subtle)' : 'var(--border-subtle)', color: active ? 'var(--text-accent)' : 'var(--text-muted)', borderRadius: 999, padding: '1px 7px' },
        }, t.count));
    }));
}
