import { useState, useRef, useEffect } from 'react'
import { Breadcrumb } from '@alohasoyrico-eng/flow-react'
import { MAIL_TEMPLATES } from './mailings-data'
import css from './MailingsPage.module.css'

type Viewport = 'desktop' | 'mobile'

export function MailingsPage() {
  const [active, setActive] = useState(MAIL_TEMPLATES[0].id)
  const [viewport, setViewport] = useState<Viewport>('desktop')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const template = MAIL_TEMPLATES.find(t => t.id === active)!

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const doc = iframe.contentDocument
    if (!doc) return
    doc.open()
    doc.write(template.html)
    doc.close()
  }, [template.html])

  return (
    <div className={css.container}>
      <Breadcrumb items={[{ label: 'Templates' }, { label: 'Mailings' }]} />

      <div className={css.header}>
        <h1 className={css.title}>Mailings</h1>
        <p className={css.subtitle}>Correos transaccionales — HTML de tablas, estilos en línea, sin componentes del sistema.</p>
      </div>

      <div className={css.toolbar}>
        {MAIL_TEMPLATES.map(t => (
          <button
            key={t.id}
            className={css.templateBtn}
            data-active={t.id === active ? '' : undefined}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}

        <div className={css.viewToggle}>
          <button
            className={css.viewBtn}
            data-active={viewport === 'desktop' ? '' : undefined}
            onClick={() => setViewport('desktop')}
          >
            Desktop
          </button>
          <button
            className={css.viewBtn}
            data-active={viewport === 'mobile' ? '' : undefined}
            onClick={() => setViewport('mobile')}
          >
            Mobile
          </button>
        </div>
      </div>

      <iframe
        ref={iframeRef}
        title={`Preview: ${template.label}`}
        className={`${css.previewFrame} ${viewport === 'mobile' ? css.mobileFrame : ''}`}
        sandbox="allow-same-origin"
      />
    </div>
  )
}
