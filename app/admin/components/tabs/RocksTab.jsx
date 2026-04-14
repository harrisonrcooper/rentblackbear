"use client";

const statusClass = (status) => {
  if (status === "on-track" || status === "done") return "b-green";
  if (status === "off-track") return "b-red";
  return "b-gray";
};

const formatStatus = (status) => status.replace("-", " ");

export default function RocksTab({ rocks, setRocks, cycleRock, uid }) {
  const addRock = () => setRocks(p => [
    {id: uid(), title:"New Rock", owner:"Harrison", status:"not-started", due:"2026-06-30", notes:""},
    ...p
  ]);
  const renameRock = (id, title) => setRocks(p => p.map(x => x.id === id ? {...x, title} : x));
  const removeRock = (id) => setRocks(p => p.filter(x => x.id !== id));

  return (
    <>
      <div className="sec-hd">
        <div><h2>Quarterly Rocks</h2><p>Click dot to cycle status</p></div>
        <button className="btn btn-gold" onClick={addRock}>+ Add</button>
      </div>
      {rocks.map(r => (
        <div key={r.id} className="row">
          <span
            className={statusClass(r.status)}
            style={{width:10,height:10,borderRadius:"50%",cursor:"pointer",flexShrink:0,background:"currentColor",display:"inline-block"}}
            onClick={() => cycleRock(r.id)}
            aria-label={`Cycle status (currently ${formatStatus(r.status)})`}
            role="button"
          />
          <div className="row-i">
            <div
              className="row-t"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => renameRock(r.id, e.target.textContent)}
            >{r.title}</div>
            <div className="row-s">{r.owner} · {formatStatus(r.status)} · Due {r.due}</div>
          </div>
          <span className={`badge ${statusClass(r.status)}`}>{formatStatus(r.status)}</span>
          <button
            className="btn btn-red btn-sm"
            onClick={() => removeRock(r.id)}
            aria-label="Delete rock"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      ))}
    </>
  );
}
