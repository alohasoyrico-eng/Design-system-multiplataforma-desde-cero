import React from 'react';

const TONES = {
  neutral: { bg: 'var(--surface-sunken)', fg: 'var(--text-secondary)' },
  success: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' },
  warning: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' },
  danger: { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)' },
  info: { bg: 'var(--status-info-bg)', fg: 'var(--status-info-text)' },
  accent: { bg: 'var(--surface-accent-subtle)', fg: 'var(--text-accent)' },
};

export function Badge({ tone = 'neutral', live = false, icon, children, style }) {
  const t = TONES[tone] || TONES.neutral;
  return React.createElement('span', {
    style: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: t.bg, color: t.fg, borderRadius: 'var(--radius-pill)',
      padding: '4px 12px', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
      lineHeight: 1.4, whiteSpace: 'nowrap', ...style,
    },
  },
    live && React.createElement('span', { 'aria-hidden': true, style: { width: 7, height: 7, borderRadius: '50%', background: 'currentColor', animation: 'flowPulse 1.6s ease-in-out infinite' } }),
    icon && React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 14 } }, icon),
    children);
}
