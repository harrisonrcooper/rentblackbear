"use server";
import { onboardingSchema } from "@/schemas/onboarding";
import { validateAndLog, type ActionResult } from "./_shared";

export async function completeOnboarding(
  input: FormData | Record<string, unknown>
): Promise<ActionResult> {
  return validateAndLog(onboardingSchema, input, "action.onboarding.complete");
}
