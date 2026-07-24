import type { ReactNode } from "react";
import "../../css/data/Table.css";

export interface TableColumn<Row> {
  key: keyof Row & string;
  header: ReactNode;
  align?: "start" | "end" | "center";
  /** Render this column's cells in JetBrains Mono (IDs, plates, amounts). */
  mono?: boolean;
  /** Custom cell renderer. */
  render?: (row: Row) => ReactNode;
}

export interface FlowTableProps<Row> {
  columns: TableColumn<Row>[];
  rows: Row[];
  /** Accessible caption for the table. */
  caption: string;
  /** Unique key accessor for a row. */
  rowKey: (row: Row) => string;
  onRowClick?: (row: Row) => void;
}

/** FlowTable — semantic data table. Data-heavy columns opt into mono via `mono`. */
export function FlowTable<Row>({
  columns,
  rows,
  caption,
  rowKey,
  onRowClick,
}: FlowTableProps<Row>) {
  return (
    <div className="flow-table-wrap">
      <table className="flow-table">
        <caption className="flow-table__caption">{caption}</caption>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col" data-align={col.align}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              data-clickable={onRowClick ? true : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((col) => (
                <td key={col.key} data-align={col.align} data-mono={col.mono || undefined}>
                  {col.render ? col.render(row) : (row[col.key] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
