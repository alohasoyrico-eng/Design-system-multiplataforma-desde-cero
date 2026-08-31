import { useState, useMemo, type CSSProperties } from 'react'
import { useIntl } from 'react-intl'
import css from './HelpCenter.module.css'

export interface HelpArticle {
  id: string
  title: string
  category?: string
  content?: string
  keywords?: string[]
}

export interface HelpCenterProps {
  articles: HelpArticle[]
  style?: CSSProperties
}

export function HelpCenter({ articles, style }: HelpCenterProps) {
  const intl = useIntl()
  const generalLabel = intl.formatMessage({ id: 'common.general', defaultMessage: 'General' })
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(articles[0]?.id || null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const categories = useMemo(() => {
    const cats = new Set(articles.map((a) => a.category || generalLabel))
    return Array.from(cats).sort()
  }, [articles])

  const filtered = useMemo(() => {
    if (!search) return articles
    const q = search.toLowerCase()
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.category || '').toLowerCase().includes(q) ||
        a.keywords?.some((k) => k.toLowerCase().includes(q)) ||
        (a.content || '').toLowerCase().includes(q),
    )
  }, [articles, search])

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const selectedArticle = articles.find((a) => a.id === selectedId)

  return (
    <div className={css.root} style={style}>
      <div className={css.sidebar}>
        <div className={css.searchWrap}>
          <input
            type="text"
            aria-label="Buscar artículos de ayuda"
            placeholder="Busca…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={css.searchInput}
          />
        </div>
        <div className={css.articleList}>
          {search ? (
            <>
              <div className={css.resultCount} aria-live="polite">
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
              </div>
              {filtered.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  {filtered.map((article) => (
                    <button
                      key={article.id}
                      type="button"
                      className={css.searchResult}
                      data-active={selectedId === article.id || undefined}
                      onClick={() => setSelectedId(article.id)}
                    >
                      <div className={css.resultTitle}>{article.title}</div>
                      <div className={css.resultCat}>{article.category}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className={css.noResults}>
                  Sin resultados. Intenta con otro término o contacta soporte.
                </div>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {categories.map((cat) => {
                const catArticles = articles.filter((a) => (a.category || generalLabel) === cat)
                const isExpanded = expandedCategories.has(cat)
                return (
                  <div key={cat}>
                    <button
                      type="button"
                      className={css.catToggle}
                      aria-expanded={isExpanded}
                      onClick={() => toggleCategory(cat)}
                    >
                      <span
                        className={`flow-icon ${css.catChevron}`}
                        data-open={isExpanded || undefined}
                      >
                        chevron_right
                      </span>
                      {cat}
                    </button>
                    {isExpanded && (
                      <div className={css.catChildren}>
                        {catArticles.map((article) => (
                          <button
                            key={article.id}
                            type="button"
                            className={css.articleBtn}
                            data-active={selectedId === article.id || undefined}
                            onClick={() => setSelectedId(article.id)}
                          >
                            {article.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className={css.content}>
        {selectedArticle ? (
          <div>
            <span className={css.contentCategory}>{selectedArticle.category}</span>
            <h2 className={css.contentTitle}>{selectedArticle.title}</h2>
            {selectedArticle.content && (
              <div className={css.contentBody}>
                {selectedArticle.content
                  .split('\n')
                  .filter((p) => p.trim())
                  .map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
              </div>
            )}
            {selectedArticle.keywords && selectedArticle.keywords.length > 0 && (
              <div className={css.tags}>
                <span className={css.tagLabel}>Tags:</span>
                {selectedArticle.keywords.map((tag) => (
                  <span key={tag} className={css.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className={css.emptyContent}>Selecciona un artículo</div>
        )}
      </div>
    </div>
  )
}
