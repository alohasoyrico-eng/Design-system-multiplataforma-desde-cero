import { useState, useEffect, useRef, type ReactNode } from 'react'
import { useParams } from '@tanstack/react-router'
import { SPECIMENS } from '@alohasoyrico-eng/flow-react/specimens'
import { Button } from '@alohasoyrico-eng/flow-react'
import { Breadcrumb } from '@alohasoyrico-eng/flow-react'
import { Tabs } from '@alohasoyrico-eng/flow-react'
import { SectionBar } from '@alohasoyrico-eng/flow-react'
import { SectionRule } from '@alohasoyrico-eng/flow-react'
import { CodeBlock } from '@alohasoyrico-eng/flow-react'
import { Table, type GridColumn } from '@alohasoyrico-eng/flow-react'
import { SegmentedControl } from '@alohasoyrico-eng/flow-react'
import { SectionHeader } from '@alohasoyrico-eng/flow-react'
import { InlineCode } from '@alohasoyrico-eng/flow-react'
import { AutoGrid } from '@alohasoyrico-eng/flow-react'
import { DocHero } from '@alohasoyrico-eng/flow-react'
import { DocFooter } from '@alohasoyrico-eng/flow-react'
import { PlaygroundCanvas } from '@alohasoyrico-eng/flow-react'
import { GuidanceCard } from '@alohasoyrico-eng/flow-react'
import { InstallCard } from '@alohasoyrico-eng/flow-react'
import { NavCard } from '@alohasoyrico-eng/flow-react'
import { AnatomyView, type AnatomyPart } from '@alohasoyrico-eng/flow-react'
import { StateGrid } from '@alohasoyrico-eng/flow-react'
import { DownloadCard } from '@alohasoyrico-eng/flow-react'
import { ProposalCard } from '@alohasoyrico-eng/flow-react'
import { getContract, getContractNeighbors } from '../data/contracts'
import type { ContractItem } from '../data/contracts'
import { useReveal } from '@alohasoyrico-eng/flow-react'
import css from './ComponentDetailPage.module.css'

const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'design', label: 'Design' },
  { value: 'build', label: 'Build' },
  { value: 'miel', label: 'MIEL' },
]

const DENSITIES = [
  { value: 'compact', label: 'compact' },
  { value: 'default', label: 'default' },
  { value: 'comfortable', label: 'comfortable' },
]

const INTERACTION_STATES = ['default', 'hover', 'focus', 'active', 'disabled', 'loading']

const PLATFORM_STATUS_LADDER: Record<string, string[]> = {
  react:   ['ready', 'ready', 'ready', 'ready', 'beta'],
  angular: ['ready', 'beta', 'beta', 'planned', 'planned'],
  flutter: ['ready', 'ready', 'beta', 'beta', 'planned'],
}

function variantPlatformStatus(
  componentStatus: string | undefined,
  variantIndex: number,
  platform: string,
): string {
  if (!componentStatus) return '—'
  const ladder = PLATFORM_STATUS_LADDER[platform] ?? ['ready']
  return ladder[Math.min(variantIndex, ladder.length - 1)]
}

const CHANGELOG = [
  { version: '1.112', note: 'Tighten compact padding from 16px to 14px', by: 'agent', status: 'signed' },
  { version: '1.108', note: 'Add danger variant with accessible contrast on light and dark', by: 'agent', status: 'signed' },
  { version: '1.96', note: 'Fix focus ring in forced-colors mode', by: 'human', status: 'signed' },
  { version: '1.90', note: 'Initial release — 5 variants, 3 sizes', by: 'human', status: 'signed' },
]

function platformTone(status: string) {
  if (status === 'reference' || status === 'stable') return 'success' as const
  if (status === 'beta') return 'warning' as const
  if (status === 'planned' || status === 'alpha') return 'info' as const
  return undefined
}

function parseAnatomyParts(anatomy: string): AnatomyPart[] {
  const firstSentence = anatomy.split('.')[0]
  return firstSentence
    .split('+')
    .map(s => s.trim())
    .filter(Boolean)
    .map(label => ({ label }))
}

function parseNotWhen(rule: string): { body: string; instead?: string } {
  const match = rule.match(/^(.+?)\s*—\s*usa\s+(.+)$/i)
  if (match) return { body: match[1].trim(), instead: match[2].trim() }
  return { body: rule }
}

function generateSnippet(name: string, variant: string, size: string): string {
  return `<${name} variant="${variant}" size="${size}" />`
}

