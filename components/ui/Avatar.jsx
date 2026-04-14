"use client";
import { useState } from "react";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({
  src,
  alt,
  name = "",
  initials,
  size = "md",
  variant = "gradient",
  className = "",
  ...rest
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const computedInitials = initials ?? getInitials(name);

  const isNumericSize = typeof size === "number";
  const classes = [
    "flg-avatar",
    isNumericSize ? "" : `flg-avatar-${size}`,
    `flg-avatar-${variant}`,
    className,
  ].filter(Boolean).join(" ");

  const style = isNumericSize
    ? { width: size, height: size, fontSize: Math.round(size * 0.36) }
    : undefined;

  const showImage = src && !imageFailed;

  return (
    <span
      className={classes}
      style={style}
      role={showImage ? "img" : undefined}
      aria-label={showImage ? (alt || name) : undefined}
      {...rest}
    >
      {showImage
        ? <img src={src} alt={alt ?? name} onError={() => setImageFailed(true)} />
        : <span aria-hidden="true">{computedInitials}</span>}
    </span>
  );
}
