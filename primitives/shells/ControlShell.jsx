import React from 'react';

// El suelo es --hit-target-min mas los dos bordes. sm medía 38 y era el unico
// objetivo del sistema por debajo de 44, con cuatro usos en pantallas reales.
// Con el suelo puesto, sm se distingue por tipografia y padding, no por alto.
const H = { sm: 46, md: 46, lg: 54 };

/** Carcasa unica de todo control de formulario. Ver contracts/control-shell.json. */
export const ControlShell = React.forwardRef(function ControlShell({
  size = 'md', invalid = false, disabled = false, multiline = false,
  leading, trailing, footer, onShellClick, children, style, ...rest
}, ref) {
  const [focus, setFocus] = React.useState(false);
  // El grosor cambia con el estado; el padding compensa para que el contenido no se mueva (cs-1).
  const bw = invalid || focus ? 1.5 : 1;
  const comp = bw - 1;
  const color = invalid ? 'var(--status-danger)' : focus ? 'var(--border-focus)' : 'var(--border-default)';
  const row = React.createElement('div', {
    // El control se estira a toda la fila: si solo se centra, su caja mide el
    // line-height (~18px) dentro de una carcasa de 46 y el target real es ese.
    style: { display: 'flex', alignItems: 'stretch', gap: 10, flex: 1, minWidth: 0 },
  },
    leading && (typeof leading === 'string'
      ? React.createElement('span', {
          key: 'lead', className: 'flow-symbol', 'aria-hidden': true,
          // La fila estira a sus hijos para que el control ocupe todo el alto y
          // el target sea real. Un glifo estirado no se centra: se apoya arriba,
          // en su line-height, y queda mas alto que la etiqueta. Se centra solo.
          style: {
            fontSize: 20, flexShrink: 0, display: 'inline-flex', alignItems: 'center',
            color: focus ? 'var(--text-accent)' : 'var(--text-muted)',
            transition: 'color var(--dur-fast) var(--ease-out)',
          },
        }, leading)
      : leading),
    children,
    trailing && (typeof trailing === 'string'
      ? React.createElement('span', { key: 'trail', style: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0, display: 'inline-flex', alignItems: 'center' } }, trailing)
      : trailing)
  );
  return React.createElement('div', {
    ref,
    'data-control-shell': '1',
    onFocusCapture: () => setFocus(true),
    onBlurCapture: () => setFocus(false),
    // Clic en el padding de la carcasa enfoca su control: sin esto, 28 de los 46px
    // de alto no responden al dedo.
    onClick: onShellClick || ((e) => {
      if (e.target !== e.currentTarget) return;
      const f = e.currentTarget.querySelector('input, textarea, select, button');
      if (f && f.focus) f.focus();
    }),
    'data-invalid': invalid || undefined,
    'data-disabled': disabled || undefined,
    style: {
      display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
      minHeight: multiline ? undefined : H[size] || H.md,
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      border: bw + 'px solid ' + color,
      borderRadius: 'var(--radius-md)',
      padding: multiline ? (12 - comp) + 'px ' + (16 - comp) + 'px' : '0 ' + (16 - comp) + 'px',
      boxShadow: focus ? 'var(--focus-ring)' : 'none',
      opacity: disabled ? 0.6 : 1,
      transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      ...style,
    },
    ...rest,
  },
    row,
    // Zona de pie propia: el control nunca posiciona nada en absoluto sobre su propia area.
    footer && React.createElement('div', {
      style: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexShrink: 0, paddingTop: 4, minHeight: 16 },
    }, footer)
  );
});
