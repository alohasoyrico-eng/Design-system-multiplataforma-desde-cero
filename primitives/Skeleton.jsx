import React from 'react';

export function Skeleton({ variant = 'text', width, height, style }) {
  const dims = {
    text: { width: width || '100%', height: height || 14, borderRadius: 6 },
    title: { width: width || '60%', height: height || 22, borderRadius: 8 },
    circle: { width: width || 36, height: height || width || 36, borderRadius: '50%' },
    card: { width: width || '100%', height: height || 96, borderRadius: 'var(--radius-lg)' },
    pill: { width: width || 96, height: height || 36, borderRadius: 999 },
  }[variant];
  return React.createElement('span', {
    'aria-hidden': true,
    style: {
      display: 'block',
      background: 'linear-gradient(90deg, var(--surface-sunken) 25%, var(--border-subtle) 50%, var(--surface-sunken) 75%)',
      backgroundSize: '200% 100%', animation: 'flowShimmer 1.4s ease infinite',
      ...dims, ...style,
    },
  });
}
