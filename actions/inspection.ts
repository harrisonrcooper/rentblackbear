"use server";
import { inspectionSchema } from "@/schemas/inspection";
import { validateAndLog, type ActionResult } from "./_shared";

export async function submitInspection(
  input: FormData | Record<string, unknown>
): Promise<ActionResult> {
  return validateAndLog(inspectionSchema, input, "action.inspection.submit");
}
