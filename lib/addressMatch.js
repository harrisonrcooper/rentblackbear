// ── Shared address normalization + Lease Title parsing ──────────────
// Used by SmartImporter (tenant import) and LedgerImporter (charge import)

export const normAddr = s => {
  let a = (s||"").trim().replace(/\s+/g," ").replace(/[.,#]/g,"").toLowerCase();
  a = a.replace(/[,\s]+[a-z]{2,}\s+[a-z]{2}\s*\d{5}(-\d{4})?\s*$/i, "");
  a = a.replace(/(\b(?:nw|ne|sw|se|n|s|e|w)\b)\s+[a-z]+\s+[a-z]{2}\s*$/i, "$1");
  a = a.replace(/\bdrive\b/g, "dr").replace(/\bavenue\b/g, "ave").replace(/\bstreet\b/g, "st")
    .replace(/\bboulevard\b/g, "blvd").replace(/\blane\b/g, "ln").replace(/\bcourt\b/g, "ct")
    .replace(/\broad\b/g, "rd").replace(/\bcircle\b/g, "cir").replace(/\bplace\b/g, "pl")
    .replace(/\bhighway\b/g, "hwy").replace(/\bterrace\b/g, "ter").replace(/\btrail\b/g, "trl")
    .replace(/\bparkway\b/g, "pkwy").replace(/\bway\b/g, "way");
  return a.trim();
};

// Parse combined unit+room codes: "B1" → {unit:"B", room:"1"}, "UB-R3" → {unit:"B", room:"3"}, "UB-MB" → {unit:"B", room:"Master"}
export function parseUnitRoom(val) {
  if (!val) return { unit: "", room: "" };
  const s = val.trim();
  const ubr = s.match(/^U([A-Z])-?(R(\d+)|MB|Master)$/i);
  if (ubr) return { unit: ubr[1], room: ubr[3] ? ubr[3] : "Master" };
  const ln = s.match(/^([A-Z])(\d+)$/i);
  if (ln) return { unit: ln[1].toUpperCase(), room: ln[2] };
  return { unit: "", room: "" };
}

// Parse "ADDRESS, UNIT, ROOM - TENANT NAME" → { address, unit, room, tenantName }
export function parseLeaseTitle(str) {
  if (!str) return { address: "", unit: "", room: "", tenantName: "" };
  let s = String(str).trim();

  // Protect UB-R3, UB-MB patterns from dash splitting
  s = s.replace(/\bU([A-Z])-(?=R\d|MB|Master)/gi, "U$1~");

  // Split on dash followed by capital letter (name start)
  let addressPart = s, tenantName = "";
  const dashMatch = s.match(/^(.*?)[\s]*-[\s]*([A-Z][a-z].*)/);
  if (dashMatch) {
    addressPart = dashMatch[1].trim();
    tenantName = dashMatch[2].trim();
  }

  // Restore UB~R3 → UB-R3
  addressPart = addressPart.replace(/U([A-Z])~/gi, "U$1-");
  tenantName = tenantName.replace(/U([A-Z])~/gi, "U$1-");

  // Strip city/state/zip
  addressPart = addressPart.replace(/[,\s]+[A-Za-z]+\s+[A-Z]{2}\s*\d{5}(-\d{4})?\s*$/i, "").trim();
  addressPart = addressPart.replace(/,?\s*[A-Za-z]+\s+(AL|Alabama|GA|Georgia|TN|Tennessee|FL|Florida|TX|Texas|CA|California|NY|NC|SC|VA|OH|IL|PA|MI|IN|WI|MN|MO|MD|MA|AZ|CO|OR|WA|NV|NJ|CT)\s*\d{0,5}\s*$/i, "").trim();

  // Detect name leaked into address (e.g. "3026 Turf Ave. NW B, 2 Manvith Amara")
  const nameInAddr = addressPart.match(/^(.*?(?:\d|NW|NE|SW|SE))\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s*$/);
  if (nameInAddr && !tenantName) {
    addressPart = nameInAddr[1].trim();
    tenantName = nameInAddr[2].trim();
  }

  // Handle "address B2" pattern (no comma before unit code)
  const addrUnitMatch = addressPart.match(/^(.+?\b(?:NW|NE|SW|SE|N|S|E|W)\b)\s+([A-Z]\d+|U[A-Z]-?(?:R\d+|MB|Master))$/i);
  if (addrUnitMatch) {
    addressPart = addrUnitMatch[1] + "," + addrUnitMatch[2];
  }

  // Split by commas
  const parts = addressPart.split(",").map(p => p.trim()).filter(Boolean);
  let address = "", unit = "", room = "";

  if (parts.length >= 3) {
    address = parts[0]; unit = parts[1]; room = parts[2];
  } else if (parts.length === 2) {
    address = parts[0];
    const val = parts[1];
    const unitRoom = parseUnitRoom(val);
    if (unitRoom.unit && unitRoom.room) {
      unit = unitRoom.unit; room = unitRoom.room;
    } else if (/^\d+$/.test(val) || /^master$|^primary/i.test(val)) {
      room = val;
    } else if (/^[A-Z]$/i.test(val)) {
      unit = val;
    } else if (/^[A-Z][a-z]+ [A-Z]/.test(val) && !tenantName) {
      tenantName = val;
    } else {
      room = val;
    }
  } else {
    address = parts[0] || "";
  }

  // Handle "address B" where B stuck to address
  if (!unit && !room && address) {
    const m = address.match(/^(.+?)\s+([A-Z])$/i);
    if (m) { address = m[1]; unit = m[2]; }
  }

  return { address: address.trim(), unit: unit.trim(), room: room.trim(), tenantName: tenantName.trim() };
}

// Normalize room name: "1" → "Bedroom 1", "R3" → "Bedroom 3", "Master"/"MB" → "Primary Suite"
export function normalizeRoomName(rn) {
  if (!rn) return "";
  const t = rn.trim();
  if (/^\d+$/.test(t)) return "Bedroom " + t;
  if (/^R\d+$/i.test(t)) return "Bedroom " + t.replace(/^R/i, "");
  if (/^Room\s*\d+$/i.test(t)) return "Bedroom " + t.replace(/^Room\s*/i, "");
  if (/^B\d+$/i.test(t)) return "Bedroom " + t.replace(/^B/i, "");
  if (/^master$|^mb$/i.test(t)) return "Primary Suite";
  return t;
}

export function isRealAddress(addr) {
  if (!addr) return false;
  return /^\d+\s+\w/.test(addr.trim());
}

export const parseMoneyStr = s => Number(String(s||"").replace(/[^0-9.]/g,"")) || 0;

export const fmtMoney = n => { const v = Number(n); return isNaN(v) ? "$0" : "$" + v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };

// Simple Levenshtein distance for near-miss name matching
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const d = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      d[i][j] = a[i - 1] === b[j - 1]
        ? d[i - 1][j - 1]
        : 1 + Math.min(d[i - 1][j], d[i][j - 1], d[i - 1][j - 1]);
    }
  }
  return d[m][n];
}

