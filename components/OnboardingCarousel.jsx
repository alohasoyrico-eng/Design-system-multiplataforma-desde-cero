import React from 'react';

const PALETTE = [1, 2, 3, 4, 5, 6].map((i) => 'var(--illustration-' + i + ')');

function DefaultIllustration({ icon, index }) {
  const color = PALETTE[index % PALETTE.length];
  return React.createElement('div', {
    style: { width: 168, height: 168, borderRadius: '50%', background: color + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  },
    React.createElement('div', {
      style: { width: 108, height: 108, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 28px ' + color + '40' },
    }, React.createElement('span', { className: 'flow-icon flow-icon--fill', 'aria-hidden': true, style: { fontSize: 52, color: 'var(--text-on-accent)' } }, icon || 'auto_awesome')));
}

/** Onboarding slides with illustration, dot pagination, and swipe. slides: [{icon?, illustration?(node), title, description}] */
export function OnboardingCarousel({ slides = [], index = 0, onIndexChange, onSkip, onDone, skipLabel = 'Omitir', doneLabel = 'Empezar', style }) {
  const touch = React.useRef(null);
  const go = (i) => onIndexChange && onIndexChange(Math.max(0, Math.min(slides.length - 1, i)));
  const last = index === slides.length - 1;
  const slide = slides[index] || {};

  return React.createElement('div', {
    style: { display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--font-body)', ...style },
    onTouchStart: (e) => { touch.current = e.touches[0].clientX; },
    onTouchEnd: (e) => {
      if (touch.current == null) return;
      const dx = e.changedTouches[0].clientX - touch.current;
      if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
      touch.current = null;
    },
  },
    onSkip && !last && React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end', padding: '4px 4px 0' } },
      React.createElement('button', {
        type: 'button', onClick: onSkip,
        style: { border: 'none', background: 'transparent', color: 'var(--text-muted)', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', padding: 8 },
      }, skipLabel)),
    React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 24, padding: '8px 28px' } },
      slide.illustration || React.createElement(DefaultIllustration, { icon: slide.icon, index }),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
        React.createElement('div', { style: { font: 'var(--type-title-sm)', color: 'var(--text-primary)' } }, slide.title),
        slide.description && React.createElement('div', { style: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.55, maxWidth: 300 } }, slide.description))),
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 18, padding: '0 24px 8px', alignItems: 'center' } },
      React.createElement('div', { style: { display: 'flex', gap: 6 } },
        slides.map((_, i) => React.createElement('button', {
          key: i, type: 'button', 'aria-label': 'Ir a diapositiva ' + (i + 1), onClick: () => go(i),
          style: {
            width: i === index ? 20 : 6, height: 6, borderRadius: 999, border: 'none', padding: 0, cursor: 'pointer',
            background: i === index ? 'var(--action-accent)' : 'var(--border-default)',
            transition: 'width var(--dur-base) var(--ease-spring), background var(--dur-fast) var(--ease-out)',
          },
        }))),
      React.createElement('button', {
        type: 'button', onClick: () => (last ? onDone && onDone() : go(index + 1)),
        style: { width: '100%', minHeight: 52, border: 'none', borderRadius: 999, background: 'var(--action-primary)', color: 'var(--text-on-inverse)', fontFamily: 'inherit', fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'transform var(--dur-fast) var(--ease-spring)' },
        onMouseEnter: (e) => e.currentTarget.style.transform = 'scale(1.02)',
        onMouseLeave: (e) => e.currentTarget.style.transform = 'none',
      }, last ? doneLabel : 'Continuar')));
}
