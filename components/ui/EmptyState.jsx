"use client";

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
  ...rest
}) {
  const classes = ["flg-empty", className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...rest}>
      {icon && <div className="flg-empty-icon">{icon}</div>}
      {title && <h3 className="flg-empty-title">{title}</h3>}
      {description && <p className="flg-empty-desc">{description}</p>}
      {action && <div className="flg-empty-action">{action}</div>}
    </div>
  );
}