// Fuzzy name match — case insensitive, trims whitespace, handles misspellings and middle names
export function fuzzyNameMatch(a, b) {
  if (!a || !b) return { match: false, confidence: 0 };
  const na = a.trim().toLowerCase(), nb = b.trim().toLowerCase();
  if (na === nb) return { match: true, confidence: 1.0 };
  // First + last name match (ignoring middle names)
  const pa = na.split(/\s+/), pb = nb.split(/\s+/);
  if (pa.length >= 2 && pb.length >= 2 && pa[0] === pb[0] && pa[pa.length - 1] === pb[pb.length - 1])
    return { match: true, confidence: 0.9 };
  // First name + partial last
  if (pa[0] === pb[0] && (pa.length === 1 || pb.length === 1))
    return { match: true, confidence: 0.6 };
  // One is substring of the other
  if (na.includes(nb) || nb.includes(na))
    return { match: true, confidence: 0.7 };
  // Levenshtein on first names — catches Tynneka/Tyneika, Jonah/Johan
  if (pa.length >= 2 && pb.length >= 2) {
    const firstDist = levenshtein(pa[0], pb[0]);
    const lastA = pa[pa.length - 1], lastB = pb[pb.length - 1];
    const lastDist = levenshtein(lastA, lastB);
    // Close first name (1-2 edits) + exact last name
    if (firstDist <= 2 && lastA === lastB)
      return { match: true, confidence: 0.75 };
    // Exact first name + close last name
    if (pa[0] === pb[0] && lastDist <= 2)
      return { match: true, confidence: 0.75 };
    // Both close (1-2 edits each)
    if (firstDist <= 2 && lastDist <= 2)
      return { match: true, confidence: 0.6 };
    // First name of one matches last name fragment of other (e.g. "Jonah Jeffrey" vs "Johan Jeffrey White")
    // Check if first+second of shorter matches first+second of longer
    if (firstDist <= 2 && pa.length >= 2 && pb.length >= 2) {
      const secondA = pa.length > 2 ? pa[1] : pa[pa.length - 1];
      const secondB = pb.length > 2 ? pb[1] : pb[pb.length - 1];
      if (secondA === secondB || levenshtein(secondA, secondB) <= 1)
        return { match: true, confidence: 0.65 };
    }
  }
  // Full string Levenshtein — very close names
  const fullDist = levenshtein(na, nb);
  const maxLen = Math.max(na.length, nb.length);
  if (maxLen > 0 && fullDist / maxLen <= 0.2)
    return { match: true, confidence: 0.55 };
  return { match: false, confidence: 0 };
}

