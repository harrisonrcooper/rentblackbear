"use server";

// Server action: seed a starter budget for the calling user's *active*
// budget.
//
// Two flavors:
//   - "full"  → full property-manager template (default; what Harrison uses)
//   - "basic" → stripped-down newcomer template: paycheck-style envelopes,
//               no rentals, no business expenses, no retirement projection.
//               Used for households that flagged settings.experience = "basic".
//
// Either way the template is a starting shape — every amount is $0
// and every label is editable (see _seed-templates.ts). We never
// overwrite an existing budget.

import { auth } from "@clerk/nextjs/server";

import { loadBudgetState, saveBudgetState } from "./_writer";
import { isAuthorizedForBudget, experienceForUser } from "./_households";
import { resolveActiveBudget } from "./_registry";
import { buildSeedState } from "./_seed-templates";

export type SeedOpts = {
  experience?: "basic" | "full";
};

export async function seedBudget(
  opts: SeedOpts = {},
): Promise<{ ok: boolean; message?: string }> {
  const { userId } = await auth();
  if (!userId) return { ok: false, message: "Not authenticated." };
  if (!isAuthorizedForBudget(userId)) {
    return { ok: false, message: "Not authorized." };
  }
  // Caller can override via opts.experience; default to the flavor the
  // env-configured household carries.
  const experience: "basic" | "full" = opts.experience ?? experienceForUser(userId);

  try {
    const { workspaceKey } = await resolveActiveBudget(userId);
    const existing = await loadBudgetState(workspaceKey);
    if (existing.categories.length > 0 || existing.properties.length > 0) {
      return { ok: true, message: "Already set up." };
    }
    await saveBudgetState(workspaceKey, buildSeedState(experience), userId);
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}
