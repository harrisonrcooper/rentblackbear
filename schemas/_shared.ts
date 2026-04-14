// Shared primitives for the Zod form schemas. Keeps every form-
// level file in schemas/ reading against one definition of
// "what an email looks like", "what a positive amount looks
// like", etc. so validation behavior stays consistent across the
// admin, portal, apply, and vendor surfaces.

import { z } from "zod";

export const email = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .email("That doesn't look like a valid email address.");

export const phone = z
  .string()
  .trim()
  .min(10, "Phone number needs at least 10 digits.")
  .regex(/^[0-9+()\-.\s]+$/, "Phone number may only contain digits and +()-.");

export const nonEmptyString = (label = "This field") =>
  z.string().trim().min(1, `${label} is required.`);

export const optionalString = z.string().trim().optional();

export const positiveCents = z
  .number()
  .int("Amounts are tracked in whole cents.")
  .nonnegative("Amount can't be negative.");

export const strictlyPositiveCents = z
  .number()
  .int("Amounts are tracked in whole cents.")
  .positive("Amount must be greater than zero.");

export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD.");

export const uuid = z.string().uuid("Invalid id.");

export const workspaceId = uuid;

export const priority = z.enum(["low", "medium", "high", "urgent"]);

// A permissive SSN stub — real validation lives server-side once
// Plaid / the screening provider is wired.
export const ssnLast4 = z
  .string()
  .trim()
  .regex(/^\d{4}$/, "Enter the last 4 digits of the SSN.");
