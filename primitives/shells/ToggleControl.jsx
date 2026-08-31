import React from 'react';

/** Mecanica compartida de Checkbox, Radio y Switch. Ver contracts/toggle-control.json. */
let uid = 0;

export function ToggleControl({
  type, checked = false, indeterminate = false, onChange, label, description,
  disabled = false, name, value, renderIndicator, style, ...rest
}) {
  // La descripcion tiene que llegar al control, no solo verse debajo (rdo-2).
  const auto = React.useId ? React.useId() : 'flow-tg-' + (++uid);
  const descId = description ? auto + '-desc' : undefined;
  const [focus, setFocus] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const state = { checked, indeterminate, focus, hover, press, disabled };

  return React.createElement('label', {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => { setHover(false); setPress(false); },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: 'inline-flex', alignItems: description ? 'flex-start' : 'center', gap: 10,
      // tg-1: el target incluye el label y no baja de 44px
      minHeight: 44, boxSizing: 'border-box',
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style,
    },
  },
    React.createElement('span', {
      style: { position: 'relative', display: 'inline-flex', flex: 'none', marginTop: description ? 2 : 0 },
    },
      // tg-2: control nativo real detras
      React.createElement('input', {
        type: type === 'radio' ? 'radio' : 'checkbox',
        role: type === 'switch' ? 'switch' : undefined,
        name, value, checked, disabled,
        'aria-describedby': descId,
        // tg-4: indeterminate va a la propiedad del DOM, no solo al dibujo
        ref: (el) => { if (el && type === 'checkbox') el.indeterminate = indeterminate; },
        onChange: (e) => {
          if (!onChange) return;
          onChange(type === 'radio' ? value : e.target.checked);
        },
        onFocus: () => setFocus(true),
        onBlur: () => setFocus(false),
        style: { position: 'absolute', opacity: 0, width: '100%', height: '100%', margin: 0, cursor: 'inherit' },
        ...rest,
      }),
      renderIndicator(state)
    ),
    (label || description) && React.createElement('span', { style: { display: 'flex', flexDirection: 'column', gap: 2 } },
      label && React.createElement('span', {
        style: { fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: description ? 600 : 400, color: 'var(--text-primary)' },
      }, label),
      description && React.createElement('span', {
        id: descId,
        style: { fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)' },
      }, description))
  );
}
