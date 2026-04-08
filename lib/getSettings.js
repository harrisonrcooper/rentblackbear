// lib/getSettings.js
// Shared helper — loads hq-settings from Supabase for use in API routes.
// All values fall back to sensible defaults if settings haven't been saved yet.

import { loadAppData } from "./supabase-server.js";

const DEFAULTS = {
  companyName: "Black Bear Rentals",
  legalName: "Oak & Main Development LLC",
  phone: "(850) 696-8101",
  email: "blackbearhousing@gmail.com",
  city: "Huntsville, Alabama",
  siteUrl: "https://rentblackbear.com",
  notifAppReceived: true,
  notifLeaseSent: true,
  notifLeaseSigned: true,
  notifPaymentReceived: true,
  notifMaintenanceRequest: true,
};

export async function getSettings() {
  try {
    const saved = await loadAppData("hq-settings", {});
    return { ...DEFAULTS, ...saved };
  } catch {
    return { ...DEFAULTS };
  }
}

// Build consistent email header/footer using live settings
export function emailHeader(s) {
  return `
    <div style="background:#1a1714;padding:28px 32px;border-radius:12px 12px 0 0;">
      <div style="font-family:Georgia,serif;font-size:22px;color:#d4a853;font-weight:700;">🐻 ${s.companyName}</div>
      <div style="font-size:12px;color:#c4a882;margin-top:4px;">${s.city}</div>
    </div>`;
}

export function emailFooter(s) {
  return `
    <hr style="margin:28px 0;border:none;border-top:1px solid #e8e5e0;"/>
    <p style="font-size:11px;color:#999;margin:0;">
      — ${s.companyName} · ${s.legalName}<br/>
      ${s.city} · <a href="${s.siteUrl}" style="color:#d4a853;">${s.siteUrl.replace("https://","")}</a>
    </p>`;
}

export function emailWrap(content, s) {
  return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:580px;margin:0 auto;color:#1a1714;">
      ${emailHeader(s)}
      <div style="background:#fff;padding:32px;border:1px solid #e8e5e0;border-top:none;border-radius:0 0 12px 12px;">
        ${content}
        ${emailFooter(s)}
      </div>
    </div>`;
}

export function fromAddress(s) {
  // From must be a verified Resend domain — only display name is dynamic
  return `${s.companyName} <hello@rentblackbear.com>`;
}

export const fmtMoney = (n) =>
  n != null && !isNaN(Number(n)) ? `$${Number(n).toLocaleString()}` : "—";
