"use client";

export default function Pill({
  variant = "gray",
  icon = null,
  className = "",
  children,
  ...rest
}) {
  const classes = [
    "flg-pill",
    `flg-pill-${variant}`,
    className,
  ].filter(Boolean).join(" ");

  return (
    <span className={classes} {...rest}>
      {icon}
      {children}
    </span>
  );
}
