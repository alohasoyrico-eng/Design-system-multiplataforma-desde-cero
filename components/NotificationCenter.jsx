import React from 'react';

const TONE = {
  info: ['info', 'var(--status-info-text)', 'var(--status-info-bg)'],
  success: ['check_circle', 'var(--status-success-text)', 'var(--status-success-bg)'],
  warning: ['warning', 'var(--status-warning-text)', 'var(--status-warning-bg)'],
  danger: ['error', 'var(--status-danger-text)', 'var(--status-danger-bg)'],
};

/** Bell trigger + dropdown panel of notifications. items: [{id,tone,title,desc,time,read}] */
export function NotificationCenter({ items = [], onItemClick, onMarkAllRead, align = 'right', style }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const unread = items.filter(i => !i.read).length;

  React.useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return React.createElement('div', { ref, style: { position: 'relative', display: 'inline-flex', ...style } },
    React.createElement('button', {
      type: 'button', 'aria-label': 'Notificaciones' + (unread ? ' (' + unread + ' sin leer)' : ''), onClick: () => setOpen(!open),
      style: {
        position: 'relative', width: 'var(--hit-target-min)', height: 'var(--hit-target-min)', borderRadius: 'var(--radius-pill)', border: 'none',
        background: 'var(--surface-sunken)', color: 'var(--text-primary)', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'transform var(--dur-fast) var(--ease-spring)',
      },
      onMouseEnter: (e) => e.currentTarget.style.transform = 'scale(1.06)',
      onMouseLeave: (e) => e.currentTarget.style.transform = 'none',
    },
      React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 20 } }, 'notifications'),
      unread > 0 && React.createElement('span', {
        'aria-hidden': true,
        style: {
          position: 'absolute', top: 5, right: 6, minWidth: 16, height: 16, borderRadius: 999, background: 'var(--flow-red-500)',
          color: 'var(--text-on-accent)', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px',
          border: '2px solid var(--surface-card)', animation: 'flowScaleIn var(--dur-fast) var(--ease-spring)',
        },
      }, unread > 9 ? '9+' : unread)),
    open && React.createElement('div', {
      role: 'dialog', 'aria-label': 'Notificaciones',
      style: {
        position: 'absolute', top: 'calc(100% + 8px)', [align === 'right' ? 'right' : 'left']: 0, zIndex: 60, width: 360,
        background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-float)', overflow: 'hidden', animation: 'flowScaleIn var(--dur-fast) var(--ease-out)',
        transformOrigin: align === 'right' ? 'top right' : 'top left',
      },
    },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', padding: '14px 16px 10px', borderBottom: '1px solid var(--border-subtle)' } },
        React.createElement('span', { style: { fontSize: 14, fontWeight: 700 } }, 'Notificaciones'),
        unread > 0 && onMarkAllRead && React.createElement('button', {
          type: 'button', onClick: onMarkAllRead,
          style: { marginLeft: 'auto', border: 'none', background: 'transparent', color: 'var(--text-accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
        }, 'Marcar todo leido')),
      React.createElement('div', { style: { maxHeight: 360, overflowY: 'auto' } },
        items.length === 0
          ? React.createElement('div', { style: { padding: '32px 16px', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' } }, 'Sin notificaciones nuevas.')
          : items.map(it => {
            const [icon, fg, bg] = TONE[it.tone] || TONE.info;
            return React.createElement('button', {
              key: it.id, type: 'button', onClick: onItemClick ? () => onItemClick(it) : undefined,
              style: {
                display: 'flex', gap: 12, width: '100%', textAlign: 'left', border: 'none', background: it.read ? 'transparent' : 'var(--surface-accent-subtle)',
                borderBottom: '1px solid var(--border-subtle)', padding: '12px 16px', cursor: onItemClick ? 'pointer' : 'default', fontFamily: 'var(--font-body)',
              },
              onMouseEnter: (e) => e.currentTarget.style.background = 'var(--surface-sunken)',
              onMouseLeave: (e) => e.currentTarget.style.background = it.read ? 'transparent' : 'var(--surface-accent-subtle)',
            },
              React.createElement('span', { 'aria-hidden': true, style: { width: 34, height: 34, borderRadius: '50%', background: bg, flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' } },
                React.createElement('span', { className: 'flow-symbol', style: { fontSize: 17, color: fg } }, icon)),
              React.createElement('span', { style: { flex: 1, minWidth: 0 } },
                React.createElement('div', { style: { fontSize: 13, fontWeight: it.read ? 500 : 700, color: 'var(--text-primary)' } }, it.title),
                it.desc && React.createElement('div', { style: { fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 } }, it.desc),
                it.time && React.createElement('div', { style: { fontSize: 11, color: 'var(--text-muted)', marginTop: 3 } }, it.time)),
              !it.read && React.createElement('span', { 'aria-hidden': true, style: { width: 8, height: 8, borderRadius: '50%', background: 'var(--flow-red-500)', flex: 'none', marginTop: 4 } }));
          }))));
}
