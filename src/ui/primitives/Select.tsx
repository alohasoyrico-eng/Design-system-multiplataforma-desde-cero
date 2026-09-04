import { useState, useRef, useCallback, useId, type CSSProperties, type ReactNode } from 'react'
import { useIntl } from 'react-intl'
import { ControlShell } from './ControlShell'
import { Popover } from './Popover'
import { Listbox, type ListboxItem } from './Listbox'
import css from './Select.module.css'

export interface SelectOption {
  value: string
  label: string
  icon?: string
  group?: string
}

export interface SelectProps {
  options: Array<string | SelectOption>
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  multiple?: boolean
  searchable?: boolean
  creatable?: boolean
  clearable?: boolean
  renderOption?: (o: SelectOption) => ReactNode
  size?: 'sm' | 'md' | 'lg'
  placeholder?: string
  /** Label integrada compacta (filtros): viaja dentro del trigger y da el
      nombre accesible al control — 9 selects de eOne la piden (§6). */
  insetLabel?: string
  icon?: string
  disabled?: boolean
  invalid?: boolean
  /** Id del control focusable — permite asociar <Field htmlFor>. */
  id?: string
  style?: CSSProperties
}

function normalize(o: string | SelectOption): SelectOption {
  return typeof o === 'string' ? { value: o, label: o } : o
}

export function Select({
  options,
  value,
  onChange,
  multiple,
  searchable,
  clearable,
  renderOption,
  size = 'md',
  placeholder,
  insetLabel,
  icon,
  disabled,
  invalid,
  id,
  style,
}: SelectProps) {
  const intl = useIntl()
  const resolvedPlaceholder = placeholder ?? intl.formatMessage({ id: 'common.select', defaultMessage: 'Seleccionar…' })
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeIdx, setActiveIdx] = useState(-1)
  const searchRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()

  const items = options.map(normalize)
  const filtered = search
    ? items.filter((i) => i.label.toLowerCase().includes(search.toLowerCase()))
    : items

  const selectedValues = Array.isArray(value) ? value : value != null ? [value] : []
  const selectedLabels = selectedValues
    .map((v) => items.find((i) => i.value === v)?.label ?? v)
    .join(', ')

  const handleSelect = useCallback(
    (item: ListboxItem) => {
      if (multiple) {
        const vals = Array.isArray(value) ? value : []
        const next = vals.includes(String(item.value))
          ? vals.filter((v) => v !== String(item.value))
          : [...vals, String(item.value)]
        onChange?.(next)
      } else {
        onChange?.(String(item.value))
        setOpen(false)
      }
      setSearch('')
    },
    [value, multiple, onChange],
  )

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onChange?.(multiple ? [] : '')
    },
    [multiple, onChange],
  )

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setActiveIdx(-1)
      if (disabled) return
      setOpen(next)
      if (next && searchable) {
        setTimeout(() => searchRef.current?.focus(), 0)
      }
      if (!next) setSearch('')
    },
    [disabled, searchable],
  )

  const listboxItems: ListboxItem[] = filtered.map((i) => ({
    value: i.value,
    label: i.label,
  }))

  const trigger = (
    <ControlShell
      size={size}
      disabled={disabled}
      error={invalid}
      leading={icon && <span className="flow-symbol flow-symbol--md" aria-hidden="true">{icon}</span>}
      trailing={
        <>
          {clearable && selectedValues.length > 0 && !open && (
            <button className={css.clear} onClick={handleClear} aria-label="Limpiar" type="button">
              <span className="flow-symbol" aria-hidden="true">close</span>
            </button>
          )}
          <span className={`flow-symbol ${css.chevron}`} data-open={open || undefined} aria-hidden="true">
            expand_more
          </span>
        </>
      }
      style={style}
    >
      <span
        id={id}
        className={css.trigger}
        role="combobox"
        aria-label={insetLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listboxId : undefined}
        tabIndex={disabled ? -1 : 0}
        aria-activedescendant={open && activeIdx >= 0 ? `${listboxId}-opt-${activeIdx}` : undefined}
        onKeyDown={(e) => {
          if (!open) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
              e.preventDefault()
              handleOpenChange(true)
            }
            return
          }
          // sel-2: el foco se queda en el combobox; el resaltado viaja por
          // aria-activedescendant.
          if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((p) => (p + 1) % listboxItems.length) }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((p) => (p <= 0 ? listboxItems.length - 1 : p - 1)) }
          else if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); handleSelect(listboxItems[activeIdx]) }
        }}
      >
        {insetLabel && <span className={css.insetLabel}>{insetLabel}:</span>}
        <span className={css.triggerText} data-empty={!selectedLabels || undefined}>
          {selectedLabels || resolvedPlaceholder}
        </span>
      </span>
    </ControlShell>
  )

  return (
    <Popover trigger={trigger} fillTrigger open={open} onOpenChange={handleOpenChange}>
      {searchable && (
        <div className={css.search}>
          <input
            ref={searchRef}
            className={css.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={intl.formatMessage({ id: 'common.search', defaultMessage: 'Buscar…' })}
            autoComplete="off"
          />
        </div>
      )}
      {filtered.length > 0 ? (
        <Listbox
          id={listboxId}
          active={activeIdx}
          onActiveChange={setActiveIdx}
          items={listboxItems}
          value={multiple ? undefined : (value as string)}
          onChange={handleSelect}
          renderItem={
            renderOption
              ? (item, state) => renderOption(items.find((i) => i.value === item.value) ?? { value: String(item.value), label: item.label })
              : undefined
          }
        />
      ) : (
        <div className={css.empty}>Sin resultados</div>
      )}
    </Popover>
  )
}
