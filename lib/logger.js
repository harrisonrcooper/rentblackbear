// lib/logger.js
// Structured logger — console in dev, extensible for external services in production.

/**
 * Emit a structured log entry.
 * @param {"info"|"warn"|"error"} level
 * @param {string} context - route, component, or module name (e.g. "cron/daily", "TierGate")
 * @param {string} message - human-readable description
 * @param {object} meta - arbitrary key-value metadata
 */
export function log(level, context, message, meta = {}) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    ctx: context,
    msg: message,
    ...meta,
  };

  if (level === "error") console.error(JSON.stringify(entry));
  else if (level === "warn") console.warn(JSON.stringify(entry));
  else console.log(JSON.stringify(entry));

  // TODO: send to Sentry/Datadog/custom endpoint in production
}

/** Convenience helpers */
export const info = (ctx, msg, meta) => log("info", ctx, msg, meta);
export const warn = (ctx, msg, meta) => log("warn", ctx, msg, meta);
export const error = (ctx, msg, meta) => log("error", ctx, msg, meta);
