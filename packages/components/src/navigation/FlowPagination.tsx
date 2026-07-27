import { FlowIcon } from "@flowds/primitives";
import "../../css/navigation/Pagination.css";

export interface FlowPaginationProps {
  /** Current page, 1-based. */
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  ariaLabel?: string;
}

/** Build a compact page list with ellipsis gaps: 1 … 4 5 6 … 20. */
function pageList(page: number, count: number): (number | "…")[] {
  const pages = new Set<number>([1, count, page, page - 1, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= count).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

/** FlowPagination — paged navigation with ellipsis. Numbers in mono. */
export function FlowPagination({
  page,
  pageCount,
  onChange,
  ariaLabel = "Paginación",
}: FlowPaginationProps) {
  return (
    <nav className="flow-pagination" aria-label={ariaLabel}>
      <button
        type="button"
        className="flow-pagination__nav"
        aria-label="Página anterior"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <FlowIcon name="chevron_left" size="md" />
      </button>
      {pageList(page, pageCount).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="flow-pagination__gap" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className="flow-pagination__item"
            data-active={p === page || undefined}
            aria-current={p === page ? "page" : undefined}
            aria-label={`Página ${p}`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        className="flow-pagination__nav"
        aria-label="Página siguiente"
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
      >
        <FlowIcon name="chevron_right" size="md" />
      </button>
    </nav>
  );
}
