"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ToastContext = createContext(null);

const icons = {
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  ),
};

const Close = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback((input) => {
    const id = ++toastIdCounter;
    const normalized = typeof input === "string"
      ? { message: input, variant: "info", duration: 4000 }
      : { variant: "info", duration: 4000, ...input };
    setToasts((prev) => [...prev, { ...normalized, id }]);
    if (normalized.duration > 0) {
      const timer = setTimeout(() => dismiss(id), normalized.duration);
      timers.current.set(id, timer);
    }
    return id;
  }, [dismiss]);

  useEffect(() => () => {
    for (const t of timers.current.values()) clearTimeout(t);
    timers.current.clear();
  }, []);

  const value = { toast, dismiss };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== "undefined" && createPortal(
        <div className="flg-toast-root" role="region" aria-label="Notifications">
          {toasts.map((t) => (
            <Toast key={t.id} toast={t} onClose={() => dismiss(t.id)} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function Toast({ toast: t, onClose }) {
  const variant = t.variant || "info";
  const role = variant === "error" || variant === "warning" ? "alert" : "status";
  return (
    <div className={`flg-toast flg-toast-${variant}`} role={role}>
      <span className="flg-toast-icon">{icons[variant]}</span>
      <div className="flg-toast-body">
        {t.title && <div className="flg-toast-title">{t.title}</div>}
        {t.message && <div className="flg-toast-desc">{t.message}</div>}
      </div>
      <button type="button" className="flg-toast-close" onClick={onClose} aria-label="Dismiss notification">
        <Close />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside a <ToastProvider>");
  return ctx;
}

export default Toast;
