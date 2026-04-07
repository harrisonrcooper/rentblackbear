"use client";
import { useState } from "react";

// ── Supabase ─────────────────────────────────────────────────────────
const SUPA_URL = "https://vxysaclhucdjxzcknoar.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eXNhY2xodWNkanh6Y2tub2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzA5NTEsImV4cCI6MjA4ODg0Njk1MX0.AiAkd5eZZm8ztaUsfGUj-XF7zL_mwCTy7bAGF-mqmoM";
const supa = (path, opts = {}) =>
  fetch(SUPA_URL + "/rest/v1/" + path, {
    ...opts,
    headers: {
      apikey: SUPA_KEY,
      Authorization: "Bearer " + SUPA_KEY,
      "Content-Type": "application/json",
      Prefer: opts.prefer || "return=representation",
      ...(opts.headers || {}),
    },
  });

// ── Icons (flat inline SVGs) ─────────────────────────────────────────
function IconPlus({ size = 14, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="8" y1="3" x2="8" y2="13" />
      <line x1="3" y1="8" x2="13" y2="8" />
    </svg>
  );
}
function IconEdit({ size = 13, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.5 1.5l3 3L5 14H2v-3z" />
      <line x1="9" y1="4" x2="12" y2="7" />
    </svg>
  );
}
function IconCopy({ size = 13, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="5" width="9" height="9" rx="1.5" />
      <path d="M11 5V3a1.5 1.5 0 00-1.5-1.5H3A1.5 1.5 0 001.5 3v6.5A1.5 1.5 0 003 11h2" />
    </svg>
  );
}
function IconDoc({ size = 13, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 1H4a1.5 1.5 0 00-1.5 1.5v11A1.5 1.5 0 004 15h8a1.5 1.5 0 001.5-1.5V5.5z" />
      <polyline points="9,1 9,5.5 13.5,5.5" />
    </svg>
  );
}
function IconTrash({ size = 13, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,4 4,14 12,14 13,4" />
      <line x1="1.5" y1="4" x2="14.5" y2="4" />
      <path d="M6 4V2.5a1 1 0 011-1h2a1 1 0 011 1V4" />
    </svg>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return "Unknown";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Component ────────────────────────────────────────────────────────
export default function LeaseTemplateList({
  templates,
  setTemplates,
  selectedTemplate,
  setSelectedTemplate,
  onEdit,
  onCreateLease,
  settings,
}) {
  const [duplicating, setDuplicating] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const accent = (settings && settings.adminAccent) || "#4a7c59";

  // ── Duplicate ──────────────────────────────────────────────────────
  async function handleDuplicate(tmpl) {
    if (duplicating) return;
    setDuplicating(tmpl.id);
    try {
      const copy = {
        name: tmpl.name + " (Copy)",
        sections: tmpl.sections || [],
        landlordName: tmpl.landlordName || null,
        company: tmpl.company || null,
        landlordEmail: tmpl.landlordEmail || null,
        is_active: false,
        type: tmpl.type || null,
        workspace_id: tmpl.workspace_id || null,
      };
      const res = await supa("lease_templates", {
        method: "POST",
        body: JSON.stringify(copy),
      });
      if (!res.ok) throw new Error("Failed to duplicate");
      const rows = await res.json();
      if (rows && rows.length > 0) {
        setTemplates((prev) => [...prev, rows[0]]);
      }
    } catch (e) {
      console.error("Duplicate error:", e);
      alert("Failed to duplicate template. Please try again.");
    } finally {
      setDuplicating(null);
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────
  async function handleDelete(tmpl) {
    if (deleting) return;
    setDeleting(tmpl.id);
    try {
      // Check if any executed leases reference this template
      const checkRes = await supa(
        "lease_instances?template_id=eq." + tmpl.id + "&select=id&limit=1"
      );
      if (checkRes.ok) {
        const refs = await checkRes.json();
        if (refs && refs.length > 0) {
          alert(
            "This template cannot be deleted because it has executed leases referencing it."
          );
          setConfirmDeleteId(null);
          setDeleting(null);
          return;
        }
      }

      const res = await supa("lease_templates?id=eq." + tmpl.id, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setTemplates((prev) => prev.filter((t) => t.id !== tmpl.id));
      if (selectedTemplate && selectedTemplate.id === tmpl.id) {
        setSelectedTemplate(null);
      }
      setConfirmDeleteId(null);
    } catch (e) {
      console.error("Delete error:", e);
      alert("Failed to delete template. Please try again.");
    } finally {
      setDeleting(null);
    }
  }

  // ── Create new blank template ──────────────────────────────────────
  async function handleCreateNew() {
    try {
      const newTmpl = {
        name: "Untitled Template",
        sections: [],
        is_active: false,
        workspace_id:
          templates.length > 0 ? templates[0].workspace_id : null,
      };
      const res = await supa("lease_templates", {
        method: "POST",
        body: JSON.stringify(newTmpl),
      });
      if (!res.ok) throw new Error("Failed to create");
      const rows = await res.json();
      if (rows && rows.length > 0) {
        setTemplates((prev) => [...prev, rows[0]]);
        setSelectedTemplate(rows[0]);
        if (onEdit) onEdit(rows[0]);
      }
    } catch (e) {
      console.error("Create error:", e);
      alert("Failed to create template. Please try again.");
    }
  }

  // ── Count active sections ──────────────────────────────────────────
  function sectionCount(tmpl) {
    if (!tmpl.sections || !Array.isArray(tmpl.sections)) return 0;
    return tmpl.sections.filter((s) => s.on !== false).length;
  }

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1a1714" }}>
          Lease Templates
        </h2>
        <button
          className="btn btn-gold btn-sm"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: accent,
            color: "#fff",
            fontSize: 11,
            fontWeight: 600,
          }}
          onClick={handleCreateNew}
        >
          <IconPlus size={12} color="#fff" />
          New Template
        </button>
      </div>

      {/* Empty state */}
      {(!templates || templates.length === 0) && (
        <div
          className="card"
          style={{
            padding: 40,
            textAlign: "center",
            color: "rgba(0,0,0,.45)",
            fontSize: 13,
          }}
        >
          No lease templates yet. Create one to get started.
        </div>
      )}

      {/* Template cards */}
      {templates &&
        templates.map((tmpl) => {
          const active = tmpl.is_active !== false;
          const sections = sectionCount(tmpl);
          const isConfirmingDelete = confirmDeleteId === tmpl.id;

          return (
            <div
              className="card"
              key={tmpl.id}
              style={{
                borderLeft: selectedTemplate && selectedTemplate.id === tmpl.id
                  ? "3px solid " + accent
                  : "3px solid transparent",
              }}
            >
              <div className="card-bd" style={{ padding: "18px 20px" }}>
                {/* Top row: name + badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#1a1714",
                      lineHeight: 1.3,
                    }}
                  >
                    {tmpl.name || "Untitled"}
                  </div>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: 9,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: active
                        ? "rgba(74,124,89,.1)"
                        : "rgba(0,0,0,.05)",
                      color: active ? accent : "rgba(0,0,0,.4)",
                    }}
                  >
                    {active ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Meta row */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 16,
                    fontSize: 11,
                    color: "rgba(0,0,0,.5)",
                    marginBottom: 14,
                  }}
                >
                  <span>
                    {sections} {sections === 1 ? "section" : "sections"}
                  </span>
                  {tmpl.landlordName && (
                    <span>
                      {tmpl.landlordName}
                      {tmpl.company ? " / " + tmpl.company : ""}
                    </span>
                  )}
                  {tmpl.type && <span>Type: {tmpl.type}</span>}
                  <span>Updated {fmtDate(tmpl.updated_at || tmpl.created_at)}</span>
                </div>

                {/* Actions */}
                {!isConfirmingDelete && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <button
                      className="btn btn-out btn-sm"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 10,
                      }}
                      onClick={() => {
                        setSelectedTemplate(tmpl);
                        if (onEdit) onEdit(tmpl);
                      }}
                    >
                      <IconEdit size={11} />
                      Edit Template
                    </button>

                    <button
                      className="btn btn-out btn-sm"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 10,
                      }}
                      disabled={duplicating === tmpl.id}
                      onClick={() => handleDuplicate(tmpl)}
                    >
                      <IconCopy size={11} />
                      {duplicating === tmpl.id ? "Duplicating..." : "Duplicate"}
                    </button>

                    <button
                      className="btn btn-out btn-sm"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 10,
                        color: accent,
                        fontWeight: 600,
                      }}
                      onClick={() => {
                        if (onCreateLease) onCreateLease(tmpl);
                      }}
                    >
                      <IconDoc size={11} color={accent} />
                      New Lease from This
                    </button>

                    <button
                      className="btn btn-sm"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 10,
                        marginLeft: "auto",
                        background: "transparent",
                        color: "rgba(0,0,0,.3)",
                        border: "none",
                        padding: "5px 8px",
                      }}
                      onClick={() => setConfirmDeleteId(tmpl.id)}
                    >
                      <IconTrash size={11} color="rgba(0,0,0,.3)" />
                    </button>
                  </div>
                )}

                {/* Delete confirmation */}
                {isConfirmingDelete && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 12px",
                      background: "rgba(196,92,74,.05)",
                      borderRadius: 8,
                      fontSize: 11,
                    }}
                  >
                    <span style={{ color: "#c45c4a", fontWeight: 600 }}>
                      Delete this template?
                    </span>
                    <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                      <button
                        className="btn btn-out btn-sm"
                        style={{ fontSize: 10 }}
                        onClick={() => setConfirmDeleteId(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-red btn-sm"
                        style={{ fontSize: 10, fontWeight: 600 }}
                        disabled={deleting === tmpl.id}
                        onClick={() => handleDelete(tmpl)}
                      >
                        {deleting === tmpl.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
