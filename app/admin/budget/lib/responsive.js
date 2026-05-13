// Reactive responsive helper. Returns true when the viewport is below
// the desktop sidebar breakpoint. Listens to matchMedia for resize +
// orientation changes without forcing a poll loop.

"use client";

import { useEffect, useState } from "react";

const MOBILE_QUERY = "(max-width: 899px)";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(MOBILE_QUERY);
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);
  return isMobile;
}
