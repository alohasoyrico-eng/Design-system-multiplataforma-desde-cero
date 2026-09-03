import React from 'react';

// Slippy map math
function lon2x(lon, z) { return ((lon + 180) / 360) * Math.pow(2, z); }
function lat2y(lat, z) { const r = lat * Math.PI / 180; return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * Math.pow(2, z); }

/** OpenStreetMap tile map with pins and optional route polyline. Non-interactive pan; pins are buttons. */
export function MapCanvas({ center = { lat: 19.4326, lng: -99.1332 }, zoom = 14, width = '100%', height = 360,
  pins = [], selectedId, onPinClick, route = [], dark = false, style }) {
  const ref = React.useRef(null);
  const [size, setSize] = React.useState({ w: 360, h: typeof height === 'number' ? height : 360 });
  React.useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const upd = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    upd();
    const ro = new ResizeObserver(upd); ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const TILE = 256;
  const cx = lon2x(center.lng, zoom), cy = lat2y(center.lat, zoom);
  const px = (lng) => (lon2x(lng, zoom) - cx) * TILE + size.w / 2;
  const py = (lat) => (lat2y(lat, zoom) - cy) * TILE + size.h / 2;

  const x0 = Math.floor(cx - size.w / 2 / TILE), x1 = Math.floor(cx + size.w / 2 / TILE);
  const y0 = Math.floor(cy - size.h / 2 / TILE), y1 = Math.floor(cy + size.h / 2 / TILE);
  const tiles = [];
  for (let tx = x0; tx <= x1; tx++) for (let ty = y0; ty <= y1; ty++) tiles.push([tx, ty]);

  return React.createElement('div', {
    ref,
    style: { position: 'relative', width, height, overflow: 'hidden', borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)', ...style },
  },
    tiles.map(([tx, ty]) => React.createElement('img', {
      key: tx + '_' + ty, alt: '',
      src: 'https://tile.openstreetmap.org/' + zoom + '/' + tx + '/' + ty + '.png',
      style: {
        position: 'absolute', width: TILE, height: TILE, left: (tx - cx) * TILE + size.w / 2, top: (ty - cy) * TILE + size.h / 2,
        filter: dark ? 'invert(1) hue-rotate(180deg) brightness(.9) saturate(.4)' : 'saturate(.85)',
        pointerEvents: 'none', userSelect: 'none',
      },
    })),
    route.length > 1 && React.createElement('svg', {
      'aria-hidden': true,
      style: { position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' },
    },
      React.createElement('polyline', {
        points: route.map(p => px(p.lng) + ',' + py(p.lat)).join(' '),
        fill: 'none', stroke: 'var(--flow-red-500)', strokeWidth: 4.5, strokeLinecap: 'round', strokeLinejoin: 'round',
        strokeDasharray: '1 9', opacity: 0.95,
      }),
      React.createElement('circle', { cx: px(route[0].lng), cy: py(route[0].lat), r: 6, fill: 'var(--surface-inverse)', stroke: 'var(--surface-card)', strokeWidth: 2.5 })),
    pins.map(p => {
      const sel = p.id === selectedId;
      return React.createElement('button', {
        key: p.id, type: 'button', 'aria-label': p.ariaLabel || p.label, 'aria-pressed': sel,
        onClick: onPinClick ? () => onPinClick(p) : undefined,
        style: {
          position: 'absolute', left: px(p.lng), top: py(p.lat), transform: 'translate(-50%, -100%)' + (sel ? ' scale(1.12)' : ''),
          transformOrigin: 'bottom center', border: 'none', cursor: 'pointer', padding: 0, background: 'transparent',
          transition: 'transform var(--dur-fast) var(--ease-spring)', zIndex: sel ? 3 : 2,
        },
      },
        React.createElement('span', {
          style: {
            display: 'flex', alignItems: 'center', gap: 5, background: sel ? 'var(--flow-red-500)' : 'var(--surface-card)',
            color: sel ? 'var(--text-on-accent)' : 'var(--text-primary)', border: sel ? 'none' : '1px solid var(--border-default)',
            borderRadius: 999, padding: '6px 11px', fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 600,
            boxShadow: sel ? 'var(--shadow-accent-glow)' : 'var(--shadow-raised)', whiteSpace: 'nowrap',
          },
        },
          p.icon && React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 15 } }, p.icon),
          p.label),
        React.createElement('span', {
          'aria-hidden': true,
          style: {
            display: 'block', margin: '0 auto', width: 0, height: 0,
            borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
            borderTop: '7px solid ' + (sel ? 'var(--flow-red-500)' : 'var(--surface-card)'),
            filter: 'drop-shadow(0 1px 1px rgba(23,23,26,.15))',
          },
        }));
    }),
    React.createElement('span', {
      style: { position: 'absolute', right: 6, bottom: 4, fontSize: 9.5, fontFamily: 'var(--font-body)', color: 'var(--text-muted)', background: 'var(--surface-card)', borderRadius: 6, padding: '1px 6px', zIndex: 4 },
    }, '© OpenStreetMap'));
}
