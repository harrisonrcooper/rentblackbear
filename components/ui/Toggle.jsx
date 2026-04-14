"use client";
import { forwardRef, useId } from "react";

const Toggle = forwardRef(function Toggle(
  { label, description, disabled = false, className = "", id: idProp, ...rest },
  ref
) {
  const autoId = useId();
  const id = idProp || autoId;
  const wrapClasses = [
    "flg-choice",
    disabled ? "flg-choice-disabled" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <label className={wrapClasses} htmlFor={id}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        role="switch"
        className="flg-toggle"
        disabled={disabled}
        {...rest}
      />
      {(label || description) && (
        <span>
          {label && <span>{label}</span>}
          {description && <span className="flg-field-hint" style={{display:"block", marginTop:2}}>{description}</span>}
        </span>
      )}
    </label>
  );
});

export default Toggle;
