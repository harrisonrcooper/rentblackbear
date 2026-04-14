import { z } from "zod";
import { nonEmptyString, optionalString, uuid, priority } from "./_shared";

export const maintenanceSchema = z.object({
  propertyId: uuid.optional(),
  unitId: uuid.optional(),
  roomId: uuid.optional(),
  tenantId: uuid.optional(),

  title: nonEmptyString("Title"),
  description: z
    .string()
    .trim()
    .min(10, "Please describe the issue in a sentence or two."),
  category: optionalString,
  priority: priority.default("medium"),

  photos: z.array(z.string().url("Photo URL is invalid.")).default([]),
  tenantVisible: z.boolean().default(true),
});

export type MaintenanceInput = z.infer<typeof maintenanceSchema>;
