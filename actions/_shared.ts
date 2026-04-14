// Shared helpers for the Phase-P server action stubs.
//
// Each stub parses its input against the matching Zod schema,
// writes the validated payload to stdout (tagged so it's easy to
// find in `vercel logs`), and returns an envelope the client can
// branch on. Once the Supabase instance is live these functions
// become the single write path for their respective forms.

import { z } from "zod";
import { headers } from "next/headers";
import { getWorkspaceHeaderName } from "@/lib/workspace";

export type ActionResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; errors: Record<string, string[]>; message: string };

export function fieldErrors(err: z.ZodError): Record<string, string[]> {
  // Zod 4's flatten() shape: { formErrors, fieldErrors }.
  const flat = err.flatten();
  return flat.fieldErrors as Record<string, string[]>;
}

function resolveWorkspace(): string | null {
  try {
    return headers().get(getWorkspaceHeaderName());
  } catch {
    return null;
  }
}

export async function validateAndLog<S extends z.ZodTypeAny>(
  schema: S,
  form: FormData | Record<string, unknown>,
  tag: string
): Promise<ActionResult<z.infer<S>>> {
  const raw = form instanceof FormData ? Object.fromEntries(form) : form;
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      errors: fieldErrors(parsed.error),
      message: "Validation failed. Review the highlighted fields.",
    };
  }
  // Tag makes it trivial to find in `vercel logs` or the local
  // dev output. JSON.stringify because workspaceId + timestamp +
  // payload otherwise fight for one log line.
  console.log(
    JSON.stringify({
      tag,
      workspaceId: resolveWorkspace(),
      at: new Date().toISOString(),
      data: parsed.data,
    })
  );
  return { ok: true, data: parsed.data };
}
