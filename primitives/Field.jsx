import React from 'react';

let uid = 0;

/** Etiqueta, control, ayuda y error. Ver contracts/field.json.
 *  Asocia por su cuenta: si el consumidor no pasa htmlFor, Field genera el id,
 *  lo inyecta en su hijo y referencia el mensaje. Antes, un Field sin htmlFor
 *  dejaba la etiqueta huerfana en silencio, y cuatro de seis campos de la card
 *  de formularios estaban asi.
 */
export function Field({ label, htmlFor, required = false, help, error, children, style }) {
  const auto = React.useId ? React.useId() : 'flow-fld-' + (++uid);
  const hijo = React.isValidElement(children) ? children : null;
  const id = htmlFor || (hijo && hijo.props.id) || (hijo ? auto : undefined);
  const msgId = (error || help) ? auto + '-msg' : undefined;

  const control = hijo
    ? React.cloneElement(hijo, {
        id,
        // Nombres DOM estandar: los controles los reenvian con ...rest a su
        // elemento de campo. Un nombre inventado obligaria a mapearlo en cada uno.
        'aria-describedby': [hijo.props['aria-describedby'], msgId].filter(Boolean).join(' ') || undefined,
        invalid: hijo.props.invalid || !!error || undefined,
        required: hijo.props.required || required || undefined,
      })
    : children;

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, ...style } },
    label && React.createElement('label', {
      htmlFor: id,
      style: { font: 'var(--type-body)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' },
    }, label,
      // El asterisco esta oculto al lector: el control ya dice que es requerido.
      required && React.createElement('span', { 'aria-hidden': true, style: { color: 'var(--text-accent)' } }, ' *')),
    control,
    (error || help) && React.createElement('div', {
      id: msgId,
      role: error ? 'alert' : undefined,
      style: {
        font: 'var(--type-caption)',
        color: error ? 'var(--status-danger-text)' : 'var(--text-muted)',
        display: 'flex', alignItems: 'center', gap: 4,
      },
    },
      error && React.createElement('span', { className: 'flow-icon', style: { fontSize: 14 }, 'aria-hidden': true }, 'error'),
      error || help)
  );
}
