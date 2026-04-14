import { z } from "zod";
import {
  email, phone, nonEmptyString, optionalString, isoDate, uuid, ssnLast4,
} from "./_shared";

// Shape of the tenant-facing application form. The live admin
// drives its field set from hq-app-fields (see AppSetup.jsx); this
// schema covers the standard set every workspace collects.

export const applicationSchema = z.object({
  termPropId: uuid,
  termUnitId: uuid.optional(),
  termRoomId: uuid.optional(),

  firstName: nonEmptyString("First name"),
  lastName: nonEmptyString("Last name"),
  email,
  phone,
  dob: isoDate,
  ssnLast4,
  desiredMoveIn: isoDate,

  currentAddress: nonEmptyString("Current address"),
  monthsAtCurrent: z.number().int().nonnegative(),
  reasonForMoving: optionalString,

  employer: nonEmptyString("Employer"),
  jobTitle: optionalString,
  monthlyIncomeCents: z
    .number()
    .int()
    .nonnegative("Monthly income can't be negative."),
  employmentLengthMonths: z.number().int().nonnegative(),

  empRefFirstName: nonEmptyString("Employment reference first name"),
  empRefLastName: nonEmptyString("Employment reference last name"),
  empRefEmail: email,
  empRefRelation: nonEmptyString("Employment reference relationship"),

  persRefFirstName: nonEmptyString("Personal reference first name"),
  persRefLastName: nonEmptyString("Personal reference last name"),
  persRefEmail: email,
  persRefRelation: nonEmptyString("Personal reference relationship"),

  hasPets: z.boolean().default(false),
  petDetails: optionalString,
  hasVehicles: z.boolean().default(false),
  vehicleDetails: optionalString,

  screeningConsent: z
    .boolean()
    .refine((v) => v === true, "You must consent to background + credit screening to apply."),
  applicationData: z.record(z.unknown()).default({}),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
