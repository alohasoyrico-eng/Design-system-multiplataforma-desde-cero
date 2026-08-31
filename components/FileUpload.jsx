import React from 'react';

/** Controlled file dropzone. files: [{name, size?}] */
export function FileUpload({ files = [], onChange, label = 'Arrastra archivos o haz clic', hint, accept, multiple = true, disabled = false, style }) {
  const [drag, setDrag] = React.useState(false);
  const inputRef = React.useRef(null);
  const add = (list) => {
    const arr = Array.from(list).map(f => ({ name: f.name, size: f.size }));
    onChange && onChange(multiple ? [...files, ...arr] : arr.slice(0, 1));
  };
  const fmt = (b) => b == null ? '' : b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'var(--font-body)', ...style } },
    React.createElement('div', {
      role: 'button', tabIndex: disabled ? -1 : 0, 'aria-label': label,
      onClick: () => !disabled && inputRef.current && inputRef.current.click(),
      onKeyDown: (e) => { if (e.key === 'Enter' && !disabled) inputRef.current.click(); },
      onDragOver: (e) => { e.preventDefault(); if (!disabled) setDrag(true); },
      onDragLeave: () => setDrag(false),
      onDrop: (e) => { e.preventDefault(); setDrag(false); if (!disabled) add(e.dataTransfer.files); },
      style: {
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: '28px 20px', borderRadius: 'var(--radius-lg)', cursor: disabled ? 'not-allowed' : 'pointer',
        border: '1.5px dashed ' + (drag ? 'var(--border-focus)' : 'var(--border-default)'),
        background: drag ? 'var(--surface-accent-subtle)' : 'var(--surface-sunken)',
        opacity: disabled ? 0.5 : 1, outline: 'none', textAlign: 'center',
        transform: drag ? 'scale(1.01)' : 'none',
        transition: 'all var(--dur-fast) var(--ease-spring)',
      },
    },
      React.createElement('span', { className: 'flow-icon', 'aria-hidden': true, style: { fontSize: 30, color: drag ? 'var(--text-accent)' : 'var(--text-muted)', transition: 'color var(--dur-fast) var(--ease-out)' } }, 'upload_file'),
      React.createElement('span', { style: { fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' } }, label),
      hint && React.createElement('span', { style: { fontSize: 12, color: 'var(--text-muted)' } }, hint),
      React.createElement('input', { ref: inputRef, type: 'file', accept, multiple, disabled, onChange: (e) => add(e.target.files), style: { display: 'none' } })),
    files.length > 0 && React.createElement('ul', { style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 } },
      files.map((f, i) => React.createElement('li', {
        key: f.name + i,
        style: { display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 14px', animation: 'flowIn var(--dur-fast) var(--ease-out)' },
      },
        React.createElement('span', { className: 'flow-icon', 'aria-hidden': true, style: { fontSize: 20, color: 'var(--text-muted)' } }, 'draft'),
        React.createElement('span', { style: { flex: 1, fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, f.name),
        React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' } }, fmt(f.size)),
        React.createElement('button', {
          type: 'button', 'aria-label': 'Quitar ' + f.name,
          onClick: () => onChange && onChange(files.filter((_, j) => j !== i)),
          style: { border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'inline-flex', padding: 4, borderRadius: '50%' },
        }, React.createElement('span', { className: 'flow-icon', 'aria-hidden': true, style: { fontSize: 18 } }, 'close'))))));
}
