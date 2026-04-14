"use client";

export function Kanban({ className = "", children, ...rest }) {
  const classes = ["flg-kanban", className].filter(Boolean).join(" ");
  return <div className={classes} role="list" {...rest}>{children}</div>;
}

export function KanbanColumn({
  title,
  count,
  color = "gray",
  footer,
  className = "",
  children,
  ...rest
}) {
  const classes = ["flg-kanban-col", className].filter(Boolean).join(" ");
  return (
    <section className={classes} role="listitem" {...rest}>
      <header className="flg-kanban-col-head">
        <div className="flg-kanban-col-title-wrap">
          <span className={`flg-kanban-col-dot flg-kanban-col-dot-${color}`} aria-hidden="true" />
          <span className="flg-kanban-col-title">{title}</span>
        </div>
        {count !== undefined && <span className="flg-kanban-col-count">{count}</span>}
      </header>
      <div className="flg-kanban-col-body">{children}</div>
      {footer && <footer className="flg-kanban-col-foot">{footer}</footer>}
    </section>
  );
}

export function KanbanCard({
  title,
  meta,
  footer,
  onClick,
  dragging = false,
  className = "",
  children,
  ...rest
}) {
  const classes = [
    "flg-kanban-card",
    dragging ? "flg-kanban-card-dragging" : "",
    onClick ? "flg-kanban-card-clickable" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <article
      className={classes}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(e); } } : undefined}
      {...rest}
    >
      {children ?? (
        <>
          {title && <div className="flg-kanban-card-title">{title}</div>}
          {meta && <div className="flg-kanban-card-meta">{meta}</div>}
          {footer && <div className="flg-kanban-card-foot">{footer}</div>}
        </>
      )}
    </article>
  );
}

export default Kanban;
