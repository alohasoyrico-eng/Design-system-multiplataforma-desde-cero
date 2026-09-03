import React from 'react';

export function Pagination({ page = 1, pages = 1, onChange, style }) {
  const go = (p) => { if (p >= 1 && p <= pages && p !== page) onChange && onChange(p); };
  const nums = [];
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - page) <= 1) nums.push(p);
    else if (nums[nums.length - 1] !== '…') nums.push('…');
  }
  const btn = (content, opts) => React.createElement('button', {
    type: 'button', disabled: opts.disabled,
    'aria-label': opts.aria, 'aria-current': opts.current ? 'page' : undefined,
    onClick: opts.onClick,
    onMouseEnter: (e) => { if (!opts.disabled && !opts.current) e.currentTarget.style.background = 'var(--surface-sunken)'; },
    onMouseLeave: (e) => { if (!opts.current) e.currentTarget.style.background = 'transparent'; },
    style: {
      minWidth: 'var(--hit-target-min)', height: 'var(--hit-target-min)', padding: '0 8px', border: 'none', borderRadius: 'var(--radius-pill)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: opts.current ? 700 : 500,
      background: opts.current ? 'var(--surface-inverse)' : 'transparent',
      color: opts.current ? 'var(--text-on-inverse)' : opts.disabled ? 'var(--flow-ink-300)' : 'var(--text-secondary)',
      cursor: opts.disabled || opts.current ? 'default' : 'pointer',
      transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-spring)',
    },
  }, content);
  return React.createElement('nav', { 'aria-label': 'Paginación', style: { display: 'flex', alignItems: 'center', gap: 4, ...style } },
    btn(React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 18 } }, 'chevron_left'), { aria: 'Página anterior', disabled: page <= 1, onClick: () => go(page - 1) }),
    nums.map((n, i) => n === '…'
      ? React.createElement('span', { key: 'e' + i, style: { padding: '0 4px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13 } }, '…')
      : btn(n, { key: n, aria: 'Página ' + n, current: n === page, onClick: () => go(n) })),
    btn(React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 18 } }, 'chevron_right'), { aria: 'Página siguiente', disabled: page >= pages, onClick: () => go(page + 1) }));
}