function generateReactUsage(name: string): string {
  return [
    `import { ${name} } from '@flow/react';`,
    '',
    `<${name}`,
    `  variant="primary"`,
    `  size="md"`,
    `  onClick={handleClick}`,
    `>`,
    `  Confirmar`,
    `</${name}>`,
  ].join('\n')
}

function generateFlutterUsage(name: string): string {
  return [
    `import 'package:flow_ui/flow_ui.dart';`,
    '',
    `Flow${name}(`,
    `  variant: Flow${name}Variant.primary,`,
    `  size: Flow${name}Size.md,`,
    `  onPressed: handlePress,`,
    `  child: Text('Confirmar'),`,
    `)`,
  ].join('\n')
}

function RevealSection({ children, className }: { children: ReactNode; className?: string }) {
  const reveal = useReveal()
  return (
    <section ref={reveal.ref} className={`${reveal.className} ${className ?? ''}`}>
      {children}
    </section>
  )
}

function ScrollArc() {
  const [pct, setPct] = useState(0)
  const raf = useRef(0)

  useEffect(() => {
    function onScroll() {
      if (raf.current) return
      raf.current = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight
        setPct(h > 0 ? Math.round((window.scrollY / h) * 100) : 0)
        raf.current = 0
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const arcStart = 0
  const arcEnd = (pct / 100) * 180
  const r = 33.5
  const cx = 116.7
  const cy = 55.06
  const startRad = ((arcStart - 90) * Math.PI) / 180
  const endRad = ((arcEnd + 90) * Math.PI) / 180
  const x1 = cx + r * Math.cos(startRad)
  const y1 = cy + r * Math.sin(startRad)
  const x2 = cx + r * Math.cos(endRad)
  const y2 = cy + r * Math.sin(endRad)
  const largeArc = arcEnd > 180 ? 1 : 0
  const d = pct > 0
    ? `M${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2}`
    : ''

  return (
    <div className={css.scrollArc}>
      <svg viewBox="82 21 69 68" width="22" height="22" className={css.arcSvg}>
        <path
          d="M116.763 21.2508C136.763 21.3758 150.763 34.5008 150.888 55.1258H142.013C141.888 39.0008 131.138 29.0008 116.763 28.8758C103.263 28.7508 91.3877 38.8758 91.3877 55.1258C91.3878 71.3757 102.263 81.2508 116.763 81.2508V88.8758C96.8878 88.8758 82.5128 75.8757 82.5127 55.1258C82.5127 34.3758 98.2627 21.1258 116.763 21.2508Z"
          fill="currentColor"
        />
        {d && (
          <path
            d={d}
            fill="none"
            stroke="var(--flow-red-500)"
            strokeWidth="9"
            strokeLinecap="round"
          />
        )}
      </svg>
      <span className={css.arcPct}>{pct}%</span>
    </div>
  )
}

export function ComponentDetailPage() {
  const { componentId } = useParams({ strict: false })
  const [tab, setTab] = useState('overview')
  const [density, setDensity] = useState('default')

  const contract = getContract(componentId ?? '')
  const neighbors = getContractNeighbors(componentId ?? '')

  if (!contract) {
    return (
      <div className={css.page}>
        <p className={css.notFound}>
          Component <strong>{componentId}</strong> not found.
        </p>
      </div>
    )
  }

  const platforms = Object.entries(contract.platforms)
  const heroPlatforms = platforms.map(([p, s]) => ({
    label: `${p} ${s}`,
    tone: platformTone(s) ?? ('info' as const),
  }))

  const crumbs = [
    { label: 'Components', href: '#' },
    { label: contract.layer, href: '#' },
    { label: contract.name },
  ]

  return (
    <div className={css.page} data-density={density !== 'default' ? density : undefined}>
      <Breadcrumb items={crumbs} />

      <DocHero
        name={contract.name}
        summary={contract.summary}
        platforms={heroPlatforms}
        a11yLevel={contract.a11y.length > 0 ? 'WCAG 2.2 AA' : undefined}
      />

      <SectionBar
        trailing={
          <div className={css.barTrailing}>
            <SegmentedControl
              size="sm"
              items={DENSITIES}
              value={density}
              onChange={setDensity}
            />
            <a href="#" className={css.barLink}>Angular</a>
            <a href="#" className={css.barLink}>GitHub</a>
          </div>
        }
      >
        <Tabs value={tab} onChange={setTab} items={TABS} variant="bar" />
      </SectionBar>

      {tab === 'overview' && <OverviewTab contract={contract} componentId={componentId ?? ''} />}
      {tab === 'design' && <DesignTab contract={contract} />}
      {tab === 'build' && <BuildTab contract={contract} />}
      {tab === 'miel' && <MielTab contract={contract} />}

      <nav className={css.navFooter}>
        {neighbors.prev && (
          <NavCard
            label="Previous"
            name={neighbors.prev.name}
            href={`/docs/${neighbors.prev.id}`}
            direction="prev"
          />
        )}
        {neighbors.next && (
          <NavCard
            label="Next"
            name={neighbors.next.name}
            href={`/docs/${neighbors.next.id}`}
            direction="next"
          />
        )}
      </nav>

      <DocFooter
        lastUpdated="26 Aug 2026"
        version="React ^1.112.0 · Flutter ^0.9.4"
        links={[
          { label: 'Edit this page', href: '#' },
          { label: 'Report an issue', href: '#' },
        ]}
      />

      <ScrollArc />
    </div>
  )
}

/* ── Overview Tab ── */

function OverviewTab({ contract, componentId }: { contract: ContractItem; componentId: string }) {
  // spm-3: el template consume el registro de forma genérica — no conoce
  // ninguna pieza por nombre. Los ejes del playground salen del specimen
  // cuando existe; si no, de la ficha.
  const specimen = componentId ? SPECIMENS[componentId] : undefined
  const variants = (specimen?.variants ?? contract.variants.map(v => v.v)).map(v => ({ value: v, label: v }))
  const sizes = specimen?.sizes ?? ['sm', 'md', 'lg']

  return (
    <div>
      <RevealSection className={css.section}>
        <SectionRule
          label="Playground"
          meta={`${contract.variants.length} variants · ${sizes.length} sizes`}
        />
        <div className={css.sectionHeading}>
          <SectionHeader size="display">
            <span>Every variant</span>
            <span className={css.headingSub}>in every size</span>
          </SectionHeader>
        </div>
        <PlaygroundCanvas
          variants={variants}
          sizes={sizes}
          densities={['compact', 'default', 'comfortable']}
          snippet={generateSnippet(contract.name, variants[0]?.value ?? 'primary', 'md')}
        >
          {({ variant, size, density }) =>
            specimen ? (
              specimen.render({ variant, size, density })
            ) : (
              <div className={css.specimenPlaceholder}>
                <span className={css.specimenName}>{contract.name}</span>
                <span className={css.specimenMeta}>{variant} · {size} · specimen pendiente</span>
              </div>
            )
          }
        </PlaygroundCanvas>
      </RevealSection>

      {(contract.when.length > 0 || contract.notWhen.length > 0) && (
        <RevealSection className={css.section}>
          <SectionRule
            label="Guidance"
            meta={`${contract.when.length + contract.notWhen.length} rules`}
          />
          <div className={css.sectionHeading}>
            <SectionHeader size="display">
              <span>When to use</span>
              <span className={css.headingSub}>and when not to</span>
            </SectionHeader>
          </div>
          <div className={css.guidanceColumns}>
            {contract.when.length > 0 && (
              <div>
                <div className={css.ruleHeader}>
                  <span className={css.ruleDot} data-tone="success" />
                  <span className={css.ruleLabel} data-tone="success">Use when</span>
                  <span className={css.ruleSource}>usage.when</span>
                </div>
                {contract.when.map((rule, i) => (
                  <div key={i} className={css.ruleItem}>{rule}</div>
                ))}
              </div>
            )}
            {contract.notWhen.length > 0 && (
              <div>
                <div className={css.ruleHeader}>
                  <span className={css.ruleDot} data-tone="danger" />
                  <span className={css.ruleLabel} data-tone="danger">Don&apos;t use when</span>
                  <span className={css.ruleSource}>usage.notWhen</span>
                </div>
                {contract.notWhen.map((raw, i) => {
                  const { body, instead } = parseNotWhen(raw)
                  return (
                    <div key={i} className={css.ruleItemRow}>
                      <span className={css.ruleItem}>{body}</span>
                      {instead && (
                        <span className={css.ruleInstead}>{instead}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </RevealSection>
      )}

      {contract.variants.length > 0 && (
        <RevealSection className={css.section}>
          <SectionRule
            label="Platform support"
            meta="Per variant, not per component"
          />
          <Table
            columns={[
              {
                key: 'variant',
                label: 'Variant',
                render: (row: Record<string, unknown>) => (
                  <span className={css.variantName}>{String(row.variant)}</span>
                ),
              },
              { key: 'react', label: 'React' },
              { key: 'angular', label: 'Angular' },
              { key: 'flutter', label: 'Flutter' },
            ]}
            rows={contract.variants.map((v, i) => ({
              variant: v.v,
              react: variantPlatformStatus(contract.platforms.web, i, 'react'),
              angular: variantPlatformStatus(contract.platforms.angular, i, 'angular'),
              flutter: variantPlatformStatus(contract.platforms.flutter, i, 'flutter'),
            }))}
            rowKey="variant"
            sortable={false}
          />
        </RevealSection>
      )}

    </div>
  )
}

/* ── Design Tab ── */

function DesignTab({ contract }: { contract: ContractItem }) {
  const anatomyParts = parseAnatomyParts(contract.anatomy)

  return (
    <div>
      {contract.anatomy && (
        <RevealSection className={css.section}>
          <SectionRule
            label="Anatomy"
            meta={`${anatomyParts.length} parts`}
          />
          <div className={css.sectionHeading}>
            <SectionHeader size="display">
              <span>{anatomyParts.length} parts</span>
              <span className={css.headingSub}>no more</span>
            </SectionHeader>
          </div>
          <AnatomyView parts={anatomyParts} />
        </RevealSection>
      )}

      <RevealSection className={css.section}>
        <SectionRule
          label="States"
          meta={`${INTERACTION_STATES.length} states · identity preserved`}
        />
        <StateGrid
          states={INTERACTION_STATES.map(s => ({
            label: s,
            specimen: (
              <div className={css.specimenPlaceholder}>
                <span className={css.specimenName}>{contract.name}</span>
                <span className={css.specimenMeta}>{s}</span>
              </div>
            ),
          }))}
        />
      </RevealSection>

      {(contract.dos.length > 0 || contract.donts.length > 0) && (
        <RevealSection className={css.section}>
          <SectionRule
            label="Do and don't"
            meta={`${contract.dos.length + contract.donts.length} examples`}
          />
          <AutoGrid minWidth="320px">
            {contract.dos.length > 0 && (
              <GuidanceCard tone="success" rules={contract.dos} />
            )}
            {contract.donts.length > 0 && (
              <GuidanceCard tone="danger" rules={contract.donts} />
            )}
          </AutoGrid>
        </RevealSection>
      )}

      {contract.tokens.length > 0 && (
        <RevealSection className={css.section}>
          <SectionRule
            label="Tokens"
            meta={`${contract.tokens.length} tokens · sys only, never ref`}
          />
          <Table
            columns={[{ key: 'token', label: 'Token', mono: true }]}
            rows={contract.tokens.map(t => ({ token: t }))}
            rowKey="token"
            sortable={false}
          />
        </RevealSection>
      )}
    </div>
  )
}

/* ── Build Tab ── */

function BuildTab({ contract }: { contract: ContractItem }) {
  const platforms = Object.entries(contract.platforms)

  const memberColumns: GridColumn[] = [
    {
      key: 'n',
      label: 'Member',
      mono: true,
      render: (row: Record<string, unknown>) => (
        <>
          {String(row.n)}
          {row.r && <span className={css.required}>*</span>}
        </>
      ),
    },
    { key: 'k', label: 'Kind', mono: true },
    { key: 't', label: 'Type', mono: true },
    { key: 'd', label: 'Default', mono: true },
    { key: 'note', label: 'Notes' },
  ]

  const propCount = contract.members.filter(m => m.k === 'prop').length
  const eventCount = contract.members.filter(m => m.k === 'event').length
  const apiMeta = [
    propCount > 0 ? `${propCount} props` : '',
    eventCount > 0 ? `${eventCount} events` : '',
  ].filter(Boolean).join(' · ')

  return (
    <div>
      <RevealSection className={css.section}>
        <SectionRule
          label="Install"
          meta={platforms.map(([p, s]) => `${p} ${s}`).join(' · ')}
        />
        <AutoGrid minWidth="300px">
          {platforms.map(([platform, status]) => (
            <InstallCard
              key={platform}
              platform={platform}
              command={
                platform === 'flutter'
                  ? 'flutter pub add flow_ui'
                  : `npm i @flow/${platform === 'web' ? 'react' : platform}`
              }
              status={status}
              statusTone={platformTone(status)}
            />
          ))}
        </AutoGrid>
      </RevealSection>

      <RevealSection className={css.section}>
        <SectionRule label="Usage" meta="Both platforms" />
        <div className={css.sectionHeading}>
          <SectionHeader size="display">
            <span>Same example</span>
            <span className={css.headingSub}>both platforms</span>
          </SectionHeader>
        </div>
        <div className={css.usagePair}>
          <div className={css.usagePane}>
            <CodeBlock
              code={generateReactUsage(contract.name)}
              filename={`${contract.name.toLowerCase()}.tsx`}
            />
          </div>
          {contract.platforms.flutter && (
            <div className={css.usagePane}>
              <CodeBlock
                code={generateFlutterUsage(contract.name)}
                filename={`${contract.name.toLowerCase()}.dart`}
              />
            </div>
          )}
        </div>
      </RevealSection>

      {contract.members.length > 0 && (
        <RevealSection className={css.section}>
          <SectionRule label="API" meta={apiMeta} />
          <Table
            columns={memberColumns}
            rows={contract.members as unknown as Record<string, unknown>[]}
            rowKey="n"
            sortable={false}
          />
        </RevealSection>
      )}

      {contract.a11y.length > 0 && (
        <RevealSection className={css.section}>
          <SectionRule label="Accessibility" meta="WCAG 2.2 AA" />
          {contract.a11y.map((rule, i) => (
            <div key={i} className={css.a11yItem}>
              {rule}
            </div>
          ))}
        </RevealSection>
      )}
    </div>
  )
}

/* ── MIEL Tab ── */

function MielTab({ contract }: { contract: ContractItem }) {
  const kebab = contract.name.toLowerCase().replace(/\s+/g, '-')

  return (
    <div>
      <RevealSection className={css.section}>
        <SectionRule
          label="Context for agents"
          meta={
            <span className={css.syncStatus}>
              <span className={css.syncDot} />
              In sync
            </span>
          }
        />
        <div className={css.sectionHeading}>
          <SectionHeader size="display">
            <span>Agents propose</span>
            <span className={css.headingSub}>humans sign</span>
          </SectionHeader>
        </div>
        <div className={css.mielColumns}>
          <div>
            <p className={css.mielDesc}>
              Everything an agent needs to use {contract.name} correctly,
              in one file and one endpoint. Regenerated on every release.
            </p>
            <div className={css.mielDownloads}>
              <DownloadCard
                filename={`${kebab}.DESIGN.md`}
                icon="description"
                href="#"
              />
              <DownloadCard
                filename={`/components/${kebab}.json`}
                icon="dns"
                href="#"
              />
            </div>
          </div>
          <div>
            <div className={css.ruleHeader}>
              <span className={css.ruleLabel}>Rules an agent must follow</span>
            </div>
            {contract.nonGoals.length > 0 ? (
              contract.nonGoals.map((rule, i) => (
                <div key={i} className={css.ruleItem}>{rule}</div>
              ))
            ) : (
              <>
                <div className={css.ruleItem}>
                  Read sys tokens. Never write a hex value into component code.
                </div>
                <div className={css.ruleItem}>
                  Follow the cascade: foundations → primitives → components → patterns.
                </div>
                <div className={css.ruleItem}>
                  Any token rename opens a proposal — it never ships inside a feature PR.
                </div>
              </>
            )}
          </div>
        </div>
      </RevealSection>

      <RevealSection className={css.section}>
        <SectionRule label="Proposal #418" meta="Needs 1 human" />
        <div className={css.sectionHeading}>
          <SectionHeader size="display">
            <span>Tighten compact padding</span>
            <span className={css.headingSub}>opened by agent</span>
          </SectionHeader>
        </div>
        <ProposalCard
          before={<InlineCode>--sys-pad-control: 16px</InlineCode>}
          after={<InlineCode>--sys-pad-control: 14px</InlineCode>}
          footer={
            <>
              <span className={css.proposalDesc}>
                Affects 11 screens across 2 products. Contrast and hit-target checks passed automatically.
              </span>
              <Button variant="secondary" size="sm">Request changes</Button>
              <Button variant="primary" size="sm">Approve</Button>
            </>
          }
        />
      </RevealSection>

      <RevealSection className={css.section}>
        <SectionRule label="Change log" meta="Agent-drafted, human signed" />
        <Table
          columns={[
            { key: 'version', label: 'Version', mono: true },
            { key: 'note', label: 'Note' },
            { key: 'by', label: 'By', mono: true },
            {
              key: 'status',
              label: 'Status',
              mono: true,
              render: (row: Record<string, unknown>) => (
                <span className={css.changelogStatus}>{String(row.status)}</span>
              ),
            },
          ]}
          rows={CHANGELOG}
          rowKey="version"
          sortable={false}
        />
      </RevealSection>
    </div>
  )
}
