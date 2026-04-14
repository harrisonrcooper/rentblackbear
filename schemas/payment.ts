import { z } from "zod";
import { uuid, isoDate, strictlyPositiveCents, optionalString } from "./_shared";

export const paymentMethod = z.enum([
  "Zelle",
  "Venmo",
  "Cash",
  "Check",
  "CashApp",
  "Bank Transfer",
  "Stripe/ACH",
  "Stripe/Card",
  "Credit Card",
  "Other",
]);

export const paymentSchema = z.object({
  tenantId: uuid,
  leaseId: uuid.optional(),
  roomId: uuid.optional(),
  amountCents: strictlyPositiveCents,
  eventDate: isoDate,
  method: paymentMethod,
  description: optionalString,
  metadata: z.record(z.unknown()).default({}),
});

export type PaymentInput = z.infer<typeof paymentSchema>;
