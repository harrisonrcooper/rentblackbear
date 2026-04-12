// lib/features.js
// Tier-gated feature flag system — reads tier from settings, gates access by plan level.

const FEATURE_TIERS = {
  "ai-chat": ["growth", "scale"],
  "receipt-scan": ["growth", "scale"],
  "ai-matching": ["scale"],
  "white-label": ["scale"],
  "api-access": ["scale"],
  "banker-portal": ["scale"],
  "sms-notifications": ["growth", "scale"],
  "bulk-actions": ["growth", "scale"],
  "custom-reports": ["growth", "scale"],
  "buildlend": ["scale"],
};

/**
 * Check if a feature is enabled for the given tier.
 * Ungated features (not in FEATURE_TIERS) are available to all tiers.
 */
export function isFeatureEnabled(featureKey, tier = "starter") {
  const allowed = FEATURE_TIERS[featureKey];
  if (!allowed) return true; // ungated features available to all
  return allowed.includes(tier);
}

/**
 * Return a map of all gated features with boolean availability for the given tier.
 */
export function getAvailableFeatures(tier) {
  return Object.entries(FEATURE_TIERS).reduce((acc, [key, tiers]) => {
    acc[key] = tiers.includes(tier);
    return acc;
  }, {});
}

/**
 * Return the minimum tier required for a feature.
 * Returns null for ungated features.
 */
export function getRequiredTier(featureKey) {
  const allowed = FEATURE_TIERS[featureKey];
  if (!allowed) return null;
  return allowed[0] || "growth";
}

export { FEATURE_TIERS };
