import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { FileUpload } from '../FileUpload'

describe('FileUpload', () => {
  it('renders label and hint', () => {
    renderWithIntl(<FileUpload label="Sube tu archivo" hint="PDF, máx. 10MB" />)
    expect(screen.getByText('Sube tu archivo')).toBeInTheDocument()
    expect(screen.getByText('PDF, máx. 10MB')).toBeInTheDocument()
  })

  it('renders file list with names and sizes', () => {
    const files = [
      { name: 'documento.pdf', size: 1048576 },
      { name: 'imagen.png', size: 2048 },
    ]
    renderWithIntl(<FileUpload files={files} />)
    expect(screen.getByText('documento.pdf')).toBeInTheDocument()
    expect(screen.getByText('1.0 MB')).toBeInTheDocument()
    expect(screen.getByText('imagen.png')).toBeInTheDocument()
    expect(screen.getByText('2 KB')).toBeInTheDocument()
  })

  it('renders remove button for each file', () => {
    const files = [{ name: 'test.pdf', size: 500 }]
    renderWithIntl(<FileUpload files={files} onChange={() => {}} />)
    expect(screen.getByLabelText('Quitar test.pdf')).toBeInTheDocument()
  })

  it('calls onChange when removing a file', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const files = [
      { name: 'a.pdf', size: 100 },
      { name: 'b.pdf', size: 200 },
    ]
    renderWithIntl(<FileUpload files={files} onChange={onChange} />)
    await user.click(screen.getByLabelText('Quitar a.pdf'))
    expect(onChange).toHaveBeenCalledWith([{ name: 'b.pdf', size: 200 }])
  })

  it('renders no file list when files is empty', () => {
    const { container } = renderWithIntl(<FileUpload files={[]} />)
    expect(container.querySelectorAll('[class*="fileItem"]')).toHaveLength(0)
  })
})

describe('FileUpload — multiple y disabled', () => {
  it('multiple=false reemplaza en vez de acumular', () => {
    const onChange = vi.fn()
    const files = [{ name: 'a.pdf', size: 100 }]
    const { container } = renderWithIntl(<FileUpload files={files} onChange={onChange} multiple={false} />)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    expect(input.multiple).toBe(false)
  })

  it('disabled bloquea el input y marca el root', () => {
    const { container } = renderWithIntl(<FileUpload disabled />)
    expect((container.querySelector('input[type="file"]') as HTMLInputElement).disabled).toBe(true)
    expect(container.querySelector('[data-disabled]')).not.toBeNull()
  })
})
