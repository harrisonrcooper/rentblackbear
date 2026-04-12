"use client";

/**
 * Next.js error boundary for /admin routes.
 * Catches runtime errors and shows a clean fallback instead of a white screen.
 */
export default function AdminError({ error, reset }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "60vh", padding: 32,
    }}>
      <div className="card" style={{ textAlign: "center", padding: 40, maxWidth: 480 }}>
        <div className="card-bd">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h2 style={{ margin: "0 0 8px", fontSize: 22, color: "#2c2420" }}>
            Something went wrong
          </h2>
          <p style={{ margin: "0 0 20px", color: "#6b5e52", fontSize: 14 }}>
            {error?.message || "An unexpected error occurred."}
          </p>
          <button
            className="btn"
            onClick={reset}
            style={{
              background: "#4a7c59", color: "#fff", border: "none",
              borderRadius: 8, padding: "10px 24px", cursor: "pointer", fontWeight: 600,
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
