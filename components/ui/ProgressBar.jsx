"use client";

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = false,
  formatValue,
  size = "md",
  variant = "default",
  className = "",
  ...rest
}) {
  const pct = clamp((value / max) * 100, 0, 100);
  const classes = [
    "flg-progress",
    `flg-progress-${size}`,
    variant !== "default" ? `flg-progress-${variant}` : "",
    className,
  ].filter(Boolean).join(" ");

  const displayValue = formatValue
    ? formatValue(value, max)
    : `${Math.round(pct)}%`;

  return (
    <div className={classes} {...rest}>
      {(label || showValue) && (
        <div className="flg-progress-head">
          {label && <span className="flg-progress-label">{label}</span>}
          {showValue && <span className="flg-progress-value">{displayValue}</span>}
        </div>
      )}
      <div
        className="flg-progress-track"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div className="flg-progress-fill" style={{width: `${pct}%`}} />
      </div>
    </div>
  );
}
