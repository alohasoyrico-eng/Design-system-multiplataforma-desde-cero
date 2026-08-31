import React from 'react';
import { ControlShell } from './shells/ControlShell';

export function Textarea({ id, value, onChange, placeholder, rows = 3, maxLength, disabled = false, invalid = false, style, ...rest }) {
  const count = maxLength != null && value != null;
  return React.createElement(ControlShell, {
    multiline: true, invalid, disabled, style,
    footer: count && React.createElement('span', {
      style: { fontFamily: 'var(--font-mono)', fontSize: 11, color: value.length >= maxLength ? 'var(--status-danger-text)' : 'var(--text-muted)' },
    }, value.length + '/' + maxLength),
  },
    React.createElement('textarea', {
      id, value, placeholder, rows, maxLength, disabled,
      'aria-invalid': invalid || undefined,
      onChange: (e) => onChange && onChange(e.target.value),
      style: {
        flex: 1, minWidth: 0, width: '100%', boxSizing: 'border-box', resize: 'vertical',
        border: 'none', outline: 'none', background: 'transparent', padding: 0,
        fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.55, color: 'var(--text-primary)',
      },
      ...rest,
    })
  );
}
