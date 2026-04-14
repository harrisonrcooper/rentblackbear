"use client";

// Shared field wrapper used by Input / Textarea / Select and the
// choice controls. Handles label + hint + error slot.
export default function Field({ label, required = false, hint, error, htmlFor, className = "", children }) {
  const classes = ["flg-field", className].filter(Boolean).join(" ");
  return (
    <div className={classes}>
      {label && (
        <label className="flg-field-label" htmlFor={htmlFor}>
          {label}
          {required && <span className="flg-field-required" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {!error && hint && <div className="flg-field-hint">{hint}</div>}
      {error && <div className="flg-field-error" role="alert">{error}</div>}
    </div>
  );
}
