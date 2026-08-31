import React from 'react';
import { ControlShell } from '../primitives/shells/ControlShell';

/** Control telefonico: lada como prefijo fijo y agrupacion 3-3-4 sobre los digitos.
 *  No trae label: eso es Field. El pais se elige con Select, no aqui. */
export function InputPhone({
  id, value = '', onChange, placeholder = '55 1234 5678', prefix = '+52',
  size = 'md', disabled = false, invalid = false, style, ...rest
}) {
  const mask = (digits) => {
    const d = String(digits).replace(/\D/g, '').slice(0, 10);
    if (d.length <= 2) return d;
    if (d.length <= 6) return d.slice(0, 2) + ' ' + d.slice(2);
    return d.slice(0, 2) + ' ' + d.slice(2, 6) + ' ' + d.slice(6);
  };

  return React.createElement(ControlShell, {
    size, invalid, disabled, style,
    leading: React.createElement('span', {
      style: { fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-muted)', flexShrink: 0 },
    }, prefix),
  },
    React.createElement('input', {
      id, type: 'tel', inputMode: 'tel', disabled, placeholder,
      'aria-invalid': invalid || undefined,
      value: mask(value),
      onChange: (e) => onChange && onChange(String(e.target.value).replace(/\D/g, '').slice(0, 10)),
      style: {
        flex: 1, minWidth: 0, alignSelf: 'stretch', border: 'none', outline: 'none', background: 'transparent', padding: 0,
        fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-primary)',
      },
      ...rest,
    })
  );
}
