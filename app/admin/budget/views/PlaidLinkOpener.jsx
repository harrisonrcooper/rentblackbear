"use client";

// Plaid Link opener — extracted to its own module so the
// react-plaid-link iframe shim (~10 kB) only loads after the user
// clicks "Connect a bank". The parent passes a fetched link token and
// onSuccess / onExit callbacks; this component mounts the hook,
// auto-fires `open` once Plaid signals ready, and renders nothing.
//
// Why a separate file vs an inline dynamic() inside BudgetClient:
// `next/dynamic` resolves at module level, so isolating the
// react-plaid-link import lets the bundler emit a clean async chunk
// instead of pulling the library into the main /admin/budget bundle.

import { useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";

export default function PlaidLinkOpener({ token, onSuccess, onExit }) {
  const { open, ready } = usePlaidLink({ token, onSuccess, onExit });
  useEffect(() => {
    if (ready) open();
  }, [ready, open]);
  return null;
}
