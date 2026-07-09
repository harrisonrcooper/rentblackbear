// Multi-household auth + workspace-key resolver.
//
// One Next deploy now supports MORE THAN ONE household. Each household
// is a group of principal IDs that share a single budget blob. Env
// config is a semicolon-delimited list of comma-delimited groups,
// each optionally tagged with the experience flavor:
//
//   BUDGET_HOUSEHOLD_GROUPS = "harrison_id,carolina_id:full;
//                              caitlina_id,michael_id:basic"
//
// The user's workspace key = the FIRST id in the group they belong to.
// The experience flavor defaults to "full" when the `:basic`/`:full`
// suffix is missing.
//
// Users not listed in any group fall back to their own user id as the
// workspace key (single-tenant private mode). Empty env = anyone
// authenticated → private workspace each.
//
// Backwards compat: BUDGET_OWNER_USER_IDS (legacy single-household)
// is merged in as the first group with experience "full."

export type Experience = "basic" | "full";

interface HouseholdGroup {
  ids: string[];
  experience: Experience;
}

export interface HouseholdResolution {
  workspaceKey: string;
  inHousehold: boolean;
  members: string[];
  experience: Experience;
}

function parseGroups(): HouseholdGroup[] {
  const env = process.env.BUDGET_HOUSEHOLD_GROUPS;
  const legacyMulti = process.env.BUDGET_OWNER_USER_IDS;
  const legacySingle = process.env.BUDGET_OWNER_USER_ID;

  const groups: HouseholdGroup[] = [];

  if (env) {
    for (const raw of env.split(";")) {
      const trimmed = raw.trim();
      if (!trimmed) continue;
      // Split off optional ":basic" / ":full" suffix.
      const suffixIdx = trimmed.lastIndexOf(":");
      let body = trimmed;
      let experience: Experience = "full";
      if (suffixIdx >= 0) {
        const tail = trimmed.slice(suffixIdx + 1).trim().toLowerCase();
        if (tail === "basic" || tail === "full") {
          experience = tail;
          body = trimmed.slice(0, suffixIdx);
        }
      }
      const ids = body.split(",").map((s) => s.trim()).filter(Boolean);
      if (ids.length > 0) groups.push({ ids, experience });
    }
  }

  const legacyIds = (legacyMulti || legacySingle || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (legacyIds.length > 0) {
    groups.unshift({ ids: legacyIds, experience: "full" });
  }

  return groups;
}

export function resolveHousehold(userId: string): HouseholdResolution {
  const groups = parseGroups();
  for (const g of groups) {
    if (g.ids.includes(userId)) {
      return {
        workspaceKey: g.ids[0],
        inHousehold: true,
        members: g.ids,
        experience: g.experience,
      };
    }
  }
  return {
    workspaceKey: userId,
    inHousehold: false,
    members: [userId],
    experience: "full",
  };
}

export function householdsConfigured(): boolean {
  return parseGroups().length > 0;
}

export function isAuthorizedForBudget(userId: string): boolean {
  if (!householdsConfigured()) return true;
  return parseGroups().some((g) => g.ids.includes(userId));
}

export function experienceForUser(userId: string): Experience {
  return resolveHousehold(userId).experience;
}
