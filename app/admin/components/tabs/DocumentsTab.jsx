"use client";

export default function DocumentsTab({ docs, setModal }) {
  const types = ["addendum", "lease", "rules", "checklist"];
  const labels = {
    addendum: (
      <>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" style={{display:"inline",verticalAlign:"middle",marginRight:4}}>
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Lease Addendums
      </>
    ),
    lease: (
      <>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" style={{display:"inline",verticalAlign:"middle",marginRight:4}}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        Leases & Agreements
      </>
    ),
    rules: (
      <>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" style={{display:"inline",verticalAlign:"middle",marginRight:4}}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        House Rules
      </>
    ),
    checklist: (
      <>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" style={{display:"inline",verticalAlign:"middle",marginRight:4}}>
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Checklists
      </>
    )
  };

  const iconFor = (type) => type === "addendum"
    ? (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    )
    : (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    );

  return (
    <>
      <div className="sec-hd">
        <div><h2>Documents</h2><p>Leases, addendums, checklists, and templates</p></div>
        <button className="btn btn-gold">+ Upload Document</button>
      </div>
      {types.map(type => {
        const items = docs.filter(d => d.type === type);
        if (!items.length) return null;
        return (
          <div key={type} style={{marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:700,color:"var(--flg-text-muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{labels[type]}</div>
            {items.map(d => (
              <div key={d.id} className="row">
                <span style={{fontSize:16}}>{iconFor(type)}</span>
                <div className="row-i">
                  <div className="row-t">{d.name}</div>
                  <div className="row-s">{d.property}{d.tenant ? ` · ${d.tenant}` : ""} · {d.uploaded}</div>
                </div>
                {d.content
                  ? <button className="btn btn-out btn-sm" onClick={() => setModal({type:"viewAddendum", doc:d})}>View / Download</button>
                  : <button className="btn btn-out btn-sm">View</button>}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}
