"use server";
import { applicationSchema } from "@/schemas/application";
import { validateAndLog, type ActionResult } from "./_shared";

export async function submitApplication(
  input: FormData | Record<string, unknown>
): Promise<ActionResult> {
  return validateAndLog(applicationSchema, input, "action.application.submit");
}
