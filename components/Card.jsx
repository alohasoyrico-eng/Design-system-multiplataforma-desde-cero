import React from 'react';

/** Superficie contenedora. variant: 'default' | 'minimal' | 'elevated' | 'ghost'. */
export function Card({ children, variant = 'default', accent = 'var(--action-accent)', interactive = false, selected = false, padding = 'var(--pad-card)', onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const lift = interactive && hover;
  const skin = variant === 'minimal' ? {
    background: 'transparent', border: '1px solid transparent', boxShadow: 'none',
  } : variant === 'elevated' ? {
    background: 'var(--surface-card)', border: '2px solid ' + accent, boxShadow: 'var(--shadow-float)',
  } : variant === 'ghost' ? {
    background: 'color-mix(in srgb, var(--surface-card) 40%, transparent)', backdropFilter: 'blur(10px)',
    border: '1px solid color-mix(in srgb, var(--border-subtle) 50%, transparent)', boxShadow: 'none',
  } : {
    background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-rest)',
  };
  const restShadow = lift ? 'var(--shadow-float)' : skin.boxShadow;
  return React.createElement(interactive ? 'button' : 'div', {
    onClick: interactive ? onClick : undefined,
    type: interactive ? 'button' : undefined,
    onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
    onFocus: interactive ? () => setFocus(true) : undefined, onBlur: interactive ? () => setFocus(false) : undefined,
    style: {
      display: 'block', width: interactive ? '100%' : undefined, textAlign: 'left', boxSizing: 'border-box',
      background: skin.background, backdropFilter: skin.backdropFilter,
      border: selected ? '1.5px solid var(--border-focus)' : skin.border,
      borderRadius: 'var(--radius-lg)', padding,
      boxShadow: [focus ? 'var(--focus-ring)' : null, restShadow !== 'none' ? restShadow : null].filter(Boolean).join(', ') || 'none',
      transform: lift ? 'var(--lift-hover)' : 'none',
      cursor: interactive ? 'pointer' : 'default',
      fontFamily: 'var(--font-body)', color: 'var(--text-primary)', outline: 'none',
      transition: 'transform var(--dur-fast) var(--ease-spring), box-shadow var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
      ...style,
    },
  }, children);
}
