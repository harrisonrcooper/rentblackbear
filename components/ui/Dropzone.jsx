"use client";
import { useRef, useState } from "react";

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

export default function Dropzone({
  accept,
  multiple = false,
  maxSizeBytes,
  disabled = false,
  onFiles,
  onReject,
  title = "Drop files here or click to browse",
  hint,
  icon,
  className = "",
  children,
  ...rest
}) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const validateAndEmit = (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    const accepted = [];
    const rejected = [];
    for (const f of files) {
      if (maxSizeBytes && f.size > maxSizeBytes) {
        rejected.push({ file: f, reason: "too-large" });
        continue;
      }
      accepted.push(f);
    }
    if (rejected.length && onReject) onReject(rejected);
    if (accepted.length && onFiles) onFiles(multiple ? accepted : [accepted[0]]);
  };

  const onChange = (e) => {
    validateAndEmit(e.target.files);
    e.target.value = "";
  };

  const onDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setDragActive(true);
  };
  const onDragLeave = () => setDragActive(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (disabled) return;
    validateAndEmit(e.dataTransfer.files);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  const classes = [
    "flg-dropzone",
    dragActive ? "flg-dropzone-active" : "",
    disabled ? "flg-dropzone-disabled" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      {...rest}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={onChange}
        tabIndex={-1}
      />
      {children ?? (
        <>
          <div className="flg-dropzone-icon">{icon || <UploadIcon />}</div>
          <div className="flg-dropzone-title">{title}</div>
          {hint && <div className="flg-dropzone-hint">{hint}</div>}
        </>
      )}
    </div>
  );
}
