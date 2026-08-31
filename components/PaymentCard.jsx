import React from 'react';

/** Flow-branded payment card. variant ink/accent/sand; frozen adds frost overlay. */
export function PaymentCard({ holder = '', last4 = '0000', variant = 'ink', frozen = false, label, expires, width = 320, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const V = {
    ink: { bg: 'var(--flow-ink-900)', fg: 'var(--card-fg-on-ink)', dim: 'var(--card-dim-on-ink)', logoFilter: 'invert(1)' },
    accent: { bg: 'var(--flow-red-500)', fg: 'var(--card-fg-on-accent)', dim: 'var(--card-dim-on-accent)', logoFilter: 'invert(1)' },
    sand: { bg: 'var(--flow-sand-50)', fg: 'var(--flow-ink-900)', dim: 'var(--flow-ink-500)', logoFilter: 'none', border: '1px solid var(--flow-sand-200)' },
  }[variant] || {};
  const h = Math.round(width / 1.586);
  return React.createElement('div', {
    onClick, role: onClick ? 'button' : undefined, tabIndex: onClick ? 0 : undefined,
    onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
    style: {
      position: 'relative', width, height: h, borderRadius: 20, boxSizing: 'border-box',
      background: V.bg, color: V.fg, border: V.border || 'none', overflow: 'hidden',
      padding: Math.round(width * 0.065), display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-body)', cursor: onClick ? 'pointer' : 'default', flex: 'none',
      boxShadow: hover && onClick ? 'var(--shadow-float)' : 'var(--shadow-raised)',
      transform: hover && onClick ? 'translateY(-3px)' : 'none',
      transition: 'transform var(--dur-fast) var(--ease-spring), box-shadow var(--dur-fast) var(--ease-out)',
      ...style,
    },
  },
    React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start' } },
      React.createElement('img', { src: (window.FLOW_ASSET_BASE || '') + 'assets/flow-logo.png', alt: 'Flow', style: { height: Math.round(width * 0.055), filter: V.logoFilter } }),
      label && React.createElement('span', { style: { marginLeft: 'auto', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: V.dim } }, label)),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto', marginBottom: 8 } },
      React.createElement('span', { 'aria-hidden': true, style: { width: Math.round(width * 0.115), height: Math.round(width * 0.085), borderRadius: 6, background: variant === 'sand' ? 'var(--flow-sand-200)' : 'rgba(255,255,255,.25)', display: 'inline-block' } }),
      React.createElement('span', { className: 'flow-icon', 'aria-hidden': true, style: { fontSize: Math.round(width * 0.07), color: V.dim } }, 'contactless')),
    React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 10 } },
      React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: Math.round(width * 0.052), fontWeight: 500, letterSpacing: '.08em', whiteSpace: 'nowrap' } }, '•••• ' + last4),
      expires && React.createElement('span', { style: { marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: Math.round(width * 0.038), color: V.dim } }, expires)),
    holder && React.createElement('div', { style: { fontSize: Math.round(width * 0.04), fontWeight: 600, color: V.dim, marginTop: 4, textTransform: 'uppercase', letterSpacing: '.06em' } }, holder),
    frozen && React.createElement('div', {
      style: {
        position: 'absolute', inset: 0, background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        animation: 'flowScaleIn var(--dur-base) var(--ease-out)',
      },
    },
      React.createElement('span', { className: 'flow-icon', 'aria-hidden': true, style: { fontSize: 26, color: 'var(--card-fg-on-accent)', textShadow: '0 1px 6px rgba(0,0,0,.3)' } }, 'ac_unit'),
      React.createElement('span', { style: { fontSize: 14, fontWeight: 700, color: 'var(--card-fg-on-accent)', textShadow: '0 1px 6px rgba(0,0,0,.3)' } }, 'Congelada')));
}
