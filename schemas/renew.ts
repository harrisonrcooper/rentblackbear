import { z } from "zod";
import {
  isoDate, uuid, strictlyPositiveCents, optionalString,
} from "./_shared";

export const renewSchema = z
  .object({
    leaseId: uuid,
    tenantId: uuid.optional(),

    newStartDate: isoDate,
    newEndDate: isoDate,
    newMonthlyRentCents: strictlyPositiveCents,
    concessions: z
      .array(
        z.object({
          label: z.string().trim().min(1),
          amountCents: strictlyPositiveCents,
          months: z.number().int().positive(),
        })
      )
      .default([]),
    notes: optionalString,

    tenantAccepted: z.boolean().default(false),
  })
  .refine((v) => v.newEndDate > v.newStartDate, {
    path: ["newEndDate"],
    message: "Renewal end date must be after the start date.",
  });

export type RenewInput = z.infer<typeof renewSchema>;
