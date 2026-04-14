"use client";
import { useMemo } from "react";
import Checkbox from "./Checkbox";

const SortIcon = ({ direction }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {direction === "asc" ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
  </svg>
);

const NeutralSortIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 9l4-4 4 4"/>
    <path d="M16 15l-4 4-4-4"/>
  </svg>
);

export default function DataTable({
  columns,
  rows,
  rowKey = "id",
  selectable = false,
  selectedIds,
  onSelectionChange,
  sort,
  onSortChange,
  emptyState = "No data.",
  onRowClick,
  className = "",
  ariaLabel,
}) {
  const idsInView = useMemo(() => rows.map((r) => r[rowKey]), [rows, rowKey]);
  const allSelected = selectable && selectedIds && idsInView.length > 0 && idsInView.every((id) => selectedIds.includes(id));
  const someSelected = selectable && selectedIds && selectedIds.length > 0 && !allSelected;

  const toggleAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) onSelectionChange([]);
    else onSelectionChange(idsInView);
  };
  const toggleOne = (id) => {
    if (!onSelectionChange) return;
    if (selectedIds?.includes(id)) onSelectionChange(selectedIds.filter((x) => x !== id));
    else onSelectionChange([...(selectedIds || []), id]);
  };

  const handleSort = (col) => {
    if (!col.sortable || !onSortChange) return;
    const nextDirection = sort?.key === col.key && sort?.direction === "asc" ? "desc" : "asc";
    onSortChange({ key: col.key, direction: nextDirection });
  };

  const classes = ["flg-table-wrap", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <table className="flg-table" aria-label={ariaLabel}>
        <thead>
          <tr>
            {selectable && (
              <th className="flg-table-select-cell">
                <Checkbox
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = someSelected; }}
                  onChange={toggleAll}
                  aria-label={allSelected ? "Deselect all rows" : "Select all rows"}
                />
              </th>
            )}
            {columns.map((col) => {
              const isSorted = sort?.key === col.key;
              const headClasses = [
                col.align === "right" ? "flg-table-align-right" : "",
                col.align === "center" ? "flg-table-align-center" : "",
                col.sortable ? "flg-table-sortable" : "",
              ].filter(Boolean).join(" ");
              return (
                <th
                  key={col.key}
                  className={headClasses}
                  style={col.width ? {width: col.width} : undefined}
                  onClick={col.sortable ? () => handleSort(col) : undefined}
                  aria-sort={isSorted ? (sort.direction === "asc" ? "ascending" : "descending") : col.sortable ? "none" : undefined}
                >
                  {col.header}
                  {col.sortable && (
                    <span className={`flg-table-sort-indicator ${isSorted ? "flg-table-sort-active" : ""}`}>
                      {isSorted ? <SortIcon direction={sort.direction} /> : <NeutralSortIcon />}
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td
                className="flg-table-empty"
                colSpan={columns.length + (selectable ? 1 : 0)}
              >
                {emptyState}
              </td>
            </tr>
          )}
          {rows.map((row) => {
            const id = row[rowKey];
            const isSelected = selectable && selectedIds?.includes(id);
            return (
              <tr
                key={id}
                className={isSelected ? "flg-table-row-selected" : ""}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                style={onRowClick ? {cursor: "pointer"} : undefined}
              >
                {selectable && (
                  <td className="flg-table-select-cell" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected || false}
                      onChange={() => toggleOne(id)}
                      aria-label={`Select row ${id}`}
                    />
                  </td>
                )}
                {columns.map((col) => {
                  const value = col.render
                    ? col.render(row[col.key], row)
                    : row[col.key];
                  const cellClasses = [
                    col.align === "right" ? "flg-table-align-right" : "",
                    col.align === "center" ? "flg-table-align-center" : "",
                  ].filter(Boolean).join(" ");
                  return (
                    <td key={col.key} className={cellClasses}>
                      {value}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
