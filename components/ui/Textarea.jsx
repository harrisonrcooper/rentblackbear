"use client";
import { forwardRef, useId } from "react";
import Field from "./Field";

const Textarea = forwardRef(function Textarea(
  {
    label,
    hint,
    error,
    required = false,
    rows = 4,
    className = "",
    id: idProp,
    ...rest
  },
  ref
) {
  const autoId = useId();
  const id = idProp || autoId;
  const classes = [
    "flg-textarea",
    error ? "flg-textarea-error" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <Field label={label} required={required} hint={hint} error={error} htmlFor={id}>
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={classes}
        aria-invalid={error ? "true" : undefined}
        required={required}
        {...rest}
      />
    </Field>
  );
});

export default Textarea;
