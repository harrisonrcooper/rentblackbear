// lib/syncTenant.js
// Syncs tenant and charge data from app_data (JSON blob) to relational Supabase tables.
// Called whenever a tenant is added, updated, or converted from an applicant.
// This is the bridge layer between the legacy app_data system and the SaaS-ready schema.

import { supaUpsert, supaGet } from "./supabase-server.js";

/**
 * Sync a tenant record to Supabase relational tables.
 *
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} params.phone
 * @param {string} params.moveIn        - ISO date string YYYY-MM-DD
 * @param {string} params.leaseEnd      - ISO date string YYYY-MM-DD
 * @param {number} params.rent          - monthly rent amount
 * @param {number} params.sd            - security deposit amount
 * @param {string} params.propName      - property name (used to look up property_id)
 * @param {string} params.roomName      - room name (used to look up room_id)
 * @param {string} params.doorCode
 * @param {string} params.appDataRoomId - the id from app_data (stored as external_id for reverse lookup)
 * @param {Array}  params.charges       - existing charges array from app_data for this tenant
 */
export async function syncTenantToSupabase({
  name, email, phone, moveIn, leaseEnd, rent, sd,
  propName, roomName, doorCode, appDataRoomId, charges = [],
}) {
  try {
    // ── 1. Get PM account ──────────────────────────────────────────────
    const pms = await supaGet("pm_accounts", "select=id&limit=1");
    const pmId = pms?.[0]?.id;
    if (!pmId) { console.error("[syncTenant] No PM account found"); return null; }

    // ── 2. Get or create property ──────────────────────────────────────
    let propId = null;
    if (propName) {
      const props = await supaGet("properties", `name=eq.${encodeURIComponent(propName)}&pm_id=eq.${pmId}&select=id`);
      if (props?.[0]?.id) {
        propId = props[0].id;
      } else {
        const created = await supaUpsert("properties", { pm_id: pmId, name: propName });
        propId = created?.[0]?.id;
      }
    }

    // ── 3. Get or create room ──────────────────────────────────────────
    let roomId = null;
    let unitId = null;
    if (roomName && propId) {
      const rooms = await supaGet("rooms", `name=eq.${encodeURIComponent(roomName)}&property_id=eq.${propId}&select=id,unit_id`);
      if (rooms?.[0]?.id) {
        roomId = rooms[0].id;
        unitId = rooms[0].unit_id;
      } else {
        // Create a default unit if none exists
        const units = await supaGet("units", `property_id=eq.${propId}&select=id&limit=1`);
        if (units?.[0]?.id) {
          unitId = units[0].id;
        } else {
          const createdUnit = await supaUpsert("units", { pm_id: pmId, property_id: propId, name: "Unit A", rental_mode: "byRoom" });
          unitId = createdUnit?.[0]?.id;
        }
        if (unitId) {
          const createdRoom = await supaUpsert("rooms", { pm_id: pmId, unit_id: unitId, property_id: propId, name: roomName, rent: rent || 0, status: "occupied", door_code: doorCode || null });
          roomId = createdRoom?.[0]?.id;
        }
      }
    }

    // ── 4. Upsert tenant record ────────────────────────────────────────
    // Check if tenant already exists by email+pm_id to prevent duplicates on re-import
    let tenantId = null;
    if (email) {
      const existing = await supaGet("tenants", `email=eq.${encodeURIComponent(email)}&pm_id=eq.${pmId}&select=id`);
      if (existing?.[0]?.id) tenantId = existing[0].id;
    }
    const tenantData = {
      pm_id: pmId,
      property_id: propId,
      unit_id: unitId,
      room_id: roomId,
      name,
      email,
      phone: phone || null,
      move_in: moveIn || null,
      lease_end: leaseEnd || null,
      rent: rent || null,
      security_deposit: sd || null,
      door_code: doorCode || null,
      status: "active",
    };
    if (tenantId) {
      // Update existing tenant
      await supaUpsert("tenants", { id: tenantId, ...tenantData });
    } else {
      // Create new tenant
      const tenantRows = await supaUpsert("tenants", tenantData);
      tenantId = tenantRows?.[0]?.id;
    }
    if (!tenantId) { console.error("[syncTenant] Failed to upsert tenant"); return null; }

    // ── 5. Sync charges ────────────────────────────────────────────────
    // Find rent and SD charges for this tenant from app_data charges array
    const tenantCharges = charges.filter(c =>
      c.tenantName === name ||
      (appDataRoomId && c.roomId === appDataRoomId)
    );

    for (const c of tenantCharges) {
      await supaUpsert("charges", {
        pm_id: pmId,
        tenant_id: tenantId,
        room_id: roomId,
        property_id: propId,
        tenant_name: name,
        property_name: propName || null,
        room_name: roomName || null,
        category: c.category,
        description: c.description || c.category,
        amount: c.amount,
        amount_paid: c.amountPaid || 0,
        due_date: c.dueDate || null,
        waived: c.waived || false,
        voided: c.voided || false,
        no_late_fee: c.noLateFee || false,
      });
    }

    // If no SD charge exists but sd amount provided, create one
    const hasSD = tenantCharges.some(c => c.category === "Security Deposit");
    if (!hasSD && sd && sd > 0) {
      await supaUpsert("charges", {
        pm_id: pmId,
        tenant_id: tenantId,
        room_id: roomId,
        property_id: propId,
        tenant_name: name,
        property_name: propName || null,
        room_name: roomName || null,
        category: "Security Deposit",
        description: "Security Deposit",
        amount: sd,
        amount_paid: 0,
        due_date: moveIn || null,
      });
    }

    // If no rent charge exists, create one for first month
    const hasRent = tenantCharges.some(c => c.category === "Rent");
    if (!hasRent && rent && rent > 0 && moveIn) {
      const month = moveIn.slice(0, 7);
      await supaUpsert("charges", {
        pm_id: pmId,
        tenant_id: tenantId,
        room_id: roomId,
        property_id: propId,
        tenant_name: name,
        property_name: propName || null,
        room_name: roomName || null,
        category: "Rent",
        description: month + " Rent",
        amount: rent,
        amount_paid: 0,
        due_date: month + "-01",
      });
    }

    console.log(`[syncTenant] Synced ${name} (${email}) → tenantId: ${tenantId}`);
    return tenantId;
  } catch (err) {
    console.error("[syncTenant] Error:", err);
    return null;
  }
}

/**
 * Fetch onboarding status for a tenant from Supabase.
 * Used to display pill cards on applicant cards.
 * Returns { leaseSigned, sdPaid, firstMonthPaid, tenantId }
 */
export async function fetchOnboardingStatus(email, pmId) {
  try {
    if (!email) return null;

    const tenants = await supaGet(
      "tenants",
      `email=eq.${encodeURIComponent(email)}&pm_id=eq.${pmId}&select=id,lease_signed_at`
    );
    const tenant = tenants?.[0];
    if (!tenant) return null;

    const charges = await supaGet(
      "charges",
      `tenant_id=eq.${tenant.id}&select=category,amount,amount_paid`
    );

    const sdCharge = (charges || []).find(c => c.category === "Security Deposit");
    const rentCharge = (charges || []).find(c => c.category === "Rent");

    return {
      tenantId: tenant.id,
      leaseSigned: !!tenant.lease_signed_at,
      sdPaid: !!(sdCharge && sdCharge.amount_paid >= sdCharge.amount),
      firstMonthPaid: !!(rentCharge && rentCharge.amount_paid >= rentCharge.amount),
    };
  } catch (err) {
    console.error("[fetchOnboardingStatus] Error:", err);
    return null;
  }
}
