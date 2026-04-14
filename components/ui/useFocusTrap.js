"use client";
import { useEffect } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

// Keeps Tab / Shift-Tab inside `containerRef.current` while `active`.
// Moves focus into the container on activation, restores to the previous
// active element on deactivation. Shared by Drawer + Modal.
export default function useFocusTrap(containerRef, active) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = typeof document !== "undefined" ? document.activeElement : null;

    // Defer initial focus until the node is actually in the DOM.
    const initialFocusTimer = setTimeout(() => {
      const focusables = container.querySelectorAll(FOCUSABLE);
      const first = focusables[0];
      if (first) first.focus();
      else container.focus();
    }, 0);

    const onKeyDown = (e) => {
      if (e.key !== "Tab") return;
      const focusables = Array.from(container.querySelectorAll(FOCUSABLE))
        .filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement);
      if (focusables.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(initialFocusTimer);
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    };
  }, [containerRef, active]);
}
