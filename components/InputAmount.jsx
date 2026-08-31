import React from 'react';
import { ControlShell } from '../primitives/shells/ControlShell';

/** Control de monto: prefijo de moneda, miles y decimales de la locale, alineado a la derecha.
 *  No trae label: eso es Field. Ver contracts/input-amount.json. */
export function InputAmount({
  id, value = '', onChange, placeholder = '0.00', currency = '$', locale = 'es-MX',
  size = 'md', disabled = false, invalid = false, style, ...rest
}) {
  // La locale decide los separadores. es-MX usa punto decimal y coma de miles:
  // asumir el patron de es-ES rompia todo monto escrito en Mexico.
  const parts = React.useMemo(() => {
    const s = (1234.5).toLocaleString(locale, { minimumFractionDigits: 2 });
    return { group: s.replace(/[\d]/g, '').charAt(0), decimal: s.replace(/[\d]/g, '').slice(-1) };
  }, [locale]);

  const toNumber = (raw) => {
    const cleaned = String(raw)
      .split(parts.group).join('')
      .split(parts.decimal).join('.')
      .replace(/[^\d.]/g, '');
    const n = parseFloat(cleaned);
    return isNaN(n) ? null : n;
  };

  // Mientras el campo tiene foco se muestra lo que la persona escribe: reformatear en
  // cada tecla mueve el caret detras de los decimales y la siguiente tecla cae ahi.
  const [draft, setDraft] = React.useState(null);
  const formatted = React.useMemo(() => {
    if (value === '' || value == null) return '';
    const n = typeof value === 'number' ? value : toNumber(value);
    if (n == null) return '';
    return n.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [value, locale]);
  const display = draft != null ? draft : formatted;

  return React.createElement(ControlShell, {
    size, invalid, disabled, style,
    leading: React.createElement('span', {
      style: { fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', flexShrink: 0 },
    }, currency),
  },
    React.createElement('input', {
      id, type: 'text', inputMode: 'decimal', disabled, placeholder,
      'aria-invalid': invalid || undefined,
      value: display,
      onChange: (e) => {
        setDraft(e.target.value);
        if (!onChange) return;
        const n = toNumber(e.target.value);
        onChange(n == null ? '' : n);
      },
      onBlur: (e) => {
        setDraft(null);
        if (rest.onBlur) rest.onBlur(e);
      },
      style: {
        flex: 1, minWidth: 0, alignSelf: 'stretch', border: 'none', outline: 'none', background: 'transparent', padding: 0,
        fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-primary)', textAlign: 'right',
      },
      ...rest,
    })
  );
}
