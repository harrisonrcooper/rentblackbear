// lib/tierCheck.js
// Tier enforcement utility for PropOS SaaS subscription tiers.
//
// Tiers:
//   starter  — $97/mo  — 10 rooms, 1 property
//   growth   — $197/mo — 30 rooms, unlimited properties
//   scale    — $397/mo — unlimited rooms, unlimited properties

const TIER_LIMITS = {
  starter: { rooms: 10, properties: 1 },
  growth: { rooms: 30, properties: Infinity },
  scale: { rooms: Infinity, properties: Infinity },
};

export function checkTierLimit(tier, currentRooms, currentProperties) {
  const limits = TIER_LIMITS[tier] || TIER_LIMITS.starter;
  return {
    canAddRoom: currentRooms < limits.rooms,
    canAddProperty: currentProperties < limits.properties,
    roomsUsed: currentRooms,
    roomsLimit: limits.rooms,
    propertiesUsed: currentProperties,
    propertiesLimit: limits.properties,
    tier,
  };
}

export { TIER_LIMITS };
