import React from 'react';

/** Biometric auth sheet: face or fingerprint, with scanning/success/error states. */
export function BiometricPrompt({ method = 'face', state = 'idle', title, description, onUse, onFallback, fallbackLabel = 'Usar passcode', style }) {
  const icon = method === 'face' ? 'ar_on_you' : 'fingerprint';
  const stateColor = { idle: 'var(--text-primary)', scanning: 'var(--text-accent)', success: 'var(--status-success-text)', error: 'var(--status-danger-text)' }[state];
  const stateIcon = state === 'success' ? 'check_circle' : state === 'error' ? 'error' : icon;
  return React.createElement('div', {
    style: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center',
      background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)', padding: '32px 28px 24px',
      boxShadow: 'var(--shadow-overlay)', fontFamily: 'var(--font-body)', maxWidth: 320,
      animation: state === 'error' ? 'flowShake 320ms var(--ease-out)' : 'none', ...style,
    },
  },
    React.createElement('span', {
      style: {
        width: 84, height: 84, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: state === 'success' ? 'var(--status-success-bg)' : state === 'error' ? 'var(--status-danger-bg)' : 'var(--surface-sunken)',
        position: 'relative',
      },
    },
      state === 'scanning' && React.createElement('span', {
        'aria-hidden': true,
        style: { position: 'absolute', inset: -4, borderRadius: '50%', border: '2.5px solid var(--action-accent)', borderTopColor: 'transparent', animation: 'flowSpin 1s linear infinite' },
      }),
      React.createElement('span', {
        className: 'flow-symbol' + (state === 'success' ? ' flow-symbol--fill' : ''), 'aria-hidden': true,
        style: { fontSize: 44, color: stateColor, animation: state === 'success' ? 'flowScaleIn var(--dur-base) var(--ease-spring)' : 'none', transition: 'color var(--dur-fast) var(--ease-out)' },
      }, stateIcon)),
    React.createElement('div', { style: { fontSize: 16, fontWeight: 700, marginTop: 6 } }, title || (method === 'face' ? 'Face ID' : 'Huella digital')),
    React.createElement('div', { role: 'status', style: { fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55 } },
      description || { idle: 'Confirma tu identidad para continuar.', scanning: 'Verificando…', success: 'Identidad confirmada.', error: 'No pudimos verificarte. Intenta de nuevo.' }[state]),
    onUse && state !== 'success' && React.createElement('button', {
      type: 'button', onClick: onUse,
      style: { marginTop: 10, minHeight: 44, padding: '0 24px', border: 'none', borderRadius: 999, background: 'var(--action-primary)', color: 'var(--text-on-inverse)', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'transform var(--dur-fast) var(--ease-spring)' },
      onMouseEnter: (e) => e.currentTarget.style.transform = 'scale(1.04)',
      onMouseLeave: (e) => e.currentTarget.style.transform = 'none',
    }, state === 'error' ? 'Reintentar' : 'Verificar'),
    onFallback && React.createElement('button', {
      type: 'button', onClick: onFallback,
      style: { border: 'none', background: 'transparent', color: 'var(--text-accent)', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', padding: '10px 12px', borderRadius: 10 },
    }, fallbackLabel));
}
