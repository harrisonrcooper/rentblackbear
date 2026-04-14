import { z } from "zod";
import { isoDate, uuid, nonEmptyString, optionalString } from "./_shared";

const conditionEnum = z.enum([
  "excellent",
  "good",
  "fair",
  "poor",
  "damaged",
]);

export const inspectionItemSchema = z.object({
  label: nonEmptyString("Item"),
  condition: conditionEnum,
  notes: optionalString,
  photos: z.array(z.string().url()).default([]),
});

export const inspectionSchema = z.object({
  leaseId: uuid,
  tenantId: uuid.optional(),
  roomId: uuid.optional(),
  kind: z.enum(["move_in", "move_out", "periodic"]),
  inspectedAt: isoDate,

  walkthroughItems: z.array(inspectionItemSchema).min(1, "Add at least one item."),
  overallNotes: optionalString,
  tenantSignatureSvg: optionalString,
  operatorSignatureSvg: optionalString,
});

export type InspectionInput = z.infer<typeof inspectionSchema>;
