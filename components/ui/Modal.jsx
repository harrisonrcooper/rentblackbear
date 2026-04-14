"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import useFocusTrap from "./useFocusTrap";

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  footer,
  size = "md",
  closeOnBackdrop = true,
  closeOnEscape = true,
  children,
  className = "",
  ariaLabel,
}) {
  const panelRef = useRef(null);
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (closeOnEscape && e.key === "Escape") {
        e.stopPropagation();
        onClose?.();
      }
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, closeOnEscape]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  const classes = [
    "flg-modal",
    `flg-modal-${size}`,
    className,
  ].filter(Boolean).join(" ");

  return createPortal(
    <div className="flg-modal-root" role="presentation">
      <div
        className="flg-modal-backdrop"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className={classes}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title}
        tabIndex={-1}
      >
        {(title || onClose) && (
          <div className="flg-modal-head">
            <div>
              {title && <h2 className="flg-modal-title">{title}</h2>}
              {subtitle && <p className="flg-modal-subtitle">{subtitle}</p>}
            </div>
            {onClose && (
              <button
                type="button"
                className="flg-modal-close"
                onClick={onClose}
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        )}
        <div className="flg-modal-body">{children}</div>
        {footer && <div className="flg-modal-foot">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
