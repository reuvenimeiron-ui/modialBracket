// ============================================================
// Table — generic read-only data table
//
// Usage:
//   <Table
//     columns={[{ key: 'name', header: 'Name' }, { key: 'pts', header: 'Points' }]}
//     rows={[{ name: 'Alice', pts: 12 }]}
//   />
// ============================================================

import './Table.css';

export interface TableColumn<T> {
  /** Key into the row object */
  key: keyof T;
  /** Column header label */
  header: string;
  /** Optional custom cell renderer */
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T extends Record<string, unknown>> {
  columns: TableColumn<T>[];
  rows: T[];
  /** Optional key extractor; defaults to row index */
  rowKey?: (row: T, index: number) => string | number;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  rows,
  rowKey,
}: TableProps<T>) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={String(col.key)}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                No data
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={rowKey ? rowKey(row, i) : i}>
                {columns.map(col => (
                  <td key={String(col.key)}>
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
