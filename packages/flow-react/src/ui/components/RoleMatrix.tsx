import type { CSSProperties } from 'react'
import { Badge, type BadgeTone } from '../primitives/Badge'
import css from './RoleMatrix.module.css'

interface Role {
  id: string
  label: string
  locked?: boolean
}

interface Permission {
  id: string
  label: string
  group?: string
  /** Matiz bajo el nombre del permiso («módulo pendiente de construcción»). */
  hint?: string
}

/* rmx-1: una matriz de permisos no siempre es booleana. Un RBAC real concede
   NIVELES —completo, lectura, gestión…— con un alcance por celda (cazado en
   eOne: la matriz de su ADR-001). Con `levels` declarado, la celda es un
   `{ level, note? }` y se pinta como badge del tono del nivel + su nota; la
   celda vacía es una denegación explícita y se dice con «—», no con hueco. */
export interface RoleMatrixLevel {
  id: string
  label: string
  tone?: BadgeTone
}

export type RoleMatrixCell = boolean | { level: string; note?: string }

type Values = Record<string, Record<string, RoleMatrixCell>>

export interface RoleMatrixProps {
  roles: Role[]
  permissions: Permission[]
  values: Values
  /** Diccionario de niveles (rmx-1). Con él la matriz es presentacional. */
  levels?: RoleMatrixLevel[]
  onChange?: (next: Values, permId: string, roleId: string) => void
  style?: CSSProperties
}

export function RoleMatrix({ roles, permissions, values, levels, onChange, style }: RoleMatrixProps) {
  const toggle = (pid: string, rid: string) => {
    if (!onChange) return
    const next: Values = {}
    for (const k of Object.keys(values)) next[k] = { ...values[k] }
    next[pid] = next[pid] || {}
    next[pid][rid] = !next[pid][rid]
    onChange(next, pid, rid)
  }

  const rows: ({ type: 'group'; label: string } | { type: 'perm'; perm: Permission })[] = []
  const seen = new Set<string>()
  for (const p of permissions) {
    const g = p.group || ''
    if (g && !seen.has(g)) {
      seen.add(g)
      rows.push({ type: 'group', label: g })
    }
    rows.push({ type: 'perm', perm: p })
  }

  return (
    <div className={css.root} style={style}>
      <table className={css.table}>
        <thead>
          <tr>
            <th>Permiso</th>
            {roles.map(r => (
              <th key={r.id}>
                {r.label}
                {r.locked && (
                  <span className={`flow-symbol ${css.lockIcon}`} aria-hidden="true">lock</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            if (row.type === 'group') {
              return (
                <tr key={`g-${row.label}`} className={css.groupRow} aria-hidden="true">
                  <td colSpan={roles.length + 1}>{row.label}</td>
                </tr>
              )
            }
            const p = row.perm
            return (
              <tr key={p.id} className={css.permRow}>
                <td>
                  {p.hint ? (
                    <span className={css.permLabel}>
                      {p.label}
                      <span className={css.permHint}>{p.hint}</span>
                    </span>
                  ) : (
                    p.label
                  )}
                </td>
                {roles.map(r => {
                  const cell = values[p.id]?.[r.id]

                  // rmx-1: modo por niveles — presentacional, un badge por celda.
                  if (levels) {
                    const grant = typeof cell === 'object' && cell !== null ? cell : null
                    const level = grant ? levels.find(l => l.id === grant.level) : undefined
                    return (
                      <td key={r.id} className={css.cell}>
                        {level ? (
                          <span className={css.levelCell}>
                            <Badge tone={level.tone ?? 'default'}>{level.label}</Badge>
                            {grant?.note && <span className={css.cellNote}>{grant.note}</span>}
                          </span>
                        ) : (
                          <span className={css.dash} aria-label={`${p.label} — ${r.label}: sin acceso`}>
                            —
                          </span>
                        )}
                      </td>
                    )
                  }

                  const on = !!cell
                  return (
                    <td key={r.id} className={css.cell}>
                      <button
                        type="button"
                        className={css.toggle}
                        data-on={on ? '' : undefined}
                        disabled={r.locked}
                        aria-label={`${p.label} — ${r.label}${on ? ': permitido' : ': no permitido'}`}
                        aria-pressed={on}
                        onClick={() => toggle(p.id, r.id)}
                      >
                        {on && (
                          <span className={`flow-symbol ${css.checkIcon}`} aria-hidden="true">check</span>
                        )}
                      </button>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
