"use client";
import { forwardRef } from "react";

const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    icon = null,
    iconPosition = "left",
    loading = false,
    disabled = false,
    type = "button",
    className = "",
    children,
    ...rest
  },
  ref
) {
  const classes = [
    "flg-btn",
    `flg-btn-${variant}`,
    `flg-btn-${size}`,
    className,
  ].filter(Boolean).join(" ");

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="flg-btn-spinner" aria-hidden="true" />}
      {!loading && icon && iconPosition === "left" && icon}
      {children}
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
});

export default Button;
