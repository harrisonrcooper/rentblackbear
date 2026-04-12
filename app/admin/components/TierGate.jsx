"use client";

import { isFeatureEnabled, getRequiredTier } from "@/lib/features";

/**
 * Wrapper component that shows children if the feature is available for the
 * current tier, or renders an upgrade prompt otherwise.
 *
 * @param {string} feature - feature key from FEATURE_TIERS
 * @param {string} tier - current plan tier (starter | growth | scale)
 * @param {React.ReactNode} children - content to render when unlocked
 */
export default function TierGate({ feature, tier, children }) {
  if (isFeatureEnabled(feature, tier)) return children;

  const requiredTier = getRequiredTier(feature) || "growth";

  return (
    <div className="card" style={{ textAlign: "center", padding: 32, maxWidth: 420, margin: "24px auto" }}>
      <div className="card-bd">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#b08d57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, color: "#2c2420" }}>
          Upgrade to unlock
        </h3>
        <p style={{ margin: "0 0 16px", color: "#6b5e52", fontSize: 14 }}>
          This feature requires the <strong style={{ textTransform: "capitalize" }}>{requiredTier}</strong> plan.
        </p>
        <button
          className="btn"
          style={{ background: "#4a7c59", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", cursor: "pointer", fontWeight: 600 }}
          onClick={() => {
            const event = new CustomEvent("navigate-tab", { detail: { tab: "settings" } });
            window.dispatchEvent(event);
          }}
        >
          Upgrade Plan
        </button>
      </div>
    </div>
  );
}