// Match a parsed lease title against existing properties+rooms, returning { roomId, propId, propName, roomName, tenantName, confidence }
export function matchChargeToTenant(parsed, existingProps) {
  const { address, unit, room, tenantName } = parsed;
  const na = normAddr(address);
  const normRoom = normalizeRoomName(room);

  let bestMatch = null;
  let bestConfidence = 0;

  for (const prop of existingProps) {
    const propNorm = normAddr(prop.addr || prop.name);

    // Check address match — exact after normalization
    let addrMatch = propNorm === na;

    // Fallback: partial word match (for "Crestview" → "4015 E Crestview Dr NW")
    if (!addrMatch && !isRealAddress(address)) {
      const words = (address || "").toLowerCase().replace(/[.,#]/g, "").split(/\s+/);
      addrMatch = words.some(w => w.length > 3 && propNorm.includes(w));
      if (addrMatch) bestConfidence = Math.max(bestConfidence, 0.01); // mark as partial
    }

    // Fallback: strip after directional
    if (!addrMatch) {
      const stripped = na.replace(/\s+(nw|ne|sw|se)\s+.*$/i, (m, dir) => " " + dir);
      if (stripped !== na && propNorm === stripped) addrMatch = true;
    }

    if (!addrMatch) continue;

    // Address matched — now find the room
    for (const u of (prop.units || [])) {
      // Unit match: if unit specified, check unit name/label
      if (unit) {
        const uName = (u.name || "").toLowerCase();
        const uLabel = (u.label || "").toLowerCase();
        const uMatch = uName === unit.toLowerCase() || uLabel === unit.toLowerCase()
          || uName.includes(unit.toLowerCase()) || unit.toLowerCase() === uName[0];
        if (!uMatch) continue;
      }

      for (const r of (u.rooms || [])) {
        // Room match by name
        const rName = (r.name || "").toLowerCase();
        const roomMatched = !normRoom || rName === normRoom.toLowerCase()
          || rName.includes(normRoom.toLowerCase()) || normRoom.toLowerCase().includes(rName);

        // Tenant name match
        const tName = r.tenant?.name || "";
        const nameResult = fuzzyNameMatch(tenantName, tName);

        // Also check co-tenants
        let coTenantMatch = null;
        if (!nameResult.match && r.coTenants) {
          for (const ct of r.coTenants) {
            const ctResult = fuzzyNameMatch(tenantName, ct.name);
            if (ctResult.match && ctResult.confidence > (coTenantMatch?.confidence || 0)) {
              coTenantMatch = ctResult;
            }
          }
        }

        const bestNameResult = nameResult.match ? nameResult : coTenantMatch;
        if (!bestNameResult?.match) continue;

        // Calculate composite confidence
        let conf = bestNameResult.confidence;
        if (roomMatched && normRoom) conf = Math.min(conf + 0.05, 1.0);
        if (propNorm === na) conf = Math.min(conf + 0.05, 1.0); // exact address > partial

        if (conf > bestConfidence) {
          bestConfidence = conf;
          bestMatch = {
            roomId: r.id,
            propId: prop.id,
            propName: prop.addr || prop.name,
            unitName: u.name,
            roomName: r.name,
            tenantName: tName,
            rent: r.rent || 0,
            confidence: conf,
          };
        }
      }
    }
  }

  return bestMatch;
}
