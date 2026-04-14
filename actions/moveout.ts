"use server";
import { moveoutSchema } from "@/schemas/moveout";
import { validateAndLog, type ActionResult } from "./_shared";

export async function submitMoveout(
  input: FormData | Record<string, unknown>
): Promise<ActionResult> {
  return validateAndLog(moveoutSchema, input, "action.moveout.submit");
}
