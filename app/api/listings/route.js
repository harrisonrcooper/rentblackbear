// app/api/listings/route.js
// PUBLIC JSON feed of vacant rooms — data source for syndication
// (Zillow, Furnished Finder, Roomies, etc.)
// No auth required.

import { loadAppData } from "../../../lib/supabase-server.js";

export const dynamic = "force-dynamic";

/** Extract all non-owner-occupied rooms from a property (handles units[] and flat rooms[]). */
function extractRooms(prop) {
  if (prop.units && prop.units.length > 0) {
    return prop.units.flatMap((u) =>
      u.ownerOccupied ? [] : (u.rooms || []).filter((r) => !r.ownerOccupied)
    );
  }
  return (prop.rooms || []).filter((r) => !r.ownerOccupied);
}

/** Build lease-term array from room tiers or default set. */
function leaseTerms(room) {
  if (room.leaseTiers && room.leaseTiers.length > 0) {
    return room.leaseTiers.filter((t) => t.enabled).map((t) => t.months);
  }
  return [6, 9, 12, 15, 18];
}

export async function GET() {
  try {
    const [props, settings] = await Promise.all([
      loadAppData("hq-props", []),
      loadAppData("hq-settings", {}),
    ]);

    const allProps = Array.isArray(props) ? props : [];

    const listings = [];

    for (const prop of allProps) {
      const rooms = extractRooms(prop);
      for (const room of rooms) {
        // Only include vacant rooms (no current tenant)
        const isVacant =
          !room.tenant && !room.tenantName && room.status !== "occupied";
        if (!isVacant) continue;

        listings.push({
          id: room.id || null,
          propertyName: prop.name || prop.address || "",
          propertyAddress: prop.address || "",
          roomName: room.name || room.label || "",
          rent: room.rent || 0,
          available: true,
          availableDate: room.availableDate || room.moveIn || null,
          features: buildFeatures(prop, room),
          photos: room.photos || prop.photos || [],
          leaseTerms: leaseTerms(room),
          utilities: prop.utilities || settings.utilities || "Contact for details",
          petPolicy: prop.petPolicy || settings.petPolicy || "No pets",
          smokingPolicy: prop.smokingPolicy || settings.smokingPolicy || "No smoking",
          parking: prop.parking || settings.parking || "Available",
        });
      }
    }

    const company = {
      name: settings.companyName || "Property Management",
      phone: settings.phone || "",
      email: settings.email || "",
      website: settings.siteUrl || "",
    };

    const body = {
      listings,
      company,
      generatedAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(body, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("[listings feed]", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate listings feed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/** Build a human-readable features list from property/room data. */
function buildFeatures(prop, room) {
  const f = [];
  if (prop.furnished || room.furnished) f.push("Furnished");
  if (prop.wifi || room.wifi) f.push("WiFi Included");
  if (prop.cleaning || room.cleaning) f.push("Cleaning Included");
  if (prop.parking) f.push("Parking");
  if (prop.laundry || room.laundry) f.push("Laundry");
  // If nothing detected, add generic amenities common to this platform
  if (f.length === 0) f.push("Furnished", "WiFi Included", "Cleaning Included");
  return f;
}
