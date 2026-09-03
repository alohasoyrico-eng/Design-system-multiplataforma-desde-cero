import { useState, type ReactNode } from 'react'
import { ChatThread, type ChatMsg } from '../ui/components/ChatThread'
import { ChatComposer } from '../ui/components/ChatComposer'
import { EmptyState } from '../ui/primitives/EmptyState'
import { Breadcrumb } from '../ui/primitives/Breadcrumb'
import { Table } from '../ui/components/Table'
import { Badge } from '../ui/primitives/Badge'
import { Bars } from '../ui/components/Bars'
import { StatTile } from '../ui/components/StatTile'
import css from './AgentChatPage.module.css'

let uid = 0
const nid = () => 'm' + ++uid

interface ResponseDef {
  text: string
  content: (() => ReactNode) | null
}

const RESPONSES: Record<string, ResponseDef> = {
  gasto: {
    text: 'Este mes gastaste $248,400 en total. Combustible es el 73% del gasto — aquí el detalle de las unidades con mayor consumo:',
    content: () => (
      <Table
        rowKey="unit"
        columns={[
          { key: 'unit', label: 'Unidad', mono: true },
          { key: 'driver', label: 'Conductor' },
          { key: 'gasto', label: 'Gasto', align: 'right' as const, mono: true },
          {
            key: 'st',
            label: '',
            render: (r) => {
              const row = r as { alto: boolean }
              return <Badge tone={row.alto ? 'warning' : 'default'}>{row.alto ? 'Sobre promedio' : 'Normal'}</Badge>
            },
          },
        ]}
        rows={[
          { unit: 'KTR-882-A', driver: 'Luis Prieto', gasto: '$4,820', alto: true, st: '' },
          { unit: 'MVD-101-C', driver: 'Rosa Duarte', gasto: '$3,910', alto: false, st: '' },
          { unit: 'JMX-214-B', driver: 'Ana Sosa', gasto: '$3,640', alto: false, st: '' },
        ]}
      />
    ),
  },
  comparar: {
    text: 'Comparando combustible vs electromovilidad este trimestre: las unidades eléctricas cuestan $0.86/km vs $2.14/km de combustión — una diferencia de $1.28/km.',
    content: () => (
      <Bars
        height={140}
        format={(v: number) => '$' + v}
        data={[
          { label: 'Combustible', value: 214 },
          { label: 'Electromovilidad', value: 86 },
        ]}
      />
    ),
  },
  unidad: {
    text: 'JMX-214-B (Ana Sosa) tiene el mejor desempeño este mes: 184 km recorridos, 12 viajes, sin alertas abiertas.',
    content: () => (
      <div className={css.statGrid}>
        <StatTile label="Viajes" value="12" icon="navigation" />
        <StatTile label="Km" value="184" icon="route" />
        <StatTile label="Alertas" value="0" icon="check_circle" />
      </div>
    ),
  },
  default: {
    text: 'Puedo ayudarte con gasto, comparativas entre productos, o el desempeño de una unidad específica. Intenta una de las sugerencias abajo.',
    content: null,
  },
}

function pickResponse(q: string): ResponseDef {
  const ql = q.toLowerCase()
  if (ql.includes('gast') || ql.includes('consum')) return RESPONSES.gasto
  if (ql.includes('compar') || ql.includes('electro') || ql.includes('vs')) return RESPONSES.comparar
  if (ql.includes('unidad') || ql.includes('jmx') || ql.includes('mejor')) return RESPONSES.unidad
  return RESPONSES.default
}

export function AgentChatPage() {
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)

  const ask = (text: string) => {
    if (busy) return
    const userMsg: ChatMsg = { id: nid(), role: 'user', text }
    const toolId = nid()
    const toolMsg: ChatMsg = {
      id: toolId,
      role: 'agent',
      tool: { label: 'Consultando datos de flota', icon: 'search', status: 'running' },
    }
    setMessages(m => [...m, userMsg, toolMsg])
    setDraft('')
    setBusy(true)

    setTimeout(() => {
      const resp = pickResponse(text)
      setMessages(m =>
        m.map(x =>
          x.id === toolId
            ? {
                ...x,
                tool: { ...x.tool!, status: 'done' as const },
                text: resp.text,
                content: resp.content?.(),
              }
            : x,
        ),
      )
      setBusy(false)
    }, 1100)
  }

  return (
    <div className={css.container}>
      <Breadcrumb items={[{ label: 'Flota' }, { label: 'Asistente' }]} />

      <div className={css.header}>
        <div className={css.agentAvatar}>
          <span className={`flow-symbol ${css.agentAvatarIcon}`} aria-hidden="true">bolt</span>
        </div>
        <div>
          <div className={css.agentName}>Asistente de flota</div>
          <div className={css.agentDesc}>Pregunta sobre unidades, gastos y comparativas</div>
        </div>
      </div>

      <div className={css.threadArea}>
        <ChatThread
          messages={messages}
          emptyState={
            <EmptyState
              icon="forum"
              title="¿Qué quieres saber de tu flota?"
              description="Pregunta en lenguaje natural — el asistente responde con datos reales, no solo texto."
            />
          }
        />
      </div>

      <div className={css.composerArea}>
        <ChatComposer
          value={draft}
          onChange={setDraft}
          onSend={ask}
          disabled={busy}
          suggestions={
            messages.length === 0
              ? ['¿Cuánto gasté este mes?', 'Compara combustible vs electromovilidad', '¿Cuál es mi mejor unidad?']
              : []
          }
        />
      </div>
    </div>
  )
}
