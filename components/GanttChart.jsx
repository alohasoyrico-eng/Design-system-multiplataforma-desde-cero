import React from 'react';

/** Gantt chart: timeline de tareas con dependencias. */
export function GanttChart({
  tasks = [], style
}) {
  // tasks: [{id, name, start, end, progress, color}]
  if (!tasks.length) return React.createElement('div', {
    style: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 6, minHeight: 120, color: 'var(--text-muted)', font: 'var(--type-caption)',
    },
  },
    React.createElement('span', { className: 'flow-icon', 'aria-hidden': true, style: { fontSize: 22 } }, 'bar_chart'),
    'Sin datos para este periodo');
  const dates = tasks.flatMap(t => [new Date(t.start), new Date(t.end)]);
  const minDate = dates.length > 0 ? new Date(Math.min(...dates)) : new Date();
  const maxDate = dates.length > 0 ? new Date(Math.max(...dates)) : new Date();
  const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) || 1;
  const msPerDay = totalDays > 0 ? 100 / totalDays : 100;

  const getPosition = (dateStr) => {
    const d = new Date(dateStr);
    const days = (d - minDate) / (1000 * 60 * 60 * 24);
    return days * msPerDay;
  };

  const getWidth = (start, end) => {
    const startDays = (new Date(start) - minDate) / (1000 * 60 * 60 * 24);
    const endDays = (new Date(end) - minDate) / (1000 * 60 * 60 * 24);
    return (endDays - startDays) * msPerDay;
  };

  return React.createElement('div', {
    style: {
      background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', padding: '16px', boxShadow: 'var(--shadow-rest)',
      ...style
    }
  },
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
      tasks.map((task) => React.createElement('div', {
        key: task.id, style: { display: 'flex', alignItems: 'center', gap: 12 }
      },
        React.createElement('div', {
          style: { width: 120, flexShrink: 0, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }
        }, task.name),
        React.createElement('div', {
          style: {
            flex: 1, position: 'relative', height: 24, background: 'var(--surface-sunken)',
            borderRadius: 'var(--radius-sm)', overflow: 'hidden'
          }
        },
          React.createElement('div', {
            style: {
              position: 'absolute', left: getPosition(task.start) + '%', width: getWidth(task.start, task.end) + '%',
              height: '100%', background: task.color || 'var(--action-accent)',
              borderRadius: 'var(--radius-sm)', opacity: task.progress ? 1 : 0.4,
              transition: 'all var(--dur-fast) var(--ease-out)',
            }
          },
            task.progress && React.createElement('div', {
              style: {
                position: 'absolute', top: 0, left: 0, height: '100%',
                width: (task.progress * 100) + '%', background: 'var(--status-success)',
                opacity: 0.6, transition: 'width var(--dur-fast) var(--ease-out)',
              }
            })
          )
        )
      ))
    )
  );
}
