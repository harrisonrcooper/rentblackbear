"use client";
import { forwardRef, useId } from "react";
import Field from "./Field";

const Input = forwardRef(function Input(
  {
    label,
    hint,
    error,
    required = false,
    iconLeft = null,
    iconRight = null,
    className = "",
    id: idProp,
    ...rest
  },
  ref
) {
  const autoId = useId();
  const id = idProp || autoId;
  const inputClasses = [
    "flg-input",
    error ? "flg-input-error" : "",
    className,
  ].filter(Boolean).join(" ");
  const wrapClasses = [
    "flg-input-wrap",
    iconLeft ? "flg-input-wrap-icon-left" : "",
    iconRight ? "flg-input-wrap-icon-right" : "",
  ].filter(Boolean).join(" ");

  return (
    <Field label={label} required={required} hint={hint} error={error} htmlFor={id}>
      <div className={wrapClasses}>
        {iconLeft && <span className="flg-input-icon flg-input-icon-left">{iconLeft}</span>}
        <input
          ref={ref}
          id={id}
          className={inputClasses}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          required={required}
          {...rest}
        />
        {iconRight && <span className="flg-input-icon flg-input-icon-right">{iconRight}</span>}
      </div>
    </Field>
  );
});

export default Input;
