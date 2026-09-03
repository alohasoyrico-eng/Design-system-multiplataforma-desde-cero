import React from 'react';

/** Help Center pattern: sidebar de navegación + contenido + búsqueda. */
export function HelpCenter({
  articles = [], style
}) {
  // articles: [{id, category, title, content, keywords}]
  const [search, setSearch] = React.useState('');
  const [selectedId, setSelectedId] = React.useState(articles[0]?.id || null);
  const [expandedCategories, setExpandedCategories] = React.useState(new Set());

  const categories = React.useMemo(() => {
    const cats = new Set(articles.map(a => a.category));
    return Array.from(cats).sort();
  }, [articles]);

  const filtered = React.useMemo(() => {
    if (!search) return articles;
    const query = search.toLowerCase();
    return articles.filter(a =>
      a.title.toLowerCase().includes(query) ||
      a.category.toLowerCase().includes(query) ||
      a.keywords?.some(k => k.toLowerCase().includes(query)) ||
      a.content.toLowerCase().includes(query)
    );
  }, [articles, search]);

  const toggleCategory = (cat) => {
    const next = new Set(expandedCategories);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setExpandedCategories(next);
  };

  const selectedArticle = articles.find(a => a.id === selectedId);

  return React.createElement('div', {
    style: {
      display: 'flex', gap: 0, background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
      overflow: 'hidden', boxShadow: 'var(--shadow-rest)', minHeight: 600,
      ...style
    }
  },
    // Sidebar
    React.createElement('div', {
      style: {
        width: 280, flexShrink: 0, background: 'var(--surface-sunken)',
        borderRight: '1px solid var(--border-subtle)', overflow: 'auto',
        display: 'flex', flexDirection: 'column',
      }
    },
      // Búsqueda
      React.createElement('div', {
        style: { padding: '16px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }
      },
        React.createElement('input', {
          type: 'text', placeholder: 'Busca…',
          value: search,
          onChange: (e) => setSearch(e.target.value),
          style: {
            width: '100%', minHeight: 'var(--hit-target-min)', boxSizing: 'border-box',
            border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)',
            padding: '0 12px', fontFamily: 'var(--font-body)', fontSize: 13,
            background: 'var(--surface-card)', outline: 'none',
          }
        })
      ),
      // Listado de artículos
      React.createElement('div', {
        style: { flex: 1, overflow: 'auto', padding: '8px' }
      },
        search ? (
          // Resultados de búsqueda
          React.createElement('div', {
            style: { display: 'flex', flexDirection: 'column', gap: 4 }
          },
            filtered.length > 0 ? filtered.map((article) => React.createElement('button', {
              key: article.id, type: 'button',
              onClick: () => setSelectedId(article.id),
              style: {
                display: 'block', width: '100%', textAlign: 'left', border: 'none',
                background: selectedId === article.id ? 'var(--surface-accent-subtle)' : 'transparent',
                borderRadius: 'var(--radius-sm)', padding: '10px 12px',
                cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13,
                color: selectedId === article.id ? 'var(--text-accent)' : 'var(--text-primary)',
                transition: 'all var(--dur-fast) var(--ease-out)',
              }
            },
              React.createElement('div', { style: { fontWeight: 600, marginBottom: 2 } }, article.title),
              React.createElement('div', { style: { fontSize: 11, color: 'var(--text-muted)' } }, article.category)
            )) : React.createElement('div', {
              style: { padding: '16px 12px', textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }
            }, 'Sin resultados')
          )
        ) : (
          // Navegación por categorías
          React.createElement('div', {
            style: { display: 'flex', flexDirection: 'column', gap: 0 }
          },
            categories.map((cat) => {
              const catArticles = filtered.filter(a => a.category === cat);
              const isExpanded = expandedCategories.has(cat) || search;
              return React.createElement('div', {
                key: cat,
              },
                React.createElement('button', {
                  type: 'button',
                  onClick: () => toggleCategory(cat),
                  style: {
                    display: 'flex', alignItems: 'center', gap: 8, width: '100%', border: 'none',
                    background: 'transparent', padding: '10px 12px',
                    cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                    color: 'var(--text-muted)', textAlign: 'left',
                    transition: 'color var(--dur-fast) var(--ease-out)',
                  }
                },
                  React.createElement('span', { className: 'flow-symbol', style: { fontSize: 14, transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-spring)' } }, 'chevron_right'),
                  cat
                ),
                isExpanded && React.createElement('div', {
                  style: { display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 8, paddingBottom: 4 }
                },
                  catArticles.map((article) => React.createElement('button', {
                    key: article.id, type: 'button',
                    onClick: () => setSelectedId(article.id),
                    style: {
                      display: 'block', width: '100%', textAlign: 'left', border: 'none',
                      background: selectedId === article.id ? 'var(--surface-accent-subtle)' : 'transparent',
                      borderRadius: 'var(--radius-sm)', padding: '8px 12px',
                      cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12,
                      color: selectedId === article.id ? 'var(--text-accent)' : 'var(--text-primary)',
                      transition: 'all var(--dur-fast) var(--ease-out)',
                    }
                  }, article.title))
                )
              );
            })
          )
        )
      )
    ),

    // Contenido
    React.createElement('div', {
      style: {
        flex: 1, padding: '32px', overflow: 'auto',
        display: 'flex', flexDirection: 'column', gap: 16,
      }
    },
      selectedArticle ? (
        React.createElement('div', {},
          React.createElement('span', {
            style: { fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 'var(--tracking-overline)', color: 'var(--text-muted)' }
          }, selectedArticle.category),
          React.createElement('h2', {
            style: { margin: '8px 0 0 0', fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }
          }, selectedArticle.title),
          React.createElement('div', {
            style: {
              marginTop: 24, fontSize: 14, lineHeight: 1.8, color: 'var(--text-primary)',
              display: 'flex', flexDirection: 'column', gap: 12,
            }
          },
            selectedArticle.content.split('\n').filter(p => p.trim()).map((paragraph, i) => React.createElement('p', {
              key: i, style: { margin: 0 }
            }, paragraph))
          ),
          selectedArticle.keywords && React.createElement('div', {
            style: { marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 6, flexWrap: 'wrap' }
          },
            React.createElement('span', { style: { fontSize: 11, color: 'var(--text-muted)' } }, 'Tags:'),
            selectedArticle.keywords.map((tag) => React.createElement('span', {
              key: tag,
              style: {
                fontSize: 11, padding: '4px 8px', background: 'var(--surface-sunken)',
                borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)'
              }
            }, tag))
          )
        )
      ) : (
        React.createElement('div', {
          style: { textAlign: 'center', color: 'var(--text-muted)' }
        }, 'Selecciona un artículo')
      )
    )
  );
}
