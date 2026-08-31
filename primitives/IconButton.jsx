import React from 'react';

// El diametro parte de --hit-target-min en los tres tamanos: sm medía 36 y era el
// quinto componente con su propia tabla de alturas por debajo del suelo, tras
// Button, ControlShell, Chip y Tabs. Lo que cambia con el tamano es el glifo.
const SIZES = { sm: { d: 44, icon: 18 }, md: { d: 44, icon: 22 }, lg: { d: 52, icon: 24 } };

export function IconButton({
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
      className: 'flow-icon' + (selected ? ' flow-icon--fill' : ''), 'aria-hidden': true,
      style: { fontSize: s.icon },
    }, icon),
    badge && React.createElement('span', {
      style: { position: 'absolute', top: 6, right: 6, width: 9, height: 9, borderRadius: '50%', background: 'var(--status-live)', border: '2px solid var(--surface-card)', animation: 'flowPulse 1.6s ease-in-out infinite' },
    })
  );
}
