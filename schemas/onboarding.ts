import { z } from "zod";
import { email, phone, nonEmptyString, optionalString } from "./_shared";

// Operator onboarding wizard state. Covers the 5-step flow the
// existing admin's OnboardingWizard walks a new operator through
// (brand, contact, first property stub, first tenant stub, plan).

export const onboardingSchema = z.object({
  workspaceName: nonEmptyString("Workspace name"),
  operatorName: nonEmptyString("Your name"),
  operatorEmail: email,
  operatorPhone: phone.optional(),

  brandPrimary: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Enter a hex color like #2F3E83."),
  brandAccent: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Enter a hex color like #FF4998."),
  logoUrl: optionalString,

  firstPropertyName: optionalString,
  firstPropertyAddr: optionalString,
  inviteFirstTenantEmail: email.optional(),

  planTier: z.enum(["starter", "growth", "scale"]),
  agreedToTerms: z
    .boolean()
    .refine((v) => v === true, {
      message: "You must accept the Terms and Privacy Policy to continue.",
    }),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
