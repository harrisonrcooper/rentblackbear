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

export default function Drawer({
  open,
  onClose,
  title,
  subtitle,
  header,
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

  const panelClasses = [
    "flg-drawer",
    `flg-drawer-${size}`,
    className,
  ].filter(Boolean).join(" ");

  return createPortal(
    <div className="flg-drawer-root" role="presentation">
      <div
        className="flg-drawer-backdrop"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />
      <aside
        ref={panelRef}
        className={panelClasses}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title}
        tabIndex={-1}
      >
        {header ?? (
          (title || subtitle || onClose) && (
            <div className="flg-drawer-head">
              <div className="flg-drawer-title-wrap">
                {title && <h2 className="flg-drawer-title">{title}</h2>}
                {subtitle && <p className="flg-drawer-subtitle">{subtitle}</p>}
              </div>
              {onClose && (
                <button
                  type="button"
                  className="flg-drawer-close"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          )
        )}
        <div className="flg-drawer-body">{children}</div>
        {footer && <div className="flg-drawer-foot">{footer}</div>}
      </aside>
    </div>,
    document.body
  );
}
