import React from 'react';

/** Bottom composer: growing textarea + send button + optional suggestion chips. */
export function ChatComposer({ value = '', onChange, onSend, placeholder = 'Pregunta sobre tu flota…', suggestions = [], disabled = false, style }) {
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
