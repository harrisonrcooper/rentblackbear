"use client";
import { forwardRef, useId } from "react";
import Field from "./Field";

const Chevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const Select = forwardRef(function Select(
  {
    label,
    hint,
    error,
    required = false,
    options,
    placeholder,
    className = "",
    id: idProp,
    children,
    ...rest
  },
  ref
) {
  const autoId = useId();
  const id = idProp || autoId;
  const classes = [
    "flg-select",
    error ? "flg-select-error" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <Field label={label} required={required} hint={hint} error={error} htmlFor={id}>
      <div className="flg-select-wrap">
        <select
          ref={ref}
          id={id}
          className={classes}
          aria-invalid={error ? "true" : undefined}
          required={required}
          {...rest}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options
            ? options.map((opt) =>
                typeof opt === "string"
                  ? <option key={opt} value={opt}>{opt}</option>
                  : <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>
              )
            : children}
        </select>
        <span className="flg-select-chevron"><Chevron /></span>
      </div>
    </Field>
  );
});

export default Select;
