"use client";
import { useState, useRef } from "react";

export default function SignatureCanvas({ onSave, onCancel, C }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [hasSig, setHasSig] = useState(false);
  const getPos = (e, c) => { const r = c.getBoundingClientRect(); const s = e.touches ? e.touches[0] : e; return { x: s.clientX - r.left, y: s.clientY - r.top }; };
  const start = (e) => { drawing.current = true; const c = canvasRef.current; const ctx = c.getContext("2d"); const p = getPos(e, c); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const draw = (e) => { if (!drawing.current) return; e.preventDefault(); const c = canvasRef.current; const ctx = c.getContext("2d"); ctx.strokeStyle = "#1a1714"; ctx.lineWidth = 2; ctx.lineCap = "round"; const p = getPos(e, c); ctx.lineTo(p.x, p.y); ctx.stroke(); setHasSig(true); };
  const stop = () => { drawing.current = false; };
  const clear = () => { canvasRef.current.getContext("2d").clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); setHasSig(false); };
  return (
    <div>
      <div style={{ fontSize: 11, color: "#999", marginBottom: 8 }}>Sign below using your mouse or finger</div>
      <canvas ref={canvasRef} width={480} height={120} style={{ width: "100%", height: 120, border: "1.5px solid rgba(0,0,0,.12)", borderRadius: 8, background: "#fafaf8", cursor: "crosshair", touchAction: "none" }}
        onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop}
        onTouchStart={start} onTouchMove={draw} onTouchEnd={stop} />
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button onClick={clear} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Clear</button>
        <button onClick={onCancel} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Cancel</button>
        <button onClick={() => hasSig && onSave(canvasRef.current.toDataURL())} disabled={!hasSig} style={{ flex: 1, padding: "8px 16px", borderRadius: 8, border: "none", background: hasSig ? C.bg : "rgba(0,0,0,.08)", color: hasSig ? C.accent : "#bbb", cursor: hasSig ? "pointer" : "default", fontSize: 13, fontWeight: 800 }}>Sign Lease</button>
      </div>
    </div>
  );
}
