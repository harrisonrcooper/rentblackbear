"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const SUPA_URL="https://vxysaclhucdjxzcknoar.supabase.co";
const SUPA_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eXNhY2xodWNkanh6Y2tub2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzA5NTEsImV4cCI6MjA4ODg0Njk1MX0.AiAkd5eZZm8ztaUsfGUj-XF7zL_mwCTy7bAGF-mqmoM";
const supa=(path,opts={})=>fetch(`${SUPA_URL}/rest/v1/${path}`,{...opts,headers:{"apikey":SUPA_KEY,"Authorization":`Bearer ${SUPA_KEY}`,"Content-Type":"application/json","Prefer":opts.prefer||"return=representation",...(opts.headers||{})}});
async function loadKey(k,fb){try{const r=await supa(`app_data?key=eq.${k}&select=value`);const d=await r.json();return d?.[0]?.value||fb;}catch{return fb;}}
async function saveKey(k,v){try{await supa("app_data",{method:"POST",prefer:"resolution=merge-duplicates",body:JSON.stringify({key:k,value:v})});}catch{}}

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Plus Jakarta Sans',sans-serif;background:#f5f4f1;color:#1a1714;-webkit-font-smoothing:antialiased}
.wrap{max-width:760px;margin:0 auto;padding:0 16px 80px}
.header{background:#1a1714;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}
.logo{font-family:'DM Serif Display',serif;font-size:16px;color:#f5f0e8;display:flex;align-items:center;gap:8px}
.logo span{color:#d4a853}
.progress-bar{background:rgba(255,255,255,.1);height:3px;position:absolute;bottom:0;left:0;right:0}
.progress-fill{height:100%;background:#d4a853;transition:width .4s ease}
.status-pill{font-size:10px;font-weight:700;padding:3px 10px;border-radius:99px;text-transform:uppercase;letter-spacing:.5px}
.status-pending{background:rgba(212,168,83,.15);color:#d4a853}
.status-done{background:rgba(74,124,89,.15);color:#4a7c59}

.summary-card{background:#fff;border-radius:12px;border:1px solid rgba(0,0,0,.06);padding:20px;margin:20px 0;box-shadow:0 2px 12px rgba(0,0,0,.04)}
.summary-title{font-family:'DM Serif Display',serif;font-size:20px;color:#1a1714;margin-bottom:4px}
.summary-sub{font-size:11px;color:#999;margin-bottom:16px}
.summary-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid rgba(0,0,0,.08);border-radius:8px;overflow:hidden}
.summary-row{display:contents}
.summary-row>div{padding:9px 12px;font-size:12px;border-bottom:1px solid rgba(0,0,0,.06);border-right:1px solid rgba(0,0,0,.06)}
.summary-row>div:nth-child(2n){border-right:none}
.summary-row:last-child>div{border-bottom:none}
.sum-label{color:#999;font-weight:500}
.sum-val{font-weight:700;color:#1a1714}
.sum-highlight{color:#d4a853}

.lease-doc{background:#fff;border-radius:12px;border:1px solid rgba(0,0,0,.06);box-shadow:0 2px 12px rgba(0,0,0,.04);margin-bottom:20px;overflow:hidden}
.lease-header{background:#1a1714;padding:28px 32px;text-align:center}
.lease-header h1{font-family:'DM Serif Display',serif;font-size:26px;color:#f5f0e8;margin-bottom:4px}
.lease-header p{font-size:12px;color:#c4a882}
.lease-body{padding:32px}
.section{margin-bottom:32px;padding-bottom:32px;border-bottom:1px solid rgba(0,0,0,.06)}
.section:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
.section-num{font-size:9px;font-weight:800;color:#d4a853;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px}
.section-title{font-family:'DM Serif Display',serif;font-size:17px;color:#1a1714;margin-bottom:12px}
.section-body{font-size:13px;color:#3d3529;line-height:1.8}
.section-body p{margin-bottom:10px}
.section-body p:last-child{margin-bottom:0}
.section-body ul{padding-left:20px;margin:8px 0}
.section-body li{margin-bottom:6px}
.section-body strong{color:#1a1714;font-weight:700}
.var{color:#1a1714;font-weight:700;background:rgba(212,168,83,.1);padding:0 3px;border-radius:3px}

.initials-zone{margin-top:20px;padding:14px 16px;background:rgba(212,168,83,.05);border:2px dashed rgba(212,168,83,.3);border-radius:10px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.initials-zone.signed{border-color:rgba(74,124,89,.3);background:rgba(74,124,89,.04)}
.initials-label{font-size:11px;color:#9a7422;font-weight:600}
.initials-zone.signed .initials-label{color:#4a7c59}
.initials-input{border:1.5px solid rgba(212,168,83,.4);border-radius:7px;padding:6px 12px;font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;color:#1a1714;width:80px;text-align:center;outline:none;background:#fff;text-transform:uppercase}
.initials-input:focus{border-color:#d4a853}
.initials-preview{font-family:'DM Serif Display',serif;font-size:18px;color:#1a1714;min-width:80px;text-align:center;padding:4px 0}

.sig-zone{margin-top:24px;border:2px dashed rgba(196,92,74,.3);border-radius:12px;padding:20px;background:rgba(196,92,74,.02)}
.sig-zone.signed{border-color:rgba(74,124,89,.3);background:rgba(74,124,89,.02)}
.sig-label{font-size:11px;font-weight:700;color:#c45c4a;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px}
.sig-zone.signed .sig-label{color:#4a7c59}
.sig-canvas{border:1.5px solid rgba(0,0,0,.1);border-radius:8px;cursor:crosshair;display:block;background:#fff;touch-action:none}
.sig-actions{display:flex;gap:8px;margin-top:8px}
.sig-preview{max-height:60px;max-width:100%}

.sticky-bar{position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid rgba(0,0,0,.08);padding:14px 20px;display:flex;gap:10px;align-items:center;justify-content:center;z-index:40;box-shadow:0 -4px 20px rgba(0,0,0,.08)}
.remaining-badge{font-size:11px;color:#c45c4a;font-weight:700;padding:5px 10px;background:rgba(196,92,74,.08);border-radius:99px}
.btn{padding:12px 24px;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;border:none;transition:all .15s}
.btn-gold{background:#d4a853;color:#1a1714}
.btn-gold:hover{background:#c09040}
.btn-gold:disabled{background:#ccc;cursor:not-allowed}
.btn-out{background:transparent;border:1.5px solid rgba(0,0,0,.12);color:#5c4a3a}
.btn-sm{padding:7px 14px;font-size:11px}

.error-bar{background:#fcebeb;border:1px solid rgba(196,92,74,.25);border-radius:10px;padding:12px 16px;margin:16px 0;font-size:12px;color:#c45c4a;animation:shake .4s ease}
@keyframes shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-4px)}30%{transform:translateX(4px)}45%{transform:translateX(-3px)}60%{transform:translateX(3px)}75%{transform:translateX(-1px)}}
.error-item{display:flex;align-items:center;gap:8px;padding:3px 0}
.error-dot{width:5px;height:5px;border-radius:50%;background:#c45c4a;flex-shrink:0}

.done-screen{text-align:center;padding:80px 20px}
.done-ic{font-size:56px;margin-bottom:20px}
.done-screen h1{font-family:'DM Serif Display',serif;font-size:28px;color:#1a1714;margin-bottom:8px}
.done-screen p{font-size:14px;color:#999;line-height:1.6;max-width:400px;margin:0 auto 24px}
.done-detail{background:#fff;border-radius:12px;border:1px solid rgba(0,0,0,.06);padding:16px;max-width:400px;margin:0 auto;font-size:12px}
.done-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(0,0,0,.04);color:#5c4a3a}
.done-row:last-child{border:none}

.loading{display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Plus Jakarta Sans',sans-serif;color:#999}
.loading-inner{text-align:center}
.loading-bear{font-size:40px;animation:bounce 1.5s ease infinite;display:block;margin-bottom:12px}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}

@media(max-width:600px){
  .summary-grid{grid-template-columns:1fr}
  .summary-row>div{border-right:none}
  .lease-body{padding:20px}
}
`;

// Signature canvas component - draw only
function SigCanvas({ onSave, height=120 }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef(null);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const source = e.touches ? e.touches[0] : e;
    return { x: source.clientX - rect.left, y: source.clientY - rect.top };
  };

  const start = useCallback((e) => {
    e.preventDefault();
    drawing.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    lastPos.current = pos;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 1, 0, Math.PI * 2);
    ctx.fillStyle = "#1a1714";
    ctx.fill();
  }, []);

  const move = useCallback((e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#1a1714";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
  }, []);

  const end = useCallback(() => { drawing.current = false; }, []);

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const save = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const hasContent = Array.from(data).some((v, i) => i % 4 === 3 && v > 0);
    if (!hasContent) return;
    onSave(canvas.toDataURL("image/png"));
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="sig-canvas"
        width={Math.min(window.innerWidth - 80, 680)}
        height={height}
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end}
      />
      <div className="sig-actions">
        <button className="btn btn-out btn-sm" onClick={clear}>Clear</button>
        <button className="btn btn-gold btn-sm" onClick={save}>Apply Signature</button>
      </div>
    </div>
  );
}

// Render lease body substituting {{VARIABLE}} with actual values
function renderContent(text, vars) {
  if (!text) return "";
  return text.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    const val = vars[key.trim()];
    return val !== undefined ? `<span class="var">${val}</span>` : `<span style="color:#c45c4a">{{${key}}}</span>`;
  });
}

export default function LeaseSignPage() {
  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [initials, setInitials] = useState({}); // sectionId -> string
  const [signature, setSignature] = useState(null); // base64
  const [showSigCanvas, setShowSigCanvas] = useState(false);
  const [errors, setErrors] = useState([]);
  const [shakeKey, setShakeKey] = useState(0); // increments on each submit attempt to re-trigger wiggle
  const [token, setToken] = useState(null);
  const [doorCode, setDoorCode] = useState(""); // 4-digit passcode, pre-filled from application
  const doorCodeRef = useRef(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    if (!t) { setError("No lease token found."); setLoading(false); return; }
    setToken(t);
    (async () => {
      const leases = await loadKey("hq-leases", []);
      const found = leases.find(l => l.signingToken === t);
      if (!found) { setError("Lease not found or link expired."); setLoading(false); return; }
      if (found.status === "executed") { setDone(true); setLease(found); setLoading(false); return; }
      if (found.status !== "pending_tenant") { setError("This lease is not ready for your signature yet."); setLoading(false); return; }
      // Restore any partial progress
      if (found.tenantInitials) setInitials(found.tenantInitials);
      if (found.doorCode) setDoorCode(found.doorCode);
      setLease(found);
      setLoading(false);
    })();
  }, []);

  const totalRequired = lease ? (lease.sections || []).filter(s => s.requiresInitials && s.active !== false).length + 1 : 0;
  const completedInitials = Object.keys(initials).filter(k => initials[k] && initials[k].trim().length >= 2).length;
  const completedSig = !!signature;
  const totalComplete = completedInitials + (completedSig ? 1 : 0);
  const pct = totalRequired > 0 ? Math.round(totalComplete / totalRequired * 100) : 0;

  const scrollToFirst = (missingIds) => {
    const id = missingIds[0];
    if (id === "doorCode") {
      if (doorCodeRef.current) doorCodeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSubmit = async () => {
    const errs = [];
    const missing = [];
    (lease.sections || []).filter(s => s.requiresInitials && s.active !== false).forEach(s => {
      if (!initials[s.id] || initials[s.id].trim().length < 2) {
        errs.push(`Initials required — ${s.title}`);
        missing.push(s.id);
      }
    });
    if (!signature) {
      errs.push("Final signature is required");
      missing.push("signature");
    }
    if (!/^\d{4}$/.test(doorCode)) {
      errs.push("Door code must be exactly 4 digits — numbers only");
      missing.push("doorCode");
    }
    if (errs.length > 0) {
      setErrors(errs);
      setShakeKey(k => k + 1);
      scrollToFirst(missing);
      return;
    }
    setErrors([]);
    setSubmitting(true);
    try {
      const now = new Date().toISOString();
      const fullDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      const leases = await loadKey("hq-leases", []);
      const updated = leases.map(l => l.id === lease.id ? {
        ...l,
        status: "executed",
        tenantSignature: signature,
        tenantSignedAt: now,
        tenantInitials: initials,
        doorCode: doorCode,
        executedAt: now,
      } : l);
      await saveKey("hq-leases", updated);

      // Write leaseSigned + confirmed passcode back to the applicant record
      if (lease.applicationId) {
        const apps = await loadKey("hq-apps", []);
        const updatedApps = apps.map(a => a.id === lease.applicationId ? {
          ...a,
          leaseSigned: true,
          leaseSignedAt: now,
          leaseId: lease.id,
          passcode: doorCode,
          lastContact: now.split("T")[0],
          history: [...(a.history || []), {
            from: a.status,
            to: a.status,
            date: now.split("T")[0],
            note: `Lease signed by tenant on ${fullDate}. Door code confirmed: ${doorCode}`
          }]
        } : a);
        await saveKey("hq-apps", updatedApps);
      }

      // Notify admin bell
      const notifs = await loadKey("hq-notifs", []);
      await saveKey("hq-notifs", [{
        id: Math.random().toString(36).slice(2),
        type: "lease",
        msg: `✍️ ${lease.tenantName} signed their lease — ${lease.room} at ${lease.property}`,
        date: now.split("T")[0],
        read: false,
        urgent: true
      }, ...notifs]);

      // Send email notifications (PM + tenant)
      try {
        await fetch("/api/lease-executed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenantName: lease.tenantName,
            tenantEmail: lease.tenantEmail,
            landlordEmail: lease.landlordEmail || "info@rentblackbear.com",
            property: lease.property,
            room: lease.room,
            rent: lease.rent,
            moveIn: lease.moveIn,
            leaseStart: lease.leaseStart,
            leaseEnd: lease.leaseEnd,
            sd: lease.sd,
            proratedRent: lease.proratedRent,
            executedAt: fullDate,
          })
        });
      } catch (e) {
        console.error("Email notification failed:", e);
      }

      setDone(true);
    } catch {
      setErrors(["Save failed — please try again."]);
    }
    setSubmitting(false);
  };

  const fmtDate = d => {
    if (!d) return "—";
    try { return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }); }
    catch { return d; }
  };

  if (loading) return (
    <><style>{CSS}</style>
    <div className="loading"><div className="loading-inner">
      <span className="loading-bear">🐻</span>
      <div>Loading your lease...</div>
    </div></div></>
  );

  if (error) return (
    <><style>{CSS}</style>
    <div className="loading"><div className="loading-inner" style={{ color: "#c45c4a" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Something went wrong</div>
      <div style={{ fontSize: 13, color: "#999" }}>{error}</div>
    </div></div></>
  );

  if (done && lease) return (
    <><style>{CSS}</style>
    <div style={{ background: "#1a1714", minHeight: "100vh" }}>
      <div className="header" style={{ position: "relative" }}>
        <div className="logo">🐻 Black Bear <span>Rentals</span></div>
      </div>
      <div className="wrap">
        <div className="done-screen">
          <div className="done-ic">🎉</div>
          <h1 style={{ color: "#f5f0e8" }}>Lease Executed!</h1>
          <p style={{ color: "#c4a882" }}>
            Your lease has been signed and countersigned. You'll receive a copy at {lease.tenantEmail}. Welcome home!
          </p>
          <div className="done-detail" style={{ background: "rgba(255,255,255,.06)", borderColor: "rgba(255,255,255,.08)" }}>
            <div className="done-row" style={{ color: "#c4a882" }}><span>Tenant</span><strong style={{ color: "#f5f0e8" }}>{lease.tenantName}</strong></div>
            <div className="done-row" style={{ color: "#c4a882" }}><span>Property</span><strong style={{ color: "#f5f0e8" }}>{lease.property}</strong></div>
            <div className="done-row" style={{ color: "#c4a882" }}><span>Room</span><strong style={{ color: "#f5f0e8" }}>{lease.room}</strong></div>
            <div className="done-row" style={{ color: "#c4a882" }}><span>Rent</span><strong style={{ color: "#d4a853" }}>${lease.rent?.toLocaleString()}/mo</strong></div>
            <div className="done-row" style={{ color: "#c4a882" }}><span>Move-in</span><strong style={{ color: "#f5f0e8" }}>{fmtDate(lease.moveIn)}</strong></div>
            <div className="done-row" style={{ color: "#c4a882" }}><span>Door Code</span><strong style={{ color: "#d4a853", fontFamily: "monospace", letterSpacing: 4 }}>{lease.doorCode || doorCode || "—"}</strong></div>
            <div className="done-row" style={{ color: "#c4a882" }}><span>Executed</span><strong style={{ color: "#4a7c59" }}>{new Date(lease.executedAt).toLocaleDateString()}</strong></div>
          </div>
        </div>
      </div>
    </div></>
  );

  if (!lease) return null;

  const vars = lease.variables || {};

  return (
    <><style>{CSS}</style>
    <div>
      {/* Header */}
      <div className="header" style={{ position: "sticky", top: 0 }}>
        <div className="logo">🐻 Black Bear <span>Rentals</span></div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#c4a882" }}>{totalComplete}/{totalRequired} complete</span>
          <span className={`status-pill ${pct === 100 ? "status-done" : "status-pending"}`}>
            {pct === 100 ? "Ready to Submit" : "Signing in Progress"}
          </span>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }}/></div>
      </div>

      <div className="wrap">
        {/* Summary table */}
        <div className="summary-card">
          <div className="summary-title">Rental Agreement</div>
          <div className="summary-sub">Review your lease carefully before signing. All fields marked with initials must be acknowledged.</div>
          <div className="summary-grid">
            <div className="summary-row">
              <div><div className="sum-label">Property</div><div className="sum-val">{lease.property}</div></div>
              <div><div className="sum-label">Room</div><div className="sum-val">{lease.room}</div></div>
            </div>
            <div className="summary-row">
              <div><div className="sum-label">Lease Start</div><div className="sum-val">{fmtDate(lease.leaseStart)}</div></div>
              <div><div className="sum-label">Lease End</div><div className="sum-val">{fmtDate(lease.leaseEnd)}</div></div>
            </div>
            <div className="summary-row">
              <div><div className="sum-label">Monthly Rent</div><div className="sum-val sum-highlight">${lease.rent?.toLocaleString()}/mo</div></div>
              <div><div className="sum-label">Security Deposit</div><div className="sum-val">${lease.sd?.toLocaleString()}</div></div>
            </div>
            {lease.proratedRent > 0 && <div className="summary-row">
              <div><div className="sum-label">Prorated Rent</div><div className="sum-val">${lease.proratedRent?.toLocaleString()}</div></div>
              <div><div className="sum-label">Tenant</div><div className="sum-val">{lease.tenantName}</div></div>
            </div>}
            <div className="summary-row">
              <div><div className="sum-label">Landlord</div><div className="sum-val">{lease.landlordName || "Carolina Cooper"}</div></div>
              <div><div className="sum-label">Door Code</div><div className="sum-val">{lease.doorCode || "—"}</div></div>
            </div>
          </div>
        </div>

        {/* Error bar */}
        {errors.length > 0 && (
          <div key={shakeKey} className="error-bar">
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Please complete the following before submitting:</div>
            {errors.map((e, i) => <div key={i} className="error-item"><div className="error-dot"/>{e}</div>)}
          </div>
        )}

        {/* Lease document */}
        <div className="lease-doc">
          <div className="lease-header">
            <h1>Rental Agreement</h1>
            <p>{lease.property} · {lease.room} · {fmtDate(lease.leaseStart)}</p>
          </div>
          <div className="lease-body">

            {/* Parties intro */}
            <div className="section">
              <div className="section-body">
                <p>This Rental Agreement ("Agreement") is entered into as of <strong>{fmtDate(lease.agreementDate || lease.leaseStart)}</strong>, between:</p>
                <p><strong>Property Manager/Agent:</strong> {lease.landlordName || "Carolina Cooper"}, {lease.company || "Black Bear Properties"} ("PROPERTY MANAGER"), and</p>
                <p><strong>Resident(s)/Lessee:</strong> <strong>{lease.tenantName}</strong> ("RESIDENT").</p>
                <p>As consideration for this agreement, PROPERTY MANAGER agrees to rent/lease to RESIDENT and RESIDENT agrees to rent/lease from PROPERTY MANAGER for use solely as a private residence, the premises located at <strong>{vars.PROPERTY_ADDRESS || lease.propertyAddress}</strong>, in the city of Huntsville, Alabama.</p>
                <p style={{ fontSize: 11, color: "#999", background: "rgba(0,0,0,.03)", padding: "10px 12px", borderRadius: 7 }}>
                  This lease is for a portion of the rental residence and not the entire dwelling unit. RESIDENT is entitled to shared use of common areas: living room, kitchen, eating area, hallways, and laundry room.
                </p>
              </div>
            </div>

            {/* Render dynamic sections */}
            {(lease.sections || []).filter(s => s.active !== false).map((section, idx) => (
              <div
                key={section.id}
                className="section"
                ref={el => sectionRefs.current[section.id] = el}
              >
                <div className="section-num">Section {idx + 1}</div>
                <div className="section-title">{section.title}</div>
                <div
                  className="section-body"
                  dangerouslySetInnerHTML={{ __html: renderContent(section.content, vars) }}
                />

                {/* Initials zone */}
                {section.requiresInitials && (
                  <div
                    className={`initials-zone ${initials[section.id] ? "signed" : ""}`}
                    ref={el => { if (!initials[section.id]) sectionRefs.current[section.id] = el; }}
                  >
                    <div>
                      <div className="initials-label">
                        {initials[section.id] ? "✓ Initialed" : "⚠ Initials required for this section"}
                      </div>
                      <div style={{ fontSize: 10, color: "#bbb", marginTop: 2 }}>Type 2–3 letters to acknowledge</div>
                    </div>
                    {initials[section.id]?.length >= 2
                      ? <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div className="initials-preview">{initials[section.id]}</div>
                          <button
                            onClick={() => setInitials(p => ({ ...p, [section.id]: "" }))}
                            style={{fontSize:9,color:"#999",background:"none",border:"1px solid rgba(0,0,0,.1)",borderRadius:5,padding:"2px 8px",cursor:"pointer",fontFamily:"inherit"}}
                          >edit</button>
                        </div>
                      : <input
                          className="initials-input"
                          maxLength={3}
                          placeholder="—"
                          value={initials[section.id] || ""}
                          autoComplete="off"
                          onChange={e => {
                            const val = e.target.value.replace(/[^a-zA-Z]/g,"").toUpperCase().slice(0,3);
                            setInitials(p => ({ ...p, [section.id]: val }));
                            setErrors(errs => errs.filter(err => !err.includes(section.title)));
                            // Auto-advance at 2+ chars
                            if (val.length >= 2) {
                              const allSections = (lease.sections || []).filter(s => s.requiresInitials && s.active !== false);
                              const currentIdx = allSections.findIndex(s => s.id === section.id);
                              const nextMissing = allSections.slice(currentIdx + 1).find(s => !initials[s.id] || initials[s.id].length < 2);
                              setTimeout(() => {
                                if (nextMissing) {
                                  const el = sectionRefs.current[nextMissing.id];
                                  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                                } else if (!signature) {
                                  const el = sectionRefs.current["signature"];
                                  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                                }
                              }, 350);
                            }
                          }}
                        />
                    }
                  </div>
                )}
              </div>
            ))}

            {/* Door code confirmation */}
            <div
              className="section"
              ref={doorCodeRef}
            >
              <div className="section-num">Confirm</div>
              <div className="section-title">Your Door Code</div>
              <div className="section-body">
                <p>Your 4-digit door code is written into this lease and will be programmed into your smart lock. It activates at 12:00am on your move-in day once your security deposit and first month's rent have been received.</p>
                <p style={{ fontSize: 11, color: "#999" }}>You may change it below if you'd like a different code before signing. Once submitted, contact your property manager to request a change.</p>
              </div>
              <div style={{ marginTop: 20, padding: 20, background: "rgba(212,168,83,.04)", border: `2px solid ${errors.some(e => e.includes("Door code")) ? "#c45c4a" : "rgba(212,168,83,.25)"}`, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9a7422", textTransform: "uppercase", letterSpacing: .5 }}>🔑 {/^\d{4}$/.test(doorCode) ? "✓ Door Code Set" : "Enter Your 4-Digit Code"}</div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={doorCode}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setDoorCode(val);
                    if (/^\d{4}$/.test(val)) setErrors(errs => errs.filter(e => !e.includes("Door code")));
                  }}
                  placeholder="_ _ _ _"
                  style={{
                    width: 130, textAlign: "center", fontSize: 30, fontWeight: 900, letterSpacing: 14,
                    fontFamily: "monospace", border: `2px solid ${errors.some(e => e.includes("Door code")) ? "#c45c4a" : /^\d{4}$/.test(doorCode) ? "rgba(74,124,89,.4)" : "rgba(212,168,83,.4)"}`,
                    borderRadius: 10, padding: "12px 8px", outline: "none", background: "#fff",
                    color: "#1a1714", animation: errors.some(e => e.includes("Door code")) ? "shake .4s ease" : "none"
                  }}
                />
                {/^\d{4}$/.test(doorCode)
                  ? <div style={{ fontSize: 11, color: "#4a7c59", fontWeight: 600 }}>✓ This code will be programmed into your lock on move-in day</div>
                  : <div style={{ fontSize: 11, color: "#c45c4a", fontWeight: 600 }}>Must be exactly 4 digits</div>
                }
                {errors.some(e => e.includes("Door code")) && (
                  <div style={{ fontSize: 11, color: "#c45c4a", fontWeight: 700, animation: `shake .4s ease` }}>
                    Door code must be exactly 4 digits — numbers only
                  </div>
                )}
              </div>
            </div>

            {/* Final signature */}
            <div
              className="section"
              ref={el => sectionRefs.current["signature"] = el}
            >
              <div className="section-num">Signatures</div>
              <div className="section-title">Receipt of Agreement</div>
              <div className="section-body">
                <p>THE RESIDENT UNDERSTANDS THAT THE EXECUTION OF THIS AGREEMENT ENTAILS AN IMPORTANT DECISION THAT HAS LEGAL IMPLICATIONS. RESIDENT IS ADVISED TO SEEK THEIR OWN COUNSEL, LEGAL OR OTHERWISE, REGARDING THE EXECUTION OF THIS AGREEMENT. RESIDENT HEREBY ACKNOWLEDGES THAT THEY HAVE READ THIS AGREEMENT, UNDERSTAND IT, AGREE TO IT, AND HAVE BEEN GIVEN A COPY.</p>
                <p style={{ fontSize: 11, color: "#999" }}>Electronic signatures are legally valid under the E-SIGN Act. By drawing your signature below, you agree to be legally bound by this Agreement.</p>
              </div>

              {/* Landlord signature (already signed) */}
              <div style={{ marginTop: 20, padding: 14, background: "rgba(74,124,89,.04)", border: "1px solid rgba(74,124,89,.15)", borderRadius: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#4a7c59", marginBottom: 8, textTransform: "uppercase", letterSpacing: .5 }}>Property Manager (Signed)</div>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  {lease.landlordSignature
                    ? <img src={lease.landlordSignature} alt="Landlord signature" className="sig-preview"/>
                    : <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: "#1a1714" }}>{lease.landlordName || "Carolina Cooper"}</div>
                  }
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{lease.landlordName || "Carolina Cooper"}</div>
                    <div style={{ fontSize: 10, color: "#999" }}>{lease.company || "Black Bear Properties"}</div>
                    <div style={{ fontSize: 10, color: "#999" }}>{lease.landlordSignedAt ? new Date(lease.landlordSignedAt).toLocaleDateString() : "—"}</div>
                  </div>
                </div>
              </div>

              {/* Tenant signature */}
              <div className={`sig-zone ${signature ? "signed" : ""}`} style={{ marginTop: 16 }}>
                <div className="sig-label">{signature ? "✓ Signature Captured" : "RESIDENT — Draw your signature below"}</div>
                {signature ? (
                  <div>
                    <img src={signature} alt="Your signature" className="sig-preview"/>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700 }}>{lease.tenantName}</div>
                        <div style={{ fontSize: 10, color: "#999" }}>RESIDENT · {new Date().toLocaleDateString()}</div>
                      </div>
                      <button className="btn btn-out btn-sm" onClick={() => { setSignature(null); setShowSigCanvas(true); }}>Re-sign</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {!showSigCanvas
                      ? <button className="btn btn-gold" onClick={() => setShowSigCanvas(true)} style={{ width: "100%" }}>✍ Draw My Signature</button>
                      : <SigCanvas onSave={(data) => {
                          setSignature(data);
                          setShowSigCanvas(false);
                          setErrors(errs => errs.filter(e => !e.includes("signature")));
                          // Scroll to submit bar after signing
                          setTimeout(() => {
                            const el = document.querySelector(".sticky-bar");
                            if (el) el.scrollIntoView({ behavior: "smooth", block: "end" });
                          }, 400);
                        }} />
                    }
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Error bar at bottom too */}
        {errors.length > 0 && (
          <div key={`bottom-${shakeKey}`} className="error-bar">
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Still missing:</div>
            {errors.map((e, i) => <div key={i} className="error-item"><div className="error-dot"/>{e}</div>)}
          </div>
        )}
      </div>

      {/* Sticky submit bar */}
      <div className="sticky-bar">
        {totalComplete < totalRequired && (
          <span className="remaining-badge">{totalRequired - totalComplete} remaining</span>
        )}
        <button
          className="btn btn-gold"
          disabled={submitting}
          onClick={handleSubmit}
          style={{ minWidth: 180 }}
        >
          {submitting ? "Submitting..." : pct === 100 ? "✓ Submit Signed Lease" : "Submit Lease"}
        </button>
      </div>
    </div></>
  );
}
