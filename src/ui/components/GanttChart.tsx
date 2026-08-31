import type { CSSProperties } from 'react'
import css from './GanttChart.module.css'

export interface GanttTask {
  id: string
  name: string
  start: string
  end: string
  progress?: number
  color?: string
}

export interface GanttChartProps {
  tasks: GanttTask[]
  style?: CSSProperties
}

export function GanttChart({ tasks, style }: GanttChartProps) {
  if (!tasks.length) {
    return (
      <div className={css.empty} style={style}>
        <span className="flow-icon flow-icon--lg" aria-hidden="true">bar_chart</span>
        Sin datos para este periodo
      </div>
    )
  }

  const dates = tasks.flatMap((t) => [new Date(t.start).getTime(), new Date(t.end).getTime()])
  const minDate = Math.min(...dates)
  const maxDate = Math.max(...dates)
  const totalMs = maxDate - minDate || 1

  const getLeft = (dateStr: string) => ((new Date(dateStr).getTime() - minDate) / totalMs) * 100
  const getWidth = (start: string, end: string) => ((new Date(end).getTime() - new Date(start).getTime()) / totalMs) * 100

  return (
    <div className={css.root} style={style}>
      <div className={css.rows}>
        {tasks.map((task) => (
          <div key={task.id} className={css.row}>
            <div className={css.taskName}>{task.name}</div>
            <div className={css.track}>
              <div
                className={css.bar}
                style={{
                  left: `${getLeft(task.start)}%`,
                  width: `${getWidth(task.start, task.end)}%`,
                  background: task.color || 'var(--viz-1)',
                  opacity: task.progress != null ? 1 : 0.4,
                }}
              >
                {task.progress != null && (
                  <div className={css.progress} style={{ width: `${task.progress * 100}%` }} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
