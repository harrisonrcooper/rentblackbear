import { z } from "zod";
import {
  uuid, isoDate, nonEmptyString, optionalString, positiveCents,
} from "./_shared";

const deductionSchema = z.object({
  label: nonEmptyString("Deduction reason"),
  amountCents: positiveCents,
  category: z.enum([
    "cleaning",
    "damage",
    "unpaid_rent",
    "unpaid_utilities",
    "early_termination",
    "other",
  ]),
  notes: optionalString,
  photos: z.array(z.string().url()).default([]),
});

export const moveoutSchema = z
  .object({
    leaseId: uuid,
    tenantId: uuid,
    noticeGivenOn: isoDate,
    moveOutDate: isoDate,
    forwardingAddress: nonEmptyString("Forwarding address"),

    securityDepositHeldCents: positiveCents,
    deductions: z.array(deductionSchema).default([]),
    depositReturnCents: positiveCents,
    depositReturnMethod: z.enum(["ACH", "Check", "Zelle", "Other"]),

    finalWalkthroughCompletedAt: isoDate.optional(),
    tenantSignatureSvg: optionalString,
  })
  .refine(
    (v) =>
      v.depositReturnCents <=
      v.securityDepositHeldCents -
        v.deductions.reduce((s, d) => s + d.amountCents, 0),
    {
      path: ["depositReturnCents"],
      message:
        "Return amount can't exceed the held deposit minus deductions.",
    }
  );

export type MoveoutInput = z.infer<typeof moveoutSchema>;
