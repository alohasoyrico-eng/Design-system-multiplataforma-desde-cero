import { useState, type CSSProperties, type ReactNode } from 'react'
import { Specimen } from '../primitives/Specimen'
import { Chip } from '../primitives/Chip'
import { ChipGroup } from '../primitives/ChipGroup'
import { SegmentedControl } from '../components/SegmentedControl'
import { CodeBlock } from '../components/CodeBlock'
import css from './PlaygroundCanvas.module.css'

export interface PlaygroundOption {
  value: string
  label: string
}

export interface PlaygroundCanvasProps {
  variants?: PlaygroundOption[]
  sizes?: string[]
  densities?: string[]
  snippet?: string
  children: (state: { variant: string; size: string; density: string }) => ReactNode
  style?: CSSProperties
}

export function PlaygroundCanvas({
  variants = [],
  sizes = [],
  densities = [],
  snippet,
  children,
  style,
}: PlaygroundCanvasProps) {
  const [variant, setVariant] = useState(variants[0]?.value ?? '')
  const [size, setSize] = useState(sizes[0] ?? 'md')
  const [density, setDensity] = useState(densities[0] ?? 'default')
  const [spec, setSpec] = useState(false)
  const [dark, setDark] = useState(false)

  return (
    <div className={css.root} style={style}>
      <div className={css.surface} data-dark={dark || undefined}>
        {(variants.length > 0 || sizes.length > 0) && (
          <div className={css.controls}>
            {variants.length > 0 && (
              <ChipGroup>
                {variants.map(v => (
                  <Chip
                    key={v.value}
                    label={v.label}
                    variant="ghost"
                    size="sm"
                    mono
                    selected={v.value === variant}
                    onClick={() => setVariant(v.value)}
                  />
                ))}
              </ChipGroup>
            )}
            {sizes.length > 0 && (
              <ChipGroup>
                {sizes.map(s => (
                  <Chip
                    key={s}
                    label={s}
                    variant="ghost"
                    size="sm"
                    mono
                    selected={s === size}
                    onClick={() => setSize(s)}
                  />
                ))}
              </ChipGroup>
            )}
            {densities.length > 0 && (
              <SegmentedControl
                size="sm"
                items={densities.map(d => ({ value: d, label: d }))}
                value={density}
                onChange={setDensity}
              />
            )}
            <div className={css.toggles}>
              <Chip
                label="Spec"
                size="sm"
                selected={spec}
                onClick={() => setSpec(s => !s)}
              />
              <Chip
                label="Dark"
                size="sm"
                selected={dark}
                onClick={() => setDark(d => !d)}
              />
            </div>
          </div>
        )}

        <Specimen grid centered>
          <div
            data-density={density !== 'default' ? density : undefined}
            className={spec ? css.specOverlay : undefined}
          >
            {children({ variant, size, density })}
          </div>
        </Specimen>

        {snippet && <CodeBlock code={snippet} filename="Usage" />}
      </div>
    </div>
  )
}
