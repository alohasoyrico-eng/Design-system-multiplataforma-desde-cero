import type { CSSProperties } from 'react'
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

/* La matriz es BOOLEANA a propósito: un permiso se tiene o no se tiene. Un
   RBAC con «niveles» (completo, lectura, gestión…) no pide celdas nuevas,
   pide DESCOMPONER cada nivel en las acciones que concede —ver, escribir,
   administrar— y decir cada una en su fila. El modo por niveles que vivió
   aquí un día (rmx-1, 0.6.19) murió por eso: nació para acomodar el
   vocabulario compuesto de un legado, y el legado no manda sobre el DS. */
type Values = Record<string, Record<string, boolean>>

export interface RoleMatrixProps {
  roles: Role[]
  permissions: Permission[]
  values: Values
  onChange?: (next: Values, permId: string, roleId: string) => void
  style?: CSSProperties
}

export function RoleMatrix({ roles, permissions, values, onChange, style }: RoleMatrixProps) {
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
                  const on = !!values[p.id]?.[r.id]
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
