import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Accordion } from '../Accordion'

const items = [
  { id: 'a', title: 'Section A', content: <p>Content A</p> },
  { id: 'b', title: 'Section B', content: <p>Content B</p> },
]

describe('Accordion', () => {
  it('renders all section titles', () => {
    render(<Accordion items={items} />)
    expect(screen.getByText('Section A')).toBeInTheDocument()
    expect(screen.getByText('Section B')).toBeInTheDocument()
  })

  it('starts with all sections closed by default', () => {
    render(<Accordion items={items} />)
    expect(screen.queryByText('Content A')).not.toBeInTheDocument()
    expect(screen.queryByText('Content B')).not.toBeInTheDocument()
  })

  it('opens defaultOpen section', () => {
    render(<Accordion items={items} defaultOpen="a" />)
    expect(screen.getByText('Content A')).toBeInTheDocument()
    expect(screen.queryByText('Content B')).not.toBeInTheDocument()
  })

  it('toggles section on click', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} />)
    await user.click(screen.getByText('Section A'))
    expect(screen.getByText('Content A')).toBeInTheDocument()
    await user.click(screen.getByText('Section A'))
    expect(screen.queryByText('Content A')).not.toBeInTheDocument()
  })

  it('closes previous section when opening another', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} />)
    await user.click(screen.getByText('Section A'))
    expect(screen.getByText('Content A')).toBeInTheDocument()
    await user.click(screen.getByText('Section B'))
    expect(screen.queryByText('Content A')).not.toBeInTheDocument()
    expect(screen.getByText('Content B')).toBeInTheDocument()
  })

  it('sets aria-expanded on trigger buttons', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} />)
    const triggers = screen.getAllByRole('button')
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'false')
    await user.click(triggers[0])
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'true')
  })
})

describe('Accordion — multiple', () => {
  const items = [
    { id: 'a', title: 'Uno', content: 'contenido-a' },
    { id: 'b', title: 'Dos', content: 'contenido-b' },
  ]

  it('exclusivo por default: abrir uno cierra el otro', async () => {
    render(<Accordion items={items} defaultOpen="a" />)
    await userEvent.click(screen.getByRole('button', { name: /Dos/ }))
    expect(screen.queryByText('contenido-a')).toBeNull()
    expect(screen.getByText('contenido-b')).toBeInTheDocument()
  })

  it('con multiple, ambos pueden estar abiertos', async () => {
    render(<Accordion items={items} defaultOpen="a" multiple />)
    await userEvent.click(screen.getByRole('button', { name: /Dos/ }))
    expect(screen.getByText('contenido-a')).toBeInTheDocument()
    expect(screen.getByText('contenido-b')).toBeInTheDocument()
  })
})
