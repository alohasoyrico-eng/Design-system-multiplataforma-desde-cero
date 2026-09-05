import type { CSSProperties } from 'react'
import css from './GanttChart.module.css'

export interface GanttTask {
  id: string
  name: string
  start: string
  end: string
  progress?: number
  color?: string
  /** Ids de tareas previas. Los conectores se dibujan; un ciclo se detecta
      y se declara en pantalla sin colgar el render (gnt-2). */
  dependsOn?: string[]
}

export interface GanttChartProps {
  tasks: GanttTask[]
  style?: CSSProperties
}

// gnt-2: deteccion de ciclos por DFS con colores. Devuelve el primer ciclo
// encontrado como lista de ids, o null.
function detectarCiclo(tasks: GanttTask[]): string[] | null {
  const porId = new Map(tasks.map((t) => [t.id, t]))
  const estado = new Map<string, 1 | 2>() // 1 = en pila, 2 = cerrado
  const pila: string[] = []
  const visita = (id: string): string[] | null => {
    estado.set(id, 1)
    pila.push(id)
    for (const dep of porId.get(id)?.dependsOn || []) {
      if (!porId.has(dep)) continue
      if (estado.get(dep) === 1) return pila.slice(pila.indexOf(dep)).concat(dep)
      if (!estado.has(dep)) {
        const c = visita(dep)
        if (c) return c
      }
    }
    estado.set(id, 2)
    pila.pop()
    return null
  }
  for (const t of tasks) {
    if (!estado.has(t.id)) {
      const c = visita(t.id)
      if (c) return c
    }
  }
  return null
}

export function GanttChart({ tasks, style }: GanttChartProps) {
  if (!tasks.length) {
    return (
      <div className={css.empty} style={style}>
        <span className="flow-symbol flow-symbol--lg" aria-hidden="true">bar_chart</span>
        Sin datos para este periodo
      </div>
    )
  }

  const dates = tasks.flatMap((t) => [new Date(t.start).getTime(), new Date(t.end).getTime()])
  const minDate = Math.min(...dates)
  const maxDate = Math.max(...dates)
  const totalMs = maxDate - minDate || 1

  const fechaCorta = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es', { day: 'numeric', month: 'short' })

  const getLeft = (dateStr: string) => ((new Date(dateStr).getTime() - minDate) / totalMs) * 100
  const getWidth = (start: string, end: string) => ((new Date(end).getTime() - new Date(start).getTime()) / totalMs) * 100

  const ciclo = detectarCiclo(tasks)
  const enCiclo = new Set(ciclo || [])
  const fila = new Map(tasks.map((t, i) => [t.id, i]))
  const nombreDe = (id: string) => tasks[fila.get(id)!]?.name || id

  // Conectores: del fin de la tarea previa al inicio de la dependiente.
  // Coordenadas en % del area de pistas (las filas son uniformes).
  const conectores: { x1: number; y1: number; x2: number; y2: number; key: string }[] = []
  for (const t of tasks) {
    for (const dep of t.dependsOn || []) {
      if (!fila.has(dep)) continue
      if (enCiclo.has(t.id) && enCiclo.has(dep)) continue // el ciclo se declara, no se dibuja
      conectores.push({
        key: `${dep}->${t.id}`,
        x1: getLeft(tasks[fila.get(dep)!].end),
        y1: ((fila.get(dep)! + 0.5) / tasks.length) * 100,
        x2: getLeft(t.start),
        y2: ((fila.get(t.id)! + 0.5) / tasks.length) * 100,
      })
    }
  }

  return (
    <div className={css.root} style={style}>
      {ciclo && (
        <div className={css.cycleNote} role="alert">
          Dependencia circular detectada: {ciclo.map(nombreDe).join(' → ')}. Los conectores de ese ciclo no se dibujan.
        </div>
      )}
      <div className={css.rows}>
        {conectores.length > 0 && (
          <svg
            className={css.connectors}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {conectores.map((c) => {
              const xm = (c.x1 + c.x2) / 2
              return (
                <polyline
                  key={c.key}
                  points={`${c.x1},${c.y1} ${xm},${c.y1} ${xm},${c.y2} ${c.x2},${c.y2}`}
                  fill="none"
                  stroke="var(--viz-axis)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  vectorEffect="non-scaling-stroke"
                />
              )
            })}
          </svg>
        )}
        {tasks.map((task) => {
          const width = getWidth(task.start, task.end)
          return (
            <div key={task.id} className={css.row}>
              {/* gnt-4: una tarea sin name lleva marcador visible, no una barra muda. */}
              <div className={css.taskName} data-placeholder={!task.name || undefined}>
                {task.name || '(sin nombre)'}
                {/* gnt-1: las fechas se dicen en texto — la geometría no se puede verificar sola. */}
                <span className={css.taskDates}>
                  {fechaCorta(task.start)} – {fechaCorta(task.end)}
                </span>
              </div>
              <div className={css.track}>
                {width <= 0 ? (
                  /* gnt-3: duracion cero es un hito, no una barra invisible. */
                  <div
                    className={css.milestone}
                    data-milestone=""
                    style={{ left: `${getLeft(task.start)}%`, background: task.color || 'var(--viz-1)' }}
                  />
                ) : (
                  <div
                    className={css.bar}
                    style={{
                      left: `${getLeft(task.start)}%`,
                      width: `${width}%`,
                      background: task.color || 'var(--viz-1)',
                      opacity: task.progress != null ? 1 : 0.4,
                    }}
                  >
                    {task.progress != null && (
                      <div className={css.progress} style={{ width: `${task.progress * 100}%` }} />
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
