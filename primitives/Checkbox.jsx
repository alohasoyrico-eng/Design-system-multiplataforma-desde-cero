import React from 'react';
import { ToggleControl } from './shells/ToggleControl';

export function Checkbox({ checked = false, onChange, label, disabled = false, indeterminate = false, style }) {
  return React.createElement(ToggleControl, {
    type: 'checkbox', checked, indeterminate, onChange, label, disabled, style,
    renderIndicator: (s) => React.createElement('span', {
      'aria-hidden': true,
      style: {
        width: 22, height: 22, borderRadius: 'var(--radius-xs)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: s.checked || s.indeterminate ? 'var(--action-accent)' : 'var(--surface-card)',
        border: s.checked || s.indeterminate ? '1.5px solid var(--action-accent)' : '1.5px solid ' + (s.hover ? 'var(--border-strong)' : 'var(--border-default)'),
        boxShadow: s.focus ? 'var(--focus-ring)' : 'none',
        transform: s.hover && !s.disabled ? 'var(--hover-scale)' : 'none',
        transition: 'all var(--dur-fast) var(--ease-spring)',
      },
    }, (s.checked || s.indeterminate) && React.createElement('span', {
      className: 'flow-symbol',
      style: { fontSize: 16, color: 'var(--text-on-inverse)', fontVariationSettings: "'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 20", animation: 'flowScaleIn var(--dur-fast) var(--ease-spring)' },
    }, s.indeterminate ? 'remove' : 'check')),
  });
}
