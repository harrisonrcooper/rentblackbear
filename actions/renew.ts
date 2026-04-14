"use server";
import { renewSchema } from "@/schemas/renew";
import { validateAndLog, type ActionResult } from "./_shared";

export async function offerRenewal(
  input: FormData | Record<string, unknown>
): Promise<ActionResult> {
  return validateAndLog(renewSchema, input, "action.renew.offer");
}
