"use client";
import { hexRgba, fmtD, sCard, sLabel } from "./PortalShared";

export default function CommunityTab({
  tenant, C, t,
  communityPosts, communityInput, setCommunityInput, communityPosting, postToCommunity,
  amenities, amenityBookings, bookingForm, setBookingForm, bookAmenity, cancelBooking,
}) {
  return (
    <div style={{ animation: "fadeIn .2s" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>{t.community?.title || "Community"}</h2>

      <div style={sCard}>
        <span style={sLabel}>{t.community?.board || "Community Board"}</span>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <input value={communityInput} onChange={e => setCommunityInput(e.target.value)} placeholder={t.community?.placeholder || "Share something with your neighbors..."} onKeyDown={e => e.key === "Enter" && postToCommunity()} style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 12 }} aria-label="Community post input" />
          <button onClick={postToCommunity} disabled={!communityInput.trim() || communityPosting} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: communityInput.trim() ? C.bg : "rgba(0,0,0,.08)", color: communityInput.trim() ? C.accent : "#bbb", cursor: communityInput.trim() ? "pointer" : "default", fontWeight: 800, fontSize: 12, whiteSpace: "nowrap" }} aria-label="Post to community">
            {communityPosting ? "..." : (t.community?.post || "Post")}
          </button>
        </div>
        {communityPosts.length === 0 && <div style={{ fontSize: 12, color: "#999", textAlign: "center", padding: 20 }}>{t.community?.noPosts || "No posts yet."}</div>}
        {communityPosts.map(post => (
          <div key={post.id} style={{ padding: "12px 0", borderTop: "1px solid rgba(0,0,0,.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: post.author === tenant?.name ? C.accent : C.text }}>{post.author}{post.author === tenant?.name ? " (you)" : ""}</span>
              <span style={{ fontSize: 10, color: "#999" }}>{fmtD(post.created_at?.split?.("T")?.[0] || post.created_at)}</span>
            </div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{post.body}</div>
          </div>
        ))}
      </div>

      <div style={{ ...sCard, marginTop: 12 }}>
        <span style={sLabel}>{t.community?.amenities || "Amenity Booking"}</span>
        {amenities.length === 0 && <div style={{ fontSize: 12, color: "#999" }}>{t.community?.noAmenities || "No shared amenities configured."}</div>}

        {amenityBookings.filter(b => b.status === "active").length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>{t.community?.yourBooking || "Your Bookings"}</div>
            {amenityBookings.filter(b => b.status === "active").map(b => {
              const am = amenities.find(a => a.id === b.amenity_id);
              return (
                <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: hexRgba(C.green, .04), border: "1px solid " + hexRgba(C.green, .15), borderRadius: 8, marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{t.community?.[am?.name] || am?.name || "Amenity"}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>{fmtD(b.date)} {"\u2014"} {b.time_slot}</div>
                  </div>
                  <button onClick={() => cancelBooking(b.id)} style={{ padding: "4px 10px", borderRadius: 6, border: "1.5px solid " + hexRgba(C.red, .2), background: hexRgba(C.red, .04), color: C.red, fontSize: 9, fontWeight: 700, cursor: "pointer" }}>{t.community?.cancelBooking || "Cancel"}</button>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 8 }}>
          {amenities.map(am => (
            <button key={am.id} onClick={() => setBookingForm({ open: true, amenityId: am.id, date: "", timeSlot: "", submitting: false })} style={{ padding: "14px 10px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,.08)", background: "#fff", cursor: "pointer", textAlign: "center" }} aria-label={"Book " + (t.community?.[am.name] || am.name)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 6 }}>
                {am.name === "kitchen" && <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>}
                {am.name === "laundry" && <><rect x="2" y="2" width="20" height="20" rx="3"/><circle cx="12" cy="13" r="5"/><circle cx="12" cy="13" r="2"/></>}
                {am.name === "parking" && <><rect x="1" y="5" width="22" height="14" rx="3"/><path d="M12 5V3M7 5V3M17 5V3"/></>}
                {am.name === "commonRoom" && <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></>}
                {am.name === "gym" && <path d="M6.5 6.5h11M2 12h20M6.5 17.5h11M4 6.5v11M20 6.5v11"/>}
                {am.name === "pool" && <path d="M2 12h20M2 16c2-2 4 0 6-2s4 0 6-2 4 0 6-2M2 20c2-2 4 0 6-2s4 0 6-2 4 0 6-2"/>}
                {!["kitchen","laundry","parking","commonRoom","gym","pool"].includes(am.name) && <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>}
              </svg>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{t.community?.[am.name] || am.name}</div>
              <div style={{ fontSize: 9, color: C.green, fontWeight: 600, marginTop: 2 }}>{t.community?.bookAmenity || "Book"}</div>
            </button>
          ))}
        </div>

        {bookingForm.open && (() => {
          const am = amenities.find(a => a.id === bookingForm.amenityId);
          return (
            <div style={{ marginTop: 12, padding: 14, background: "#faf9f7", borderRadius: 10, border: "1px solid rgba(0,0,0,.06)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{t.community?.bookAmenity || "Book"}: {t.community?.[am?.name] || am?.name}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{t.community?.selectDate || "Date"}</label>
                  <input type="date" value={bookingForm.date} onChange={e => setBookingForm(p => ({ ...p, date: e.target.value }))} min={new Date().toISOString().split("T")[0]} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 12 }} />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{t.community?.selectTime || "Time Slot"}</label>
                  <select value={bookingForm.timeSlot} onChange={e => setBookingForm(p => ({ ...p, timeSlot: e.target.value }))} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 12 }}>
                    <option value="">Select...</option>
                    {(am?.slots || []).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setBookingForm({ open: false, amenityId: null, date: "", timeSlot: "", submitting: false })} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 12 }}>{t.common.cancel}</button>
                <button onClick={bookAmenity} disabled={!bookingForm.date || !bookingForm.timeSlot || bookingForm.submitting} style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: bookingForm.date && bookingForm.timeSlot ? C.bg : "rgba(0,0,0,.08)", color: bookingForm.date && bookingForm.timeSlot ? C.accent : "#bbb", cursor: bookingForm.date && bookingForm.timeSlot ? "pointer" : "default", fontWeight: 800, fontSize: 12 }}>{bookingForm.submitting ? "Booking..." : (t.community?.confirm || "Confirm Booking")}</button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
