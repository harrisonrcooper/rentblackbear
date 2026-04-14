"use server";
import { maintenanceSchema } from "@/schemas/maintenance";
import { validateAndLog, type ActionResult } from "./_shared";

export async function submitMaintenance(
  input: FormData | Record<string, unknown>
): Promise<ActionResult> {
  return validateAndLog(maintenanceSchema, input, "action.maintenance.submit");
}
