import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { OnboardingCarousel } from '../OnboardingCarousel'

const slides = [
  { title: 'Bienvenido', description: 'Primera diapositiva' },
  { title: 'Funciones', description: 'Segunda diapositiva' },
  { title: 'Listo', description: 'Tercera diapositiva' },
]

describe('OnboardingCarousel', () => {
  it('renders slide title and description', () => {
    renderWithIntl(<OnboardingCarousel slides={slides} />)
    expect(screen.getByText('Bienvenido')).toBeInTheDocument()
    expect(screen.getByText('Primera diapositiva')).toBeInTheDocument()
  })

  it('renders dot indicators for each slide', () => {
    renderWithIntl(<OnboardingCarousel slides={slides} />)
    const dots = screen.getAllByRole('button', { name: /Ir a diapositiva/ })
    expect(dots).toHaveLength(3)
  })

  it('renders continue button on non-last slides', () => {
    renderWithIntl(<OnboardingCarousel slides={slides} index={0} />)
    expect(screen.getByText('Continuar')).toBeInTheDocument()
  })

  it('renders done button on last slide', () => {
    renderWithIntl(<OnboardingCarousel slides={slides} index={2} />)
    expect(screen.getByText('Empezar')).toBeInTheDocument()
  })

  it('renders skip button when onSkip provided and not last slide', () => {
    renderWithIntl(<OnboardingCarousel slides={slides} index={0} onSkip={vi.fn()} />)
    expect(screen.getByText('Omitir')).toBeInTheDocument()
  })

  it('omitir sigue disponible en la ultima diapositiva (onb-3)', () => {
    renderWithIntl(<OnboardingCarousel slides={slides} index={2} onSkip={vi.fn()} />)
    expect(screen.getByText('Omitir')).toBeInTheDocument()
  })

  it('calls onSkip when skip button clicked', async () => {
    const user = userEvent.setup()
    const onSkip = vi.fn()
    renderWithIntl(<OnboardingCarousel slides={slides} index={0} onSkip={onSkip} />)
    await user.click(screen.getByText('Omitir'))
    expect(onSkip).toHaveBeenCalledOnce()
  })

  it('calls onIndexChange when continue clicked', async () => {
    const user = userEvent.setup()
    const onIndexChange = vi.fn()
    renderWithIntl(<OnboardingCarousel slides={slides} index={0} onIndexChange={onIndexChange} />)
    await user.click(screen.getByText('Continuar'))
    expect(onIndexChange).toHaveBeenCalledWith(1)
  })

  it('calls onDone when done button clicked on last slide', async () => {
    const user = userEvent.setup()
    const onDone = vi.fn()
    renderWithIntl(<OnboardingCarousel slides={slides} index={2} onDone={onDone} />)
    await user.click(screen.getByText('Empezar'))
    expect(onDone).toHaveBeenCalledOnce()
  })

  it('calls onIndexChange when dot clicked', async () => {
    const user = userEvent.setup()
    const onIndexChange = vi.fn()
    renderWithIntl(<OnboardingCarousel slides={slides} index={0} onIndexChange={onIndexChange} />)
    const dots = screen.getAllByRole('button', { name: /Ir a diapositiva/ })
    await user.click(dots[2])
    expect(onIndexChange).toHaveBeenCalledWith(2)
  })
})
