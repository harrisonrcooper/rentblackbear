"use client";

const nextPriority = (p) => p === "high" ? "medium" : p === "medium" ? "low" : "high";

const priorityClass = (p) => p === "high" ? "b-red" : p === "medium" ? "b-gold" : "b-green";

export default function IssuesTab({ issues, setIssues, uid, TODAY }) {
  const addIssue = () => setIssues(p => [
    {id: uid(), title:"New issue", priority:"medium", created: TODAY.toISOString().split("T")[0]},
    ...p
  ]);
  const cyclePriority = (id) => setIssues(p => p.map(x => x.id === id ? {...x, priority: nextPriority(x.priority)} : x));
  const renameIssue = (id, title) => setIssues(p => p.map(x => x.id === id ? {...x, title} : x));
  const resolveIssue = (id) => setIssues(p => p.filter(x => x.id !== id));

  return (
    <>
      <div className="sec-hd">
        <div><h2>Issues List (IDS)</h2><p>Identify, Discuss, Solve. Click priority to cycle.</p></div>
        <button className="btn btn-gold" onClick={addIssue}>+ Add</button>
      </div>
      {issues.map(i => (
        <div key={i.id} className="row">
          <span
            className={priorityClass(i.priority)}
            style={{width:12,height:12,borderRadius:"50%",cursor:"pointer",flexShrink:0,background:"currentColor",display:"inline-block"}}
            onClick={() => cyclePriority(i.id)}
            aria-label={`Cycle priority (currently ${i.priority})`}
            role="button"
          />
          <div className="row-i">
            <div
              className="row-t"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => renameIssue(i.id, e.target.textContent)}
            >{i.title}</div>
            <div className="row-s">{i.created}</div>
          </div>
          <button
            className="btn btn-green btn-sm"
            onClick={() => resolveIssue(i.id)}
            style={{display:"flex",alignItems:"center",gap:4}}
            aria-label="Mark solved"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Solved
          </button>
        </div>
      ))}
    </>
  );
}
