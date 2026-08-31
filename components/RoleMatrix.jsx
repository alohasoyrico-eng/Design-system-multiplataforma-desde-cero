import React from 'react';
import { DataGrid } from '../primitives/shells/DataGrid';

/** Matriz permisos x roles. permissions: [{id,label,group?}] · roles: [{id,label,locked?}] · values: {permId:{roleId:bool}} */
export function RoleMatrix({ roles = [], permissions = [], values = {}, onChange, style }) {
  const toggle = (pid, rid) => {
    if (!onChange) return;
    const next = {};
    Object.keys(values).forEach((k) => { next[k] = { ...values[k] }; });
    next[pid] = next[pid] || {};
    next[pid][rid] = !next[pid][rid];
    onChange(next, pid, rid);
  };

  const columns = [{
    key: '__perm', label: 'Permiso', width: 200,
    render: (p) => React.createElement('span', { style: { color: 'var(--text-secondary)', whiteSpace: 'normal' } }, p.label),
  }].concat(roles.map((r) => ({
    key: r.id, align: 'center',
    label: React.createElement(React.Fragment, null,
      r.label,
      r.locked && React.createElement('span', {
        className: 'flow-icon', 'aria-hidden': true,
        style: { fontSize: 13, verticalAlign: -2, marginLeft: 4 },
      }, 'lock')),
    render: (p) => {
      const on = !!(values[p.id] && values[p.id][r.id]);
      return React.createElement('button', {
        type: 'button', disabled: r.locked,
        'aria-label': p.label + ' — ' + r.label + (on ? ': permitido' : ': no permitido'),
        'aria-pressed': on,
        onClick: () => toggle(p.id, r.id),
        style: {
          width: 'var(--hit-target-min)', height: 'var(--hit-target-min)', borderRadius: 'var(--radius-xs)', cursor: r.locked ? 'not-allowed' : 'pointer',
          border: on ? 'none' : '1.5px solid var(--border-default)',
          background: on ? 'var(--action-accent)' : 'var(--surface-card)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          opacity: r.locked ? 0.55 : 1,
          transition: 'all var(--dur-fast) var(--ease-spring)',
        },
      }, on ? React.createElement('span', {
        className: 'flow-icon', 'aria-hidden': true,
        style: { fontSize: 16, color: 'var(--text-on-inverse)', animation: 'flowScaleIn var(--dur-fast) var(--ease-spring)' },
      }, 'check') : null);
    },
  })));

  const rows = [];
  const seen = [];
  permissions.forEach((p) => {
    const g = p.group || '';
    if (g && seen.indexOf(g) < 0) { seen.push(g); rows.push({ __group: g }); }
    rows.push(p);
  });

  return React.createElement(DataGrid, {
    columns, rows, rowKey: 'id', density: 'dense', style: { overflow: 'auto', ...style },
  });
}
