import { z } from "zod";
import {
  nonEmptyString, isoDate, uuid, strictlyPositiveCents, positiveCents,
} from "./_shared";

export const leaseSchema = z
  .object({
    templateId: uuid.optional(),
    propertyId: uuid,
    unitId: uuid.optional(),
    roomId: uuid.optional(),
    tenantId: uuid.optional(),
    applicationId: uuid.optional(),

    startDate: isoDate,
    endDate: isoDate,
    moveInDate: isoDate.optional(),

    monthlyRentCents: strictlyPositiveCents,
    securityDepositCents: positiveCents,
    utilitiesClauseKey: nonEmptyString("Utilities clause"),

    variableData: z.record(z.unknown()).default({}),
  })
  .refine((v) => v.endDate > v.startDate, {
    path: ["endDate"],
    message: "End date must be after the start date.",
  });

export type LeaseInput = z.infer<typeof leaseSchema>;
