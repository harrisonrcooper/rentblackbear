"use client";
// app/reference-confirm/page.jsx
// Public page the reference lands on after clicking the link in the check email.
// Validates the token via GET, shows a short form, submits via POST.
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function RefConfirmInner() {
  const params      = useSearchParams();
  const token       = params.get("token");
  const appId       = params.get("appId");
  const refId       = params.get("refId");

  const [status, setStatus]   = useState("loading"); // loading | form | already | done | error
  const [info, setInfo]       = useState(null);
  const [response, setResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg]   = useState("");

  useEffect(() => {
    if (!token || !appId || !refId) { setStatus("error"); setErrMsg("This link is invalid or incomplete."); return; }
    fetch(`/api/reference-confirm?token=${token}&appId=${appId}&refId=${refId}`)
      .then(r => r.json())
      .then(data => {
        if (!data.ok) { setStatus("error"); setErrMsg(data.error || "This link is not valid."); return; }
        if (data.alreadyResponded) { setStatus("already"); return; }
        setInfo(data);
        setStatus("form");
      })
      .catch(() => { setStatus("error"); setErrMsg("Something went wrong. Please try again."); });
  }, [token, appId, refId]);

  async function submit() {
    if (!response.trim()) { setErrMsg("Please write a brief response before submitting."); return; }
    setErrMsg("");
    setSubmitting(true);
    try {
      const r = await fetch("/api/reference-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, appId, refId, response }),
      });
      const data = await r.json();
      if (data.ok) { setStatus("done"); }
      else { setErrMsg(data.error || "Submission failed. Please try again."); }
    } catch { setErrMsg("Network error. Please try again."); }
    setSubmitting(false);
  }

  const card = (children) => (
    <div style={{
      minHeight: "100vh", background: "#f5f0e8",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", padding: 20,
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: "40px 36px",
        maxWidth: 520, width: "100%",
        boxShadow: "0 8px 40px rgba(0,0,0,.1)",
        border: "1px solid rgba(0,0,0,.06)",
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#d4a853", marginBottom: 20, letterSpacing: -.2 }}>
          Black Bear Rentals
        </div>
        {children}
      </div>
    </div>
  );

  if (status === "loading") return card(
    <div style={{ color: "#6b5e52", fontSize: 14, textAlign: "center", padding: "20px 0" }}>
      Verifying your link&hellip;
    </div>
  );

  if (status === "error") return card(<>
    <div style={{ fontSize: 22, fontWeight: 800, color: "#c45c4a", marginBottom: 10 }}>Invalid Link</div>
    <p style={{ color: "#5c4a3a", fontSize: 14, lineHeight: 1.7 }}>{errMsg}</p>
    <p style={{ color: "#aaa", fontSize: 12, marginTop: 16 }}>
      If you believe this is an error, please reply directly to the email you received.
    </p>
  </>);

  if (status === "already") return card(<>
    <div style={{ fontSize: 36, marginBottom: 12, textAlign: "center" }}>&#10003;</div>
    <div style={{ fontSize: 22, fontWeight: 800, color: "#4a7c59", marginBottom: 10, textAlign: "center" }}>
      Already Received
    </div>
    <p style={{ color: "#5c4a3a", fontSize: 14, lineHeight: 1.7, textAlign: "center" }}>
      We already have your response on file. Thank you for your time!
    </p>
  </>);

  if (status === "done") return card(<>
    <div style={{ fontSize: 36, marginBottom: 12, textAlign: "center" }}>&#127881;</div>
    <div style={{ fontSize: 22, fontWeight: 800, color: "#4a7c59", marginBottom: 10, textAlign: "center" }}>
      Thank You!
    </div>
    <p style={{ color: "#5c4a3a", fontSize: 14, lineHeight: 1.7, textAlign: "center" }}>
      Your response has been received. We truly appreciate you taking the time to help{" "}
      {info?.applicantName ? <strong>{info.applicantName}</strong> : "our applicant"} in their housing search.
    </p>
  </>);

  // status === "form"
  return card(<>
    <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1714", marginBottom: 6 }}>
      Reference Request
    </div>
    <p style={{ color: "#5c4a3a", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
      Hi {info?.refFirstName || "there"}, you were listed as a{" "}
      <strong>{info?.refRelationship || "reference"}</strong> by{" "}
      <strong>{info?.applicantName || "an applicant"}</strong>, who is applying to rent a room at one of our properties.
    </p>

    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color: "#6b5e52",
        textTransform: "uppercase", letterSpacing: .6, marginBottom: 8,
      }}>
        A few quick questions
      </div>
      <ul style={{ fontSize: 13, color: "#5c4a3a", lineHeight: 2, paddingLeft: 18, marginBottom: 0 }}>
        <li>In what capacity do you know {info?.applicantName?.split(" ")[0] || "this person"}?</li>
        <li>Would you consider them dependable, responsible, and trustworthy?</li>
        <li>Is there anything else you would like us to know?</li>
      </ul>
    </div>

    <div style={{ marginBottom: 16 }}>
      <label style={{
        fontSize: 10, fontWeight: 700, color: "#6b5e52",
        textTransform: "uppercase", letterSpacing: .6, marginBottom: 6, display: "block",
      }}>
        Your Response *
      </label>
      <textarea
        value={response}
        onChange={e => { setResponse(e.target.value); setErrMsg(""); }}
        placeholder="Write your response here. Even a few sentences is helpful."
        rows={6}
        style={{
          width: "100%", padding: "12px 14px", borderRadius: 10,
          border: errMsg ? "2px solid #c45c4a" : "1.5px solid rgba(0,0,0,.12)",
          fontSize: 13, fontFamily: "inherit", resize: "vertical",
          outline: "none", lineHeight: 1.6, color: "#1a1714",
          boxSizing: "border-box",
        }}
      />
      {errMsg && (
        <div style={{ fontSize: 11, color: "#c45c4a", fontWeight: 600, marginTop: 5 }}>
          {errMsg}
        </div>
      )}
    </div>

    <button
      onClick={submit}
      disabled={submitting}
      style={{
        width: "100%", padding: "14px", borderRadius: 10, border: "none",
        background: submitting ? "#aaa" : "#d4a853", color: "#1a1714",
        fontWeight: 700, fontSize: 14, cursor: submitting ? "default" : "pointer",
        fontFamily: "inherit", transition: "opacity .15s",
      }}>
      {submitting ? "Submitting..." : "Submit My Reference \u2192"}
    </button>

    <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", marginTop: 14, lineHeight: 1.5 }}>
      You can also reply directly to the email you received instead of using this form.
    </p>
  </>);
}

export default function RefConfirmPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", color: "#6b5e52" }}>
        Loading...
      </div>
    }>
      <RefConfirmInner />
    </Suspense>
  );
}
