import type { ReactNode } from "react";
import "../../css/data/KanbanBoard.css";

export interface KanbanCard {
  id: string;
  title: ReactNode;
  meta?: ReactNode;
  /** Accent the card's left edge (e.g. at-risk). */
  tone?: "neutral" | "warning" | "danger";
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

export interface FlowKanbanBoardProps {
  columns: KanbanColumn[];
  ariaLabel?: string;
}

/** FlowKanbanBoard — funnel columns with cards. Read-only presentation. */
export function FlowKanbanBoard({ columns, ariaLabel = "Tablero" }: FlowKanbanBoardProps) {
  return (
    <div className="flow-kanban" role="group" aria-label={ariaLabel}>
      {columns.map((col) => (
        <section key={col.id} className="flow-kanban__column" aria-label={col.title}>
          <header className="flow-kanban__col-head">
            <span className="flow-kanban__col-title">{col.title}</span>
            <span className="flow-kanban__count">{col.cards.length}</span>
          </header>
          <div className="flow-kanban__cards">
            {col.cards.map((card) => (
              <article key={card.id} className="flow-kanban__card" data-tone={card.tone}>
                <span className="flow-kanban__card-title">{card.title}</span>
                {card.meta && <span className="flow-kanban__card-meta">{card.meta}</span>}
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
