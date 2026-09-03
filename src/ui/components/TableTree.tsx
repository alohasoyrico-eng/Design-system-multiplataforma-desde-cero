import { useState, useCallback, type ReactNode, type CSSProperties } from 'react'
import { useIntl } from 'react-intl'
import css from './TableTree.module.css'

export interface TableTreeColumn {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
  mono?: boolean
  render?: (row: Record<string, unknown>) => ReactNode
}

export interface TableTreeRow {
  [key: string]: unknown
  children?: TableTreeRow[]
}

export interface TableTreeProps {
  columns: TableTreeColumn[]
  rows: TableTreeRow[]
  rowKey?: string
  onRowClick?: (row: TableTreeRow) => void
  selectedKey?: string
  style?: CSSProperties
}

export function TableTree({ columns, rows, rowKey = 'id', onRowClick, selectedKey, style }: TableTreeProps) {
  const intl = useIntl()
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggle = useCallback((key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const renderRows = (items: TableTreeRow[], level: number): ReactNode[] => {
    const result: ReactNode[] = []
    for (const row of items) {
      const key = String(row[rowKey] ?? '')
      const hasChildren = !!(row.children && row.children.length)
      const isOpen = expanded.has(key)
      const isSelected = selectedKey != null && key === selectedKey

      result.push(
        <tr
          key={key}
          className={css.row}
          data-selected={isSelected || undefined}
          data-clickable={onRowClick ? '' : undefined}
          onClick={() => onRowClick?.(row)}
          aria-level={level + 1}
          aria-expanded={hasChildren ? isOpen : undefined}
        >
          {columns.map((col, ci) => (
            <td
              key={col.key}
              className={css.td}
              data-mono={col.mono || undefined}
              style={{ textAlign: col.align || 'left' }}
            >
              {ci === 0 ? (
                <div className={css.treeCell}>
                  <span className={css.spacer} style={{ width: level * 20 }} />
                  {hasChildren ? (
                    <button
                      type="button"
                      className={css.toggle}
                      data-open={isOpen || undefined}
                      aria-label={isOpen ? intl.formatMessage({ id: 'common.collapse', defaultMessage: 'Colapsar' }) : intl.formatMessage({ id: 'common.expand', defaultMessage: 'Expandir' })}
                      onClick={(e) => { e.stopPropagation(); toggle(key) }}
                    >
                      <span className="flow-symbol flow-symbol--sm" aria-hidden="true">
                        chevron_right
                      </span>
                    </button>
                  ) : (
                    <span className={css.spacer} style={{ width: 20 }} />
                  )}
                  {col.render ? col.render(row) : (row[col.key] as ReactNode)}
                </div>
              ) : (
                col.render ? col.render(row) : (row[col.key] as ReactNode)
              )}
            </td>
          ))}
        </tr>,
      )

      if (hasChildren && isOpen) {
        result.push(...renderRows(row.children!, level + 1))
      }
    }
    return result
  }

  return (
    <div className={css.root} style={style}>
      <table className={css.table} role="treegrid">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={css.th}
                style={{ textAlign: col.align || 'left' }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderRows(rows, 0)}</tbody>
      </table>
    </div>
  )
}
