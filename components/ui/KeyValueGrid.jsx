"use client";

export function KeyValueRow({ label, value, className = "", ...rest }) {
  const classes = ["flg-kv-row", className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...rest}>
      <span className="flg-kv-label">{label}</span>
      <span className="flg-kv-value">{value}</span>
    </div>
  );
}

export default function KeyValueGrid({
  items,
  columns = 1,
  dense = false,
  stacked = false,
  className = "",
  children,
  ...rest
}) {
  const classes = [
    "flg-kv",
    `flg-kv-columns-${columns}`,
    dense ? "flg-kv-dense" : "",
    stacked ? "flg-kv-stacked" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <dl className={classes} {...rest}>
      {items
        ? items.map((item, i) => (
            <KeyValueRow
              key={item.key ?? item.label ?? i}
              label={item.label}
              value={item.value}
            />
          ))
        : children}
    </dl>
  );
}

KeyValueGrid.Row = KeyValueRow;
