import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { RoleMatrix } from '../RoleMatrix'

const roles = [
  { id: 'admin', label: 'Admin' },
  { id: 'editor', label: 'Editor' },
]

const permissions = [
  { id: 'read', label: 'Leer', group: 'Contenido' },
  { id: 'write', label: 'Escribir', group: 'Contenido' },
  { id: 'delete', label: 'Eliminar' },
]

const values = {
  read: { admin: true, editor: true },
  write: { admin: true, editor: false },
  delete: { admin: true, editor: false },
}

describe('RoleMatrix', () => {
  it('renders role column headers', () => {
    render(<RoleMatrix roles={roles} permissions={permissions} values={values} />)
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('Editor')).toBeInTheDocument()
  })

  it('renders permission row labels', () => {
    render(<RoleMatrix roles={roles} permissions={permissions} values={values} />)
    expect(screen.getByText('Leer')).toBeInTheDocument()
    expect(screen.getByText('Escribir')).toBeInTheDocument()
    expect(screen.getByText('Eliminar')).toBeInTheDocument()
  })

  it('renders group header row', () => {
    render(<RoleMatrix roles={roles} permissions={permissions} values={values} />)
    expect(screen.getByText('Contenido')).toBeInTheDocument()
  })

  it('renders toggle buttons with aria-pressed', () => {
    render(<RoleMatrix roles={roles} permissions={permissions} values={values} />)
    const readAdmin = screen.getByRole('button', { name: /Leer — Admin.*permitido/ })
    expect(readAdmin).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onChange when toggle clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RoleMatrix roles={roles} permissions={permissions} values={values} onChange={onChange} />)
    const writeEditor = screen.getByRole('button', { name: /Escribir — Editor.*no permitido/ })
    await user.click(writeEditor)
    expect(onChange).toHaveBeenCalledOnce()
    const [nextValues, permId, roleId] = onChange.mock.calls[0]
    expect(permId).toBe('write')
    expect(roleId).toBe('editor')
    expect(nextValues.write.editor).toBe(true)
  })

  it('disables toggles for locked roles', () => {
    const lockedRoles = [
      { id: 'admin', label: 'Admin', locked: true },
      { id: 'editor', label: 'Editor' },
    ]
    render(<RoleMatrix roles={lockedRoles} permissions={permissions} values={values} />)
    const readAdmin = screen.getByRole('button', { name: /Leer — Admin/ })
    expect(readAdmin).toBeDisabled()
  })
})
