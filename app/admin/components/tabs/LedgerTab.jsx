"use client";
import Ledger from "../Ledger";

export default function LedgerTab({ setShowLedgerImport, ...ledgerProps }) {
  return (
    <>
      <div className="sec-hd">
        <div><h2>Ledger</h2></div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button
            className="btn btn-out"
            onClick={() => setShowLedgerImport(true)}
            style={{fontSize:12,display:"flex",alignItems:"center",gap:4}}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Import Charges
          </button>
        </div>
      </div>
      <Ledger {...ledgerProps} />
    </>
  );
}
