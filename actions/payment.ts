"use server";
import { paymentSchema } from "@/schemas/payment";
import { validateAndLog, type ActionResult } from "./_shared";

export async function recordPayment(
  input: FormData | Record<string, unknown>
): Promise<ActionResult> {
  return validateAndLog(paymentSchema, input, "action.payment.record");
}
