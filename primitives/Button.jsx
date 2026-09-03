import React from 'react';

// Los tres tamanos parten del mismo suelo: --hit-target-min. Un boton pequeno es
// mas estrecho y de tipografia menor, no mas bajo (btn-1). Con el suelo a 44, sm
// solo puede distinguirse por padding y tipo, y eso es correcto: la alternativa
// era que "sm" fuera el hueco por donde todo el sistema se salta el objetivo.
const SIZES = {
  sm: { h: 44, px: 18, fs: 13, icon: 18 },
  md: { h: 44, px: 22, fs: 14, icon: 20 },
  lg: { h: 52, px: 28, fs: 15, icon: 22 },
};

export function Button({
  variant = 'primary', size = 'md', icon, iconTrailing,
  loading = false, disabled = false, fullWidth = false,
  children, onClick, type = 'button', ariaLabel, style,
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const s = SIZES[size] || SIZES.md;

  const V = {
    primary: { bg: hover ? 'var(--action-primary-hover)' : 'var(--action-primary)', color: 'var(--text-on-inverse)', border: 'none' },
    accent: { bg: hover ? 'var(--action-accent-hover)' : 'var(--action-accent)', color: 'var(--text-on-accent)', border: 'none', glow: true },
    secondary: { bg: 'var(--surface-card)', color: 'var(--text-primary)', border: '1.5px solid ' + (hover ? 'var(--border-strong)' : 'var(--border-default)') },
    ghost: { bg: hover ? 'var(--surface-sunken)' : 'transparent', color: 'var(--text-primary)', border: 'none' },
    danger: { bg: hover ? 'var(--status-danger-text)' : 'var(--status-danger)', color: 'var(--text-on-accent)', border: 'none' },
  }[variant] || {};

  const shadows = [];
  if (focus) shadows.push('var(--focus-ring)');
  if (V.glow && hover && !disabled) shadows.push('var(--shadow-accent-glow)');

  const iconEl = (name) => React.createElement('span', {
    className: 'flow-symbol', 'aria-hidden': true,
    style: { fontSize: s.icon, lineHeight: 1 },
  }, name);

  return React.createElement('button', {
    type, onClick: disabled || loading ? undefined : onClick,
    // Deshabilitado de verdad mientras carga: quitar el handler no impide que el
    // boton reciba foco ni que envie el formulario, y dos clics rapidos mandaban
    // dos veces (btn-3).
    disabled: disabled || loading, 'aria-label': ariaLabel, 'aria-busy': loading || undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => { setHover(false); setPress(false); },
    onMouseDown: () => setPress(true), onMouseUp: () => setPress(false),
    onFocus: (e) => setFocus(e.target.matches(':focus-visible')), onBlur: () => setFocus(false),
    style: {
      display: fullWidth ? 'flex' : 'inline-flex', width: fullWidth ? '100%' : undefined,
      alignItems: 'center', justifyContent: 'center', gap: 'var(--gap-inline)',
      minHeight: s.h, padding: '0 ' + s.px + 'px',
      fontFamily: 'var(--font-body)', fontSize: s.fs, fontWeight: 600, whiteSpace: 'nowrap',
      background: V.bg, color: V.color, border: V.border || 'none',
      borderRadius: 'var(--radius-pill)',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      outline: 'none',
      boxShadow: shadows.join(', ') || 'none',
      transform: disabled ? 'none' : press ? 'var(--press-scale)' : hover ? 'var(--hover-scale)' : 'none',
      transition: 'transform var(--dur-fast) var(--ease-spring), background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      ...style,
    },
  },
    loading
      ? React.createElement('span', { 'aria-hidden': true, style: { width: s.icon - 4, height: s.icon - 4, border: '2.5px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'flowSpin .7s linear infinite' } })
      : icon && iconEl(icon),
    children && React.createElement('span', null, children),
    !loading && iconTrailing && iconEl(iconTrailing)
  );
}
