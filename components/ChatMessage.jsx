import React from 'react';

/** One message bubble. role: 'user' | 'agent'. tool: optional {label, icon, status:'running'|'done'} chip shown above agent text. */
export function ChatMessage({ role = 'agent', text, tool, streaming = false, children, timestamp, style }) {
  const isUser = role === 'user';
  return React.createElement('div', {
    style: { display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', gap: 6, ...style },
  },
    tool && React.createElement('div', {
      style: {
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px 7px 10px', borderRadius: 999,
        background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)',
      },
    },
      tool.status === 'running'
        ? React.createElement('span', { 'aria-hidden': true, style: { width: 13, height: 13, border: '2px solid var(--border-strong)', borderTopColor: 'var(--action-accent)', borderRadius: '50%', animation: 'flowSpin 0.8s linear infinite' } })
        : React.createElement('span', { className: 'flow-icon', 'aria-hidden': true, style: { fontSize: 15, color: 'var(--status-success-text)' } }, 'check_circle'),
      React.createElement('span', { className: 'flow-icon', 'aria-hidden': true, style: { fontSize: 15 } }, tool.icon || 'bolt'),
      tool.label),
    React.createElement('div', {
      style: {
        maxWidth: '82%', padding: children ? '14px 16px' : '11px 16px', borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser ? 'var(--surface-inverse)' : 'var(--surface-card)',
        color: isUser ? 'var(--text-on-inverse)' : 'var(--text-primary)',
        border: isUser ? 'none' : '1px solid var(--border-subtle)',
        fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.55, boxShadow: isUser ? 'none' : 'var(--shadow-rest)',
        animation: 'flowIn var(--dur-fast) var(--ease-out)',
      },
    },
      text && React.createElement('span', null, text),
      streaming && React.createElement('span', {
        'aria-label': 'Escribiendo', role: 'status',
        style: { display: 'inline-flex', gap: 3, marginLeft: text ? 6 : 0, verticalAlign: 'middle' },
      }, [0, 1, 2].map(i => React.createElement('span', {
        key: i, 'aria-hidden': true,
        style: { width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', animation: 'flowDotPulse 1.1s ' + (i * 0.15) + 's ease-in-out infinite' },
      }))),
      children),
    timestamp && React.createElement('span', { style: { fontSize: 10.5, color: 'var(--text-muted)', padding: '0 4px' } }, timestamp));
}
