"use client";

// Open questions — everything waiting on an answer from the architect or builder.
//
// The whole point of this screen is the UNANSWERED question, so open ones sit
// loud at the top and answered ones fall quiet below. Status is never something
// he sets by hand: the moment he records an answer the question flips to
// answered, and clearing that answer flips it back to waiting — so there is no
// dropdown to babysit, and the count in the header can never lie.

import { useEffect, useRef, useState } from "react";

import { COLORS, FONT, SERIF, btn, Icon, ICON, ACCENT, txt, AddBtn, AutoTextarea, SectionHead, Chip, fmtBuildDate, todayIso
} from "../ui";

// The two people almost every question is aimed at, offered as one-tap fills so
// he types a name only when it is neither of them.
const WHO_SUGGESTIONS = ["Architect", "Builder"];

// Local (not UTC) yyyy-mm-dd. `toISOString()` is a day early after ~5pm on the
// US west coast — the ask-date would read as tomorrow, which is unsettling.

function FieldLabel({ children }) {
  return (
    <span style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textFaint, marginBottom: 5 }}>
      {children}
    </span>
  );
}

const clamp2 = { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" };

function QuestionCard({ rfi, open, onToggle, onChange, onDelete }) {
  const answered = rfi.status === "answered";
  const answerText = (rfi.answer || "").trim();

  // Recording an answer is what makes a question answered — so wire the two
  // together instead of asking him to flip a status by hand. Only the empty↔
  // filled transition moves the status, so an explicit "Reopen" (which leaves
  // the answer in place) sticks even while he keeps editing that answer.
  function onAnswer(v) {
    const had = answerText.length > 0;
    const has = v.trim().length > 0;
    const patch = { answer: v };
    if (has && !had) patch.status = "answered";
    else if (!has && had) patch.status = "open";
    onChange(patch);
  }

  if (!open) {
    return (
      <button
        onClick={onToggle}
        style={{
          width: "100%", textAlign: "left", cursor: "pointer", fontFamily: FONT,
          background: COLORS.surface, border: `1px solid ${COLORS.border}`,
          borderRadius: 12, padding: 14, marginBottom: 10,
          display: "flex", flexDirection: "column", gap: 7,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <Chip tone={answered ? "green" : "amber"}>{answered ? "Answered" : "Waiting"}</Chip>
          {rfi.date && <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.textFaint, flexShrink: 0 }}>Asked {fmtBuildDate(rfi.date)}</span>}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, lineHeight: 1.4, ...clamp2 }}>
          {rfi.question || "Untitled question"}
        </div>
        {rfi.asked_of && (
          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted }}>For {rfi.asked_of}</div>
        )}
        {answered && answerText && (
          <div style={{ fontSize: 12.5, color: COLORS.green, lineHeight: 1.45, ...clamp2 }}>{answerText}</div>
        )}
      </button>
    );
  }

  return (
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.accent}`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
      <button
        onClick={onToggle}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, background: "transparent", border: "none", cursor: "pointer", fontFamily: FONT, padding: 0, marginBottom: 14 }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <Chip tone={answered ? "green" : "amber"}>{answered ? "Answered" : "Waiting"}</Chip>
          {rfi.date && <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.textFaint }}>Asked {fmtBuildDate(rfi.date)}</span>}
        </span>
        <Icon d={ICON.chevD} size={15} color={COLORS.textFaint} />
      </button>

      <div style={{ marginBottom: 14 }}>
        <FieldLabel>The question</FieldLabel>
        <AutoTextarea value={rfi.question} onChange={(v) => onChange({ question: v })} minRows={2} placeholder="What do you need to know?" style={{ fontWeight: 600 }} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <FieldLabel>Who you are asking</FieldLabel>
        <input value={rfi.asked_of} onChange={(e) => onChange({ asked_of: e.target.value })} placeholder="Architect, builder, someone else…" style={{ ...txt() }} />
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          {WHO_SUGGESTIONS.map((who) => {
            const on = rfi.asked_of === who;
            return (
              <button
                key={who}
                onClick={() => onChange({ asked_of: on ? "" : who })}
                style={{
                  cursor: "pointer", fontFamily: FONT, fontSize: 12, fontWeight: 600,
                  padding: "5px 11px", borderRadius: 999,
                  border: `1px solid ${on ? COLORS.accent : COLORS.borderStrong}`,
                  background: on ? COLORS.accentSoft : COLORS.surface,
                  color: on ? COLORS.accent : COLORS.textMuted,
                }}
              >
                {who}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <FieldLabel>The answer</FieldLabel>
        <AutoTextarea value={rfi.answer} onChange={onAnswer} minRows={2} placeholder="Type the answer here once you have it — that settles the question." />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        {answered
          ? (
            <button onClick={() => onChange({ status: "open" })} style={{ ...btn("ghost") }}>
              <Icon d={ICON.refresh} size={13} /> Reopen
            </button>
          )
          : <span />}
        <button onClick={onDelete} style={{ ...btn("ghost") }}>
          <Icon d={ICON.x} size={13} /> Delete
        </button>
      </div>
    </div>
  );
}

export default function OpenQuestionsSection({ state, addRow, updRow, delRow }) {
  const rfis = state.rfis || [];
  const [openId, setOpenId] = useState(null);

  // Add a question and drop him straight into it — no second tap to start
  // typing. addRow appends, so the newest visible row is last.
  const wantNewest = useRef(false);
  useEffect(() => {
    if (!wantNewest.current) return;
    wantNewest.current = false;
    const last = rfis[rfis.length - 1];
    if (last) setOpenId(last.id);
  }, [rfis]);

  function addQuestion() {
    wantNewest.current = true;
    addRow("rfis", { question: "", asked_of: "", answer: "", status: "open", date: todayIso() });
  }

  const toggle = (id) => setOpenId((cur) => (cur === id ? null : id));

  const waiting = rfis.filter((r) => r.status !== "answered");
  const answered = rfis.filter((r) => r.status === "answered");

  const renderCard = (rfi) => (
    <QuestionCard
      key={rfi.id}
      rfi={rfi}
      open={openId === rfi.id}
      onToggle={() => toggle(rfi.id)}
      onChange={(p) => updRow("rfis", rfi.id, p)}
      onDelete={() => { delRow("rfis", rfi.id); if (openId === rfi.id) setOpenId(null); }}
    />
  );

  // ── Empty state — the first, and usually the only, screen he'll see here ────
  if (rfis.length === 0) {
    return (
      <>
        <SectionHead title="Open questions" note="Everything waiting on an answer from your architect or builder" />
        <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 16, background: COLORS.surface, padding: "40px 20px 44px", textAlign: "center", maxWidth: 480, margin: "8px auto 0" }}>
          <div style={{ width: 48, height: 48, margin: "0 auto 16px", borderRadius: 14, background: COLORS.accentSoft, display: "grid", placeItems: "center" }}>
            <Icon d={ICON.fileText} size={24} color={ACCENT} />
          </div>
          <h3 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, margin: "0 0 7px" }}>Nothing waiting yet</h3>
          <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.55, margin: "0 auto 20px", maxWidth: 380 }}>
            Every time you need something from the architect or builder, log it here so it never gets lost.
            When the answer comes back, type it in and the question settles itself.
          </p>
          <AddBtn label="Ask your first question" onClick={addQuestion} />
        </div>
      </>
    );
  }

  return (
    <>
      <SectionHead
        title="Open questions"
        note={waiting.length > 0
          ? `${waiting.length} waiting on an answer`
          : "Every question answered"}
      />

      {waiting.length > 0
        ? waiting.map(renderCard)
        : (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 12, background: COLORS.greenBg, color: COLORS.green, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
            <Icon d={ICON.check} size={16} color={COLORS.green} /> Nothing is waiting — every question has an answer.
          </div>
        )}

      {answered.length > 0 && (
        <>
          <SectionHead title="Answered" note={`${answered.length} settled`} />
          {answered.map(renderCard)}
        </>
      )}

      <div style={{ marginTop: 14 }}>
        <AddBtn label="Ask a question" onClick={addQuestion} />
      </div>
    </>
  );
}
