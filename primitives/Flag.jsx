import React from 'react';

/**
 * Flag — bandera de pais desde flag-icons (SVG, no emoji).
 *
 * Usa la variante cuadrada (1:1) para que la mascara circular recorte parejo.
 * El anillo interior evita que las banderas con blanco al borde (JP, PL) se
 * desvanezcan sobre --surface-card.
 */

const FLAG_CSS = 'https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/css/flag-icons.min.css';

/** Inyecta la hoja de flag-icons una sola vez por documento. */
export function ensureFlagCss(href = FLAG_CSS) {
  if (typeof document === 'undefined') return;
  if (document.querySelector('link[data-flow-flags]')) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = href;
  l.setAttribute('data-flow-flags', '');
  document.head.appendChild(l);
}

const RADIUS = {
  circle: '50%',
  rounded: 'var(--radius-xs)',
  square: '0',
};

export function Flag({
  country,
  size = 20,
  shape = 'circle',
  label,
  ring = true,
  style,
}) {
  React.useEffect(() => { ensureFlagCss(); }, []);

  const cc = String(country || '').toLowerCase();

  return React.createElement('span', {
    className: 'fi fi-' + cc + ' fis',
    role: label ? 'img' : undefined,
    'aria-label': label || undefined,
    'aria-hidden': label ? undefined : true,
    style: {
      width: size, height: size, flex: 'none', display: 'inline-block',
      borderRadius: RADIUS[shape] || RADIUS.circle,
      backgroundSize: 'cover', backgroundPosition: 'center',
      boxShadow: ring ? 'inset 0 0 0 1px rgba(23,23,26,.12)' : 'none',
      ...style,
    },
  });
}
