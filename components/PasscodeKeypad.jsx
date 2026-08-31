import React from 'react';

/** Numeric keypad + dots for mobile passcode. */
export function PasscodeKeypad({ length = 6, value = '', onChange, onComplete, invalid = false, biometricIcon, onBiometric, style }) {
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
      biometricIcon ? key(React.createElement('span', { className: 'flow-icon', 'aria-hidden': true, style: { fontSize: 28, color: 'var(--text-accent)' } }, biometricIcon), onBiometric, 'Usar biometrico') : React.createElement('span', null),
      key('0', () => press('0'), '0'),
      key(React.createElement('span', { className: 'flow-icon', 'aria-hidden': true, style: { fontSize: 24 } }, 'backspace'), () => press('back'), 'Borrar')));
}
