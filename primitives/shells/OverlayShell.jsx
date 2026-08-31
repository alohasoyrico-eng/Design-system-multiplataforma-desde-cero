import React from 'react';

// Los keyframes de la familia viven en tokens/motion.css (foundations): el shell
// elige la alineacion, no declara el movimiento.
// Pila de capas: solo la de arriba responde a Escape (ov-4).
const stack = [];
let scrollLocks = 0;

const ALIGN = {
  center: { style: { alignItems: 'center', justifyContent: 'center', padding: 24 }, anim: 'flowOvCenter' },
  start: { style: { alignItems: 'flex-start', justifyContent: 'center', padding: '10vh 20px 20px' }, anim: 'flowOvCenter' },
  end: { style: { alignItems: 'stretch', justifyContent: 'flex-end' }, anim: 'flowOvEnd' },
  'side-start': { style: { alignItems: 'stretch', justifyContent: 'flex-start' }, anim: 'flowOvStart' },
  bottom: { style: { flexDirection: 'column', justifyContent: 'flex-end' }, anim: 'flowOvBottom' },
};

const FOCUSABLE = 'a[href],area[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),[tabindex]:not([tabindex="-1"])';
const SKIP = ['SCRIPT', 'STYLE', 'LINK', 'TEMPLATE', 'NOSCRIPT'];

/** Capa modal: backdrop, scroll lock, foco atrapado y devuelto, Escape, apilamiento. Ver contracts/overlay-shell.json. */
export function OverlayShell({
  open = false, onClose, align = 'center', dismissOnBackdrop = true,
  labelledBy, label, fixed = true, zIndex = 100, children, backdropStyle,
}) {
  const panelRef = React.useRef(null);
  const backRef = React.useRef(null);
  const restoreRef = React.useRef(null);
  const tokenRef = React.useRef({});
  // onClose suele ser una arrow inline: en un ref, para que el efecto no se reinicie en cada render del padre.
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;
  const [depth, setDepth] = React.useState(0);

  React.useEffect(() => {
    if (!open) return;
    const token = tokenRef.current;
    stack.push(token);
    setDepth(stack.length - 1);
    restoreRef.current = document.activeElement;

    // ov-1: el foco entra al panel. Sincrono, con setTimeout solo como red.
    const focusIn = () => {
      const p = panelRef.current;
      if (!p || p.contains(document.activeElement)) return;
      const first = p.querySelector(FOCUSABLE);
      if (first) first.focus();
      else { p.setAttribute('tabindex', '-1'); p.focus(); }
    };
    focusIn();
    const t = setTimeout(focusIn, 0);

    // ov-3: el fondo no hace scroll y no es alcanzable por lector de pantalla.
    // Los hermanos se ocultan en el contenedor real del backdrop: body con portal, el marco con fixed=false.
    if (fixed) {
      scrollLocks += 1;
      if (scrollLocks === 1) document.body.style.overflow = 'hidden';
    }
    let hidden = [];
    const back = backRef.current;
    const container = back && back.parentNode;
    if (container) {
      hidden = Array.prototype.filter.call(container.children, (el) =>
        el !== back && !el.contains(back) && SKIP.indexOf(el.tagName) < 0 &&
        el.getAttribute('aria-hidden') !== 'true');
      hidden.forEach((el) => el.setAttribute('aria-hidden', 'true'));
    }

    const onKey = (e) => {
      if (stack[stack.length - 1] !== token) return;
      if (e.key === 'Escape') { e.stopPropagation(); closeRef.current && closeRef.current(); return; }
      // ov-2: Tab no escapa del panel
      if (e.key !== 'Tab') return;
      const p = panelRef.current;
      if (!p) return;
      const f = Array.prototype.filter.call(p.querySelectorAll(FOCUSABLE), (el) => el.offsetParent !== null);
      if (!f.length) { e.preventDefault(); return; }
      const first = f[0], last = f[f.length - 1];
      if (!p.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    };
    document.addEventListener('keydown', onKey, true);

    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey, true);
      const i = stack.indexOf(token);
      if (i > -1) stack.splice(i, 1);
      if (fixed) {
        scrollLocks = Math.max(0, scrollLocks - 1);
        if (scrollLocks === 0) document.body.style.overflow = '';
      }
      hidden.forEach((el) => el.removeAttribute('aria-hidden'));
      const b = restoreRef.current;
      if (b && b.focus && document.contains(b)) b.focus();
    };
  }, [open, fixed]);

  if (!open) return null;
  const cfg = ALIGN[align] || ALIGN.center;
  const child = React.Children.only(children);

  const panel = React.cloneElement(child, {
    ref: panelRef,
    role: child.props.role || 'dialog',
    'aria-modal': true,
    'aria-labelledby': labelledBy || undefined,
    'aria-label': !labelledBy ? label : undefined,
    className: [child.props.className, 'flow-ov-panel'].filter(Boolean).join(' '),
    style: Object.assign({}, child.props.style, {
      animation: cfg.anim + ' var(--dur-base) var(--ease-spring)',
    }),
  });

  const back = React.createElement('div', {
    ref: backRef,
    className: 'flow-ov-back',
    onClick: dismissOnBackdrop ? (e) => { if (e.target === e.currentTarget) closeRef.current && closeRef.current(); } : undefined,
    style: Object.assign({
      position: fixed ? 'fixed' : 'absolute', inset: 0,
      zIndex: zIndex + depth * 10,
      display: 'flex',
      background: 'rgba(23,23,26,.4)', backdropFilter: 'blur(4px)',
      animation: 'flowOvFade var(--dur-base) var(--ease-out)',
    }, cfg.style, backdropStyle),
  }, panel);

  // Portal solo cuando la capa es fija: con fixed=false vive dentro de su contenedor (marco de telefono).
  const RD = typeof window !== 'undefined' ? window.ReactDOM : null;
  return fixed && RD && RD.createPortal ? RD.createPortal(back, document.body) : back;
}
