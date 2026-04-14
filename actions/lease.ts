"use server";
import { leaseSchema } from "@/schemas/lease";
import { validateAndLog, type ActionResult } from "./_shared";

export async function createLease(
  input: FormData | Record<string, unknown>
): Promise<ActionResult> {
  return validateAndLog(leaseSchema, input, "action.lease.create");
}
