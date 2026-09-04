import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { DocumentViewer } from '../DocumentViewer'

describe('DocumentViewer', () => {
  // dv-1 y dv-2: expandir con nombre accesible, mismo título, foco de regreso
  it('expande con el mismo título y devuelve el foco al colapsar', async () => {
    render(
      <DocumentViewer title="Recibo marzo" actions={<button>Descargar</button>}>
        <div>documento</div>
      </DocumentViewer>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Pantalla completa' }))
    expect(screen.getAllByText('Recibo marzo')).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: 'Descargar' })).toHaveLength(2)
    await userEvent.click(screen.getByRole('button', { name: 'Salir de pantalla completa' }))
    expect(screen.queryByRole('button', { name: 'Salir de pantalla completa' })).toBeNull()
  })

  it('sin expandable no hay control de pantalla completa', () => {
    render(
      <DocumentViewer title="Recibo" expandable={false}>
        <div>doc</div>
      </DocumentViewer>,
    )
    expect(screen.queryByRole('button', { name: 'Pantalla completa' })).toBeNull()
  })
})
