import React from 'react';

/** One-time code input. Renders N boxes driven by a single hidden input (autocomplete one-time-code). */
export function OTPInput({ length = 6, value = '', onChange, onComplete, invalid = false, disabled = false, autoFocus = false, style }) {
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
