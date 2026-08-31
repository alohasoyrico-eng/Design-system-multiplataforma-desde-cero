import React from 'react';

const SIZES = { sm: 28, md: 36, lg: 48, xl: 64 };
const PRESENCIA = {
  online: { color: 'var(--status-success)', texto: 'En linea' },
  busy: { color: 'var(--status-live)', texto: 'Ocupado' },
  offline: { color: 'var(--avatar-offline)', texto: 'Desconectado' },
};

/** Iniciales o foto, con color determinista por nombre. Ver contracts/avatar.json. */
export function Avatar({ name = '', src, size = 'md', status, style }) {
  const [falla, setFalla] = React.useState(false);
  const d = SIZES[size] || SIZES.md;
  const iniciales = name.split(' ').map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  // Determinista: la misma persona lleva el mismo color en toda la aplicacion y
  // entre sesiones. El color sale de un token, no de un hex del componente.
  // FNV-1a con avalancha final, porque determinismo no basta: el objetivo es
  // distinguir personas. Con h*31+c y modulo 6, cuatro nombres cortos en espanol
  // caian en dos colores y la fila se veia como tres circulos rojos iguales.
  let hash = 2166136261;
  for (let i = 0; i < name.length; i++) { hash ^= name.charCodeAt(i); hash = Math.imul(hash, 16777619); }
  hash ^= hash >>> 15; hash = Math.imul(hash, 2246822507); hash ^= hash >>> 13;
  const bg = 'var(--avatar-' + ((hash >>> 0) % 6 + 1) + ')';
  const p = PRESENCIA[status];

  return React.createElement('span', { style: { position: 'relative', display: 'inline-flex', flex: 'none', ...style } },
    src && !falla
      ? React.createElement('img', {
          src, alt: name, onError: () => setFalla(true),
          style: { width: d, height: d, borderRadius: 'var(--radius-pill)', objectFit: 'cover' },
        })
      : React.createElement('span', {
          role: 'img', 'aria-label': name || 'Sin nombre',
          style: {
            width: d, height: d, borderRadius: 'var(--radius-pill)', background: bg,
            color: 'var(--text-on-accent)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-body)', fontSize: d * 0.36, fontWeight: 700, letterSpacing: '0.02em',
          },
        }, iniciales || '?'),
    p && React.createElement('span', {
      // La presencia no se comunica solo por color: el punto se anuncia (avt-3).
      role: 'img', 'aria-label': p.texto,
      style: {
        position: 'absolute', right: -1, bottom: -1,
        width: Math.max(9, d * 0.26), height: Math.max(9, d * 0.26),
        borderRadius: 'var(--radius-pill)', background: p.color,
        // El punto se separa del avatar por el anillo, no por contraste de matiz:
        // un punto rojo de "ocupado" sobre un avatar rojo da 1.27:1 y lo unico
        // que lo distingue es este borde. Por eso crece con el tamano.
        border: Math.max(2, Math.round(d * 0.06)) + 'px solid var(--surface-card)',
        boxSizing: 'content-box',
        animation: status === 'busy' ? 'flowPulse 1.6s ease-in-out infinite' : 'none',
      },
    }));
}
