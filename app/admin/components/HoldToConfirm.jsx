"use client";
import { useState, useRef, useEffect } from "react";

/**
 * Click-and-hold button for destructive actions.
 * User holds the button for `duration` ms while a progress bar fills up,
 * then fires `onConfirm`. Releasing early resets progress.
 */
export default function HoldToConfirm({
  onConfirm,
  disabled = false,
  duration = 2500,
  label = "Hold to Delete",
  holdingLabel = "Keep holding...",
  almostLabel = "Release!",
  color = "#dc2626",
  icon = null,
  style = {},
}) {
  const [progress, setProgress] = useState(0); // 0..1
  const [holding, setHolding] = useState(false);
  const startRef = useRef(0);
  const rafRef = useRef(null);
  const firedRef = useRef(false);

  const tick = () => {
    const elapsed = Date.now() - startRef.current;
    const p = Math.min(1, elapsed / duration);
    setProgress(p);
    if (p >= 1) {
      if (!firedRef.current) {
        firedRef.current = true;
        setHolding(false);
        onConfirm && onConfirm();
      }
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  };

  const start = (e) => {
    if (disabled) return;
    e.preventDefault();
    firedRef.current = false;
    startRef.current = Date.now();
    setHolding(true);
    rafRef.current = requestAnimationFrame(tick);
  };

  const cancel = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (!firedRef.current) {
      setHolding(false);
      setProgress(0);
    }
  };

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const currentLabel = !holding ? label : progress > 0.85 ? almostLabel : holdingLabel;

  return (
    <button
      onMouseDown={start}
      onMouseUp={cancel}
      onMouseLeave={cancel}
      onTouchStart={start}
      onTouchEnd={cancel}
      onTouchCancel={cancel}
      disabled={disabled}
      style={{
        position: "relative",
        overflow: "hidden",
        background: disabled ? "#e5e7eb" : color,
        color: "#fff",
        border: "none",
        borderRadius: 7,
        padding: "10px 18px",
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "inherit",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? .5 : 1,
        transition: "box-shadow .15s",
        boxShadow: holding ? `0 0 0 3px ${color}33` : "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "none",
        ...style,
      }}
    >
      {/* Progress fill */}
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: `${progress * 100}%`,
        background: "rgba(0,0,0,.22)",
        transition: holding ? "none" : "width .2s",
        pointerEvents: "none",
      }} />
      {/* Label + icon */}
      <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 6, zIndex: 1 }}>
        {icon}
        {currentLabel}
      </span>
    </button>
  );
}
