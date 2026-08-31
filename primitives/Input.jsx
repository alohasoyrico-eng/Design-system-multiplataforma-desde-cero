import React from 'react';
import { ControlShell } from './shells/ControlShell';

export function Input({
  id, value, onChange, placeholder, type = 'text', icon, suffix,
  revealable = false, disabled = false, invalid = false, mono = false, size = 'md', style, ...rest
}) {
  const [shown, setShown] = React.useState(false);
  // El ojo vive aqui: revelar es una prestacion del control, no un componente aparte.
  const reveal = revealable && React.createElement('button', {
    type: 'button', tabIndex: 0,
    'aria-label': shown ? 'Ocultar' : 'Mostrar',
    'aria-pressed': shown,
    onClick: () => setShown((v) => !v),
    style: {
      // base-3: 44px de target. El margen negativo evita que crezca el padding visual.
      width: 44, height: 44, margin: '0 -12px 0 0', padding: 0, flexShrink: 0,
      border: 'none', background: 'transparent', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--text-muted)',
    },
  }, React.createElement('span', { className: 'flow-icon', 'aria-hidden': true, style: { fontSize: 20 } }, shown ? 'visibility_off' : 'visibility'));

  return React.createElement(ControlShell, {
    size, invalid, disabled, leading: icon, trailing: reveal || suffix, style,
  },
    React.createElement('input', {
      id, value, placeholder, disabled,
      type: revealable ? (shown ? 'text' : 'password') : type,
      'aria-invalid': invalid || undefined,
      onChange: (e) => onChange && onChange(e.target.value),
      style: {
        flex: 1, minWidth: 0, alignSelf: 'stretch', border: 'none', outline: 'none', background: 'transparent',
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)', fontSize: 14,
        color: 'var(--text-primary)', padding: 0,
      },
      ...rest,
    })
  );
}
