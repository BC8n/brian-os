import { useState } from "react";

// ─── FEEL OPTIONS ──────────────────────────────────────────────────────────────
const FEELS = [
  { value: "too_easy",  emoji: "😴", label: "Too Easy",  short: "ease up",  color: "#38BDF8" },
  { value: "easy",      emoji: "🟢", label: "Easy",      short: "easy",     color: "#4ade80" },
  { value: "perfect",  emoji: "🎯", label: "Perfect",   short: "perfect",  color: "#E8FF47" },
  { value: "hard",     emoji: "🔴", label: "Hard",      short: "hard",     color: "#fb923c" },
  { value: "too_hard", emoji: "💀", label: "Too Hard",  short: "back off", color: "#f87171" },
];

// ─── BASE PLAN ─────────────────────────────────────────────────────────────────
const BASE_PLAN = {
  schedule: "Mon / Wed / Fri  ·  or any 3 non-consecutive days",
  days: [
    {
      id: "A", label: "Day A", theme: "Push Power", color: "#E8FF47", textColor: "#0a0a0a",
      focus: "Chest · Shoulders · Triceps",
      mainBlock: {
        duration: "~18 min",
        warmup: "60s arm circles + 10 band pull-aparts",
        exercises: [
          { name: "Dips (weighted if able)",    sets: 4, reps: "6–8",   rest: "90s", note: "Lean slightly forward for chest bias" },
          { name: "Dumbbell Overhead Press",    sets: 3, reps: "8–10",  rest: "75s", note: "Seated on bench, strict form" },
          { name: "Ring Push-Ups",              sets: 3, reps: "10–12", rest: "60s", note: "Rings at hip height, slow eccentric" },
          { name: "Lateral Raises (DB)",        sets: 3, reps: "12–15", rest: "45s", note: "Keep slight bend in elbow" },
        ],
        finisher: "Ab roller — 3×8 rollouts"
      },
      snacks: [
        { time: "Mid-morning",   move: "Neck CARs — 5 slow reps each direction",           why: "Controlled articular rotations; builds cervical strength & mobility", category: "neck" },
        { time: "After lunch",   move: "Arch Bridge Hold — 3×20–30s",                      why: "Full spinal extension, shoulder opener, hip flexor stretch",           category: "bridge" },
        { time: "Mid-afternoon", move: "10 Band Pull-Aparts + 2×12 Tricep Band Pushdowns", why: "Chest opener + arm activation — pairs with push day",                 category: "movement" },
      ]
    },
    {
      id: "B", label: "Day B", theme: "Pull Strength", color: "#FF6B35", textColor: "#fff",
      focus: "Back · Biceps · Rear Delts",
      mainBlock: {
        duration: "~18 min",
        warmup: "60s thoracic rotations + 10 face pulls",
        exercises: [
          { name: "Weighted Pull-Ups / Chin-Ups", sets: 4, reps: "5–7",   rest: "90s", note: "Add weight via belt or vest" },
          { name: "Barbell Bent-Over Row",         sets: 3, reps: "8–10",  rest: "75s", note: "Overhand grip, hinge to ~45°" },
          { name: "Ring Row (feet elevated)",      sets: 3, reps: "10–12", rest: "60s", note: "Pause and squeeze at top" },
          { name: "Dumbbell Hammer Curl",          sets: 3, reps: "10–12", rest: "45s", note: "Alternating, controlled tempo" },
        ],
        finisher: "DB Pull-Over on bench — 3×12"
      },
      snacks: [
        { time: "Mid-morning",   move: "Neck isometrics — 4 directions × 10s hold",  why: "Press hand against head, resist; builds neck strength without equipment",         category: "neck" },
        { time: "After lunch",   move: "Arch Bridge — 3×20–30s hold",                why: "Spinal extension, anterior chain opening; pairs perfectly with pull day posture", category: "bridge" },
        { time: "Mid-afternoon", move: "Hang from pull-up bar × 3 × 30s",            why: "Spinal decompression + grip work",                                               category: "movement" },
      ]
    },
    {
      id: "C", label: "Day C", theme: "Full Body", color: "#A78BFA", textColor: "#fff",
      focus: "Compound Total Body + Core",
      mainBlock: {
        duration: "~20 min",
        warmup: "60s hip circles + 10 Romanian DL with light bar",
        exercises: [
          { name: "Barbell Romanian Deadlift",      sets: 4, reps: "6–8",    rest: "90s", note: "Floor pull — hinge pattern, brace hard" },
          { name: "Dumbbell Bulgarian Split Squat", sets: 3, reps: "8/side", rest: "75s", note: "Rear foot on bench" },
          { name: "Ring Dips",                      sets: 3, reps: "8–10",   rest: "60s", note: "Full lockout, controlled descent" },
          { name: "L-Sit Hold (dip bar)",           sets: 3, reps: "Max hold",rest: "45s", note: "Progress to tuck → L-sit" },
        ],
        finisher: "Ab roller — 3×10 rollouts + 30s plank"
      },
      snacks: [
        { time: "Mid-morning",   move: "Neck flexion/extension — 3×10 reps with light resistance", why: "Use band or hand for resistance; targets deep cervical flexors",    category: "neck" },
        { time: "After lunch",   move: "Arch Bridge — 3×20–30s + 5 slow reps up/down",            why: "Add dynamic reps today; builds toward wrestler's bridge",            category: "bridge" },
        { time: "Mid-afternoon", move: "3×10 Goblet squats (light KB)",                            why: "Hip mobility + glute activation",                                    category: "movement" },
      ]
    }
  ]
};

// ─── ICONS ────────────────────────────────────────────────────────────────────
const CheckIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 4v3l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const ChevronIcon = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1l1.2 4.8L13 7l-4.8 1.2L7 13l-1.2-4.8L1 7l4.8-1.2L7 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
);
const HistoryIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <path d="M1.5 7A5.5 5.5 0 1 0 3 3.5L1.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.5 5V2h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 4.5V7l1.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function buildSystemPrompt() {
  return `You are an elite strength coach with 20 years experience. You specialize in sub-20-minute, high-efficiency training blocks for advanced athletes.

The athlete's equipment: dumbbells, kettlebells, resistance bands, rings, barbell (no rack — floor pulls only), adjustable bench, ab roller, dip/pull-up bar.

Your job: analyze the athlete's session feedback and generate an OPTIMIZED version of that same training day for next week.

Priorities (in order):
1. Progressive overload — push reps or weight if feel was "easy" or "perfect"
2. Recovery signals — reduce volume/intensity if feel was "hard" or "too_hard", extend rest
3. Fix weak points — address anything flagged in notes (form breakdown, fatigue, pain)
4. Exercise variety — occasionally rotate to similar movements to prevent staleness (only if feel was "perfect" or "easy" for 2+ weeks)

Rules:
- Keep the same structure (4 exercises + finisher + warmup)
- Stay within available equipment
- Never use a rack — barbell is floor-pull only
- Keep total block under 20 minutes
- Be specific: give exact sets × reps and updated coaching notes
- In your reasoning field, be direct and personal — address the athlete directly, explain WHY you changed what you changed

Respond ONLY with valid JSON in this exact shape:
{
  "reasoning": "2-3 sentences explaining your changes directly to the athlete",
  "duration": "~XX min",
  "warmup": "...",
  "exercises": [
    { "name": "...", "sets": <number>, "reps": "...", "rest": "...", "note": "..." }
  ],
  "finisher": "..."
}`;
}

function buildUserPrompt(day, sessionLog) {
  const lines = day.mainBlock.exercises.map((ex, i) => {
    const log = sessionLog[i] || {};
    const setsCompleted = (log.sets || []).filter(Boolean).length;
    const feel = FEELS.find(f => f.value === log.feel);
    return `Exercise ${i+1}: ${ex.name}
  - Prescribed: ${ex.sets}×${ex.reps} rest ${ex.rest}
  - Sets completed: ${setsCompleted}/${ex.sets}
  - Feel: ${feel ? feel.label : "not rated"}
  - Notes: ${log.note?.trim() || "none"}`;
  });

  return `Day: ${day.label} — ${day.theme} (${day.focus})
Session date: ${new Date().toLocaleDateString()}

${lines.join("\n\n")}

Please optimize next week's ${day.theme} session based on this feedback.`;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function WorkoutTab() {
  const [activeDay, setActiveDay]     = useState("A");
  const [tab, setTab]                 = useState("workout");
  const [historyTab, setHistoryTab]   = useState("current");
  const [exData, setExData]           = useState({});
  const [history, setHistory]         = useState({});
  const [aiState, setAiState]         = useState({});
  const [showApprove, setShowApprove] = useState(null);

  const day         = BASE_PLAN.days.find(d => d.id === activeDay);
  const dayHistory  = history[activeDay] || [];
  const currentPlan = dayHistory.length > 0 ? dayHistory[dayHistory.length - 1] : day.mainBlock;
  const previousPlan = dayHistory.length > 1 ? dayHistory[dayHistory.length - 2] : null;
  const ai          = aiState[activeDay] || { status: "idle" };

  const getEx = (dayId, exIdx) => {
    const key = `${dayId}-${exIdx}`;
    const src = dayId === activeDay ? currentPlan : BASE_PLAN.days.find(d => d.id === dayId).mainBlock;
    return exData[key] || { sets: Array(src.exercises[exIdx].sets).fill(false), note: "", feel: null, expanded: false };
  };
  const updateEx = (dayId, exIdx, patch) => {
    const key = `${dayId}-${exIdx}`;
    setExData(prev => ({ ...prev, [key]: { ...getEx(dayId, exIdx), ...patch } }));
  };
  const toggleSet = (dayId, exIdx, si) => {
    const d = getEx(dayId, exIdx);
    const s = [...d.sets]; s[si] = !s[si];
    updateEx(dayId, exIdx, { sets: s });
  };

  const completedCount  = currentPlan.exercises.filter((_, i) => getEx(activeDay, i).sets.every(Boolean)).length;
  const totalEx         = currentPlan.exercises.length;
  const sessionComplete = completedCount === totalEx;
  const hasAnyLog       = currentPlan.exercises.some((_, i) => {
    const d = getEx(activeDay, i);
    return d.note.trim() || d.feel;
  });

  // ── AI optimize — routes through Vercel /api/optimize, NOT directly to Anthropic ──
  async function handleOptimize() {
    const sessionLog = currentPlan.exercises.map((_, i) => getEx(activeDay, i));
    setAiState(prev => ({ ...prev, [activeDay]: { status: "loading" } }));

    try {
      const resp = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: buildSystemPrompt(),
          prompt: buildUserPrompt(day, sessionLog),
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${resp.status}`);
      }

      const data = await resp.json();
      // Support both { insight: "..." } and { text: "..." } shapes
      const raw = data.insight || data.text || "";
      if (!raw) throw new Error("Empty response from server");

      const clean = raw.replace(/```json|```/g, "").trim();
      const suggestion = JSON.parse(clean);
      setAiState(prev => ({ ...prev, [activeDay]: { status: "ready", suggestion } }));
      setShowApprove(activeDay);
    } catch (e) {
      setAiState(prev => ({ ...prev, [activeDay]: { status: "error", error: e.message || "Could not generate insight" } }));
    }
  }

  function handleApprove() {
    const suggestion = ai.suggestion;
    const newBlock = {
      duration: suggestion.duration,
      warmup: suggestion.warmup,
      exercises: suggestion.exercises,
      finisher: suggestion.finisher,
      generatedAt: new Date().toLocaleDateString(),
      reasoning: suggestion.reasoning,
    };
    setHistory(prev => ({
      ...prev,
      [activeDay]: [...(prev[activeDay] || [day.mainBlock]), newBlock]
    }));
    setExData(prev => {
      const next = { ...prev };
      suggestion.exercises.forEach((_, i) => { delete next[`${activeDay}-${i}`]; });
      return next;
    });
    setAiState(prev => ({ ...prev, [activeDay]: { status: "applied" } }));
    setShowApprove(null);
    setHistoryTab("current");
  }

  function handleDiscard() {
    setShowApprove(null);
    setAiState(prev => ({ ...prev, [activeDay]: { status: "idle" } }));
  }

  const exercises    = historyTab === "previous" && previousPlan ? previousPlan.exercises : currentPlan.exercises;
  const displayPlan  = historyTab === "previous" && previousPlan ? previousPlan : currentPlan;

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      fontFamily: "'DM Mono','Courier New',monospace",
      background: "#0c0c0f",
      minHeight: "100%",
      color: "#e8e8e0",
      // iOS safe areas
      paddingBottom: "env(safe-area-inset-bottom, 20px)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

        /* Touch targets — min 44px per Apple HIG */
        .btn-day   { transition: background 0.2s, color 0.2s; cursor: pointer; border: none; min-height: 64px; }
        .btn-tab   { transition: background 0.15s, color 0.15s; cursor: pointer; border: none; min-height: 44px; }
        .btn-feel  { transition: background 0.15s, border-color 0.15s; cursor: pointer; border: none; min-height: 52px; min-width: 52px; }
        .set-dot   { transition: background 0.15s, border-color 0.15s; cursor: pointer; user-select: none; }
        .snack-card { transition: background 0.15s; }
        .btn-expand { cursor: pointer; background: none; border: none; padding: 10px; min-width: 44px; min-height: 44px; display:flex; align-items:center; justify-content:center; }
        .btn-optimize { transition: background 0.2s, opacity 0.2s; cursor: pointer; border: none; }
        .btn-optimize:disabled { opacity: 0.45; cursor: not-allowed; }

        /* Remove hover states on touch — they get stuck on iOS */
        @media (hover: hover) {
          .btn-day:hover         { transform: translateY(-2px); }
          .btn-feel:hover        { transform: scale(1.12); }
          .set-dot:hover         { transform: scale(1.08); }
          .snack-card:hover      { transform: translateX(4px); }
          .btn-optimize:hover:not(:disabled) { filter: brightness(1.1); }
        }

        /* Active states for touch feedback */
        .btn-day:active    { opacity: 0.8; }
        .btn-feel:active   { opacity: 0.75; }
        .set-dot:active    { opacity: 0.75; }
        .btn-optimize:active:not(:disabled) { opacity: 0.85; }

        textarea { resize: none; outline: none; font-family: 'DM Mono', monospace; font-size: 16px !important; /* prevent iOS zoom */ }
        textarea::placeholder { color: #2e2e3a; }
        textarea:focus { border-color: #2e2e44 !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
        @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .anim-slide { animation: slideDown 0.25s ease; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{
        padding: "28px 20px 20px",
        paddingTop: "max(28px, calc(env(safe-area-inset-top, 0px) + 16px))",
        borderBottom: "1px solid #1a1a22",
        background: "linear-gradient(180deg,#0f0f14,#0c0c0f)"
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#444", textTransform: "uppercase", marginBottom: 6 }}>Your Training Plan</div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(22px,5vw,36px)", fontWeight: 800, lineHeight: 1.05, color: "#f0f0e8", marginBottom: 10 }}>
            Upper Body<br/><span style={{ color: "#E8FF47" }}>Strength</span> Protocol
          </h1>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: "11px", color: "#555" }}>
            <span>⚡ 3× / week</span><span>⏱ Under 20 min</span>
          </div>
        </div>
      </div>

      {/* ── DAY SELECTOR ── */}
      <div style={{ padding: "16px 20px 0", maxWidth: 680, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {BASE_PLAN.days.map(d => {
            const dHist = history[d.id] || [];
            return (
              <button key={d.id} className="btn-day"
                onClick={() => { setActiveDay(d.id); setTab("workout"); setHistoryTab("current"); }}
                style={{
                  flex: 1, padding: "12px 8px", borderRadius: 12,
                  background: activeDay === d.id ? d.color : "#161619",
                  color: activeDay === d.id ? d.textColor : "#777",
                  fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "12px",
                  border: activeDay === d.id ? "none" : "1px solid #1e1e26",
                  outline: "none", position: "relative"
                }}>
                <div style={{ fontSize: "16px", marginBottom: 2 }}>{d.label}</div>
                <div style={{ fontSize: "9px", fontWeight: 400, opacity: 0.65, letterSpacing: "0.04em" }}>{d.theme}</div>
                {dHist.length > 0 && (
                  <div style={{ position: "absolute", top: 5, right: 7, fontSize: "9px", opacity: 0.7 }}>
                    v{dHist.length + 1}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: "16px 20px 40px", maxWidth: 680, margin: "0 auto" }}>

        {/* Day header */}
        <div style={{ background: "#161619", border: "1px solid #1e1e26", borderRadius: 14, padding: "16px 18px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "18px", fontWeight: 700, color: day.color, marginBottom: 2 }}>{day.theme}</div>
            <div style={{ fontSize: "12px", color: "#555" }}>{day.focus}</div>
            {currentPlan.generatedAt && (
              <div style={{ fontSize: "10px", color: "#3a3a4a", marginTop: 4 }}>
                <span style={{ color: day.color, marginRight: 4 }}>✦</span>AI optimized · {currentPlan.generatedAt}
              </div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#555", fontSize: "12px", marginBottom: 8, justifyContent: "flex-end" }}>
              <ClockIcon /> {currentPlan.duration}
            </div>
            <div style={{
              background: sessionComplete ? day.color : "#1a1a22",
              color: sessionComplete ? day.textColor : "#555",
              borderRadius: 20, padding: "4px 12px", fontSize: "11px", transition: "all 0.3s"
            }}>{completedCount}/{totalEx} done</div>
          </div>
        </div>

        {/* AI approval modal */}
        {showApprove === activeDay && ai.suggestion && (
          <div className="anim-slide" style={{ background: "#0f0f18", border: `1px solid ${day.color}55`, borderRadius: 14, padding: "18px", marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
              <span style={{ color: day.color }}><SparkleIcon /></span>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "13px", color: day.color }}>
                AI Suggestion — {day.theme} v{(dayHistory.length || 0) + 2}
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "#aaa", lineHeight: 1.7, marginBottom: 14, padding: "12px", background: "#161619", borderRadius: 10, borderLeft: `3px solid ${day.color}66` }}>
              {ai.suggestion.reasoning}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {ai.suggestion.exercises.map((ex, i) => {
                const prev = currentPlan.exercises[i];
                const changed = prev && (ex.name !== prev.name || ex.sets !== prev.sets || ex.reps !== prev.reps || ex.rest !== prev.rest);
                return (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                    padding: "10px 12px", background: changed ? `${day.color}0a` : "#111116",
                    borderRadius: 9, border: `1px solid ${changed ? day.color + "33" : "#1a1a22"}`
                  }}>
                    <div>
                      <div style={{ fontSize: "13px", fontFamily: "'Syne',sans-serif", fontWeight: 700, color: changed ? day.color : "#ccc", marginBottom: 2 }}>{ex.name}</div>
                      <div style={{ fontSize: "11px", color: "#555" }}>{ex.sets}×{ex.reps} · rest {ex.rest}</div>
                    </div>
                    {changed && prev ? (
                      <div style={{ fontSize: "10px", color: "#444", textAlign: "right" }}>
                        <div style={{ color: "#333", textDecoration: "line-through" }}>{prev.sets}×{prev.reps}</div>
                        <div style={{ color: day.color }}>↑ {ex.sets}×{ex.reps}</div>
                      </div>
                    ) : (
                      <div style={{ fontSize: "10px", color: "#2a2a36" }}>unchanged</div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-optimize" onClick={handleApprove} style={{
                flex: 1, padding: "14px", borderRadius: 10, minHeight: 52,
                background: day.color, color: day.textColor,
                fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "14px", outline: "none"
              }}>✓ Apply This Plan</button>
              <button className="btn-optimize" onClick={handleDiscard} style={{
                padding: "14px 18px", borderRadius: 10, minHeight: 52,
                background: "#1a1a22", color: "#666",
                fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "14px",
                border: "1px solid #222", outline: "none"
              }}>Discard</button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: "#111114", borderRadius: 10, padding: 4, marginBottom: 14 }}>
          {["workout", "snacks"].map(t => (
            <button key={t} className="btn-tab" onClick={() => setTab(t)} style={{
              flex: 1, padding: "10px", borderRadius: 7,
              background: tab === t ? "#1c1c24" : "transparent",
              color: tab === t ? "#e8e8e0" : "#555",
              fontSize: "12px", letterSpacing: "0.06em",
              outline: "none", border: tab === t ? `1px solid ${day.color}33` : "1px solid transparent"
            }}>{t === "workout" ? "🏋️ Main Block" : "⚡ Desk Snacks"}</button>
          ))}
        </div>

        {/* ── WORKOUT TAB ── */}
        {tab === "workout" && (
          <>
            {previousPlan && (
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {[["current","This Week"],["previous","Last Week"]].map(([val, lbl]) => (
                  <button key={val} className="btn-tab" onClick={() => setHistoryTab(val)} style={{
                    padding: "8px 14px", borderRadius: 8, fontSize: "11px", letterSpacing: "0.06em", minHeight: 40,
                    background: historyTab === val ? day.color : "#161619",
                    color: historyTab === val ? day.textColor : "#555",
                    border: historyTab === val ? "none" : "1px solid #1e1e26",
                    outline: "none", display: "flex", alignItems: "center", gap: 5
                  }}>
                    {val === "previous" && <HistoryIcon />} {lbl}
                  </button>
                ))}
              </div>
            )}

            {historyTab === "previous" && previousPlan?.reasoning && (
              <div style={{ background: "#0f0f18", border: `1px solid ${day.color}33`, borderRadius: 12, padding: "12px 14px", marginBottom: 12, fontSize: "11px", color: "#666", lineHeight: 1.6 }}>
                <span style={{ color: day.color, marginRight: 6 }}>✦ Coach note:</span>{previousPlan.reasoning}
              </div>
            )}

            {/* Warmup */}
            <div style={{ background: "#111114", border: "1px solid #1a1a22", borderRadius: 12, padding: "13px 14px", marginBottom: 10, fontSize: "12px", color: "#666", display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ color: day.color }}>→</span>
              <div><span style={{ color: "#383838", marginRight: 6 }}>WARMUP</span>{displayPlan.warmup}</div>
            </div>

            {/* Exercises */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 10 }}>
              {exercises.map((ex, i) => {
                const d = historyTab === "current" ? getEx(activeDay, i) : { sets: Array(ex.sets).fill(true), note: "", feel: null, expanded: false };
                const allDone  = d.sets.every(Boolean);
                const someDone = d.sets.some(Boolean);
                const isReadOnly = historyTab === "previous";

                return (
                  <div key={i} style={{
                    background: allDone && !isReadOnly ? `${day.color}0d` : "#161619",
                    border: `1px solid ${allDone && !isReadOnly ? day.color+"55" : someDone && !isReadOnly ? day.color+"25" : "#1e1e26"}`,
                    borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s, background 0.2s",
                    opacity: isReadOnly ? 0.75 : 1
                  }}>
                    <div style={{ padding: "14px 12px 12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                      {/* Status dot */}
                      <div style={{
                        width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 3,
                        border: `2px solid ${allDone ? day.color : someDone ? day.color+"44" : "#252530"}`,
                        background: allDone ? day.color : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: allDone ? day.textColor : "transparent", transition: "all 0.2s"
                      }}>
                        <CheckIcon size={11} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: "'Syne',sans-serif", fontSize: "14px", fontWeight: 700, marginBottom: 7,
                          color: allDone && !isReadOnly ? "#666" : "#e0e0d8",
                          textDecoration: allDone && !isReadOnly ? "line-through" : "none", transition: "all 0.2s"
                        }}>{ex.name}</div>

                        <div style={{ display: "flex", gap: 5, marginBottom: 9, flexWrap: "wrap" }}>
                          {[`${ex.sets} sets`, `${ex.reps} reps`, `${ex.rest} rest`].map(tag => (
                            <span key={tag} style={{ background: "#0d0d10", border: "1px solid #1e1e26", borderRadius: 6, padding: "2px 7px", fontSize: "10px", color: "#777" }}>{tag}</span>
                          ))}
                        </div>

                        {/* Set dots — 44px touch targets */}
                        {!isReadOnly && (
                          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 9, flexWrap: "wrap" }}>
                            <span style={{ fontSize: "10px", color: "#383838", letterSpacing: "0.1em", marginRight: 2 }}>SETS</span>
                            {d.sets.map((done, si) => (
                              <div key={si} className="set-dot"
                                onClick={() => toggleSet(activeDay, i, si)}
                                style={{
                                  width: 40, height: 40, borderRadius: 10,
                                  border: `2px solid ${done ? day.color : "#202028"}`,
                                  background: done ? day.color : "#111116",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  color: done ? day.textColor : "#333", fontSize: "13px", fontWeight: 700,
                                  transition: "background 0.15s, border-color 0.15s"
                                }}>
                                {done ? <CheckIcon size={12} /> : si + 1}
                              </div>
                            ))}
                            {someDone && !allDone && (
                              <span style={{ fontSize: "10px", color: day.color, opacity: 0.8, marginLeft: 2 }}>
                                {d.sets.filter(Boolean).length}/{ex.sets}
                              </span>
                            )}
                          </div>
                        )}

                        <div style={{ fontSize: "11px", color: "#3a3a4a", fontStyle: "italic" }}>💡 {ex.note}</div>
                      </div>

                      {!isReadOnly && (
                        <button className="btn-expand"
                          onClick={() => updateEx(activeDay, i, { expanded: !d.expanded })}
                          style={{ color: d.expanded ? day.color : "#2a2a34" }}>
                          <ChevronIcon open={d.expanded} />
                        </button>
                      )}
                    </div>

                    {/* Expanded panel */}
                    {!isReadOnly && d.expanded && (
                      <div style={{ borderTop: "1px solid #1a1a22", padding: "14px", background: "#0e0e12", display: "flex", flexDirection: "column", gap: 14 }}>
                        {/* Feel */}
                        <div>
                          <div style={{ fontSize: "10px", color: "#383838", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>How did it feel?</div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                            {FEELS.map(f => {
                              const active = d.feel === f.value;
                              return (
                                <button key={f.value} className="btn-feel"
                                  onClick={() => updateEx(activeDay, i, { feel: active ? null : f.value })}
                                  style={{
                                    padding: "8px 10px", borderRadius: 9,
                                    background: active ? `${f.color}18` : "#161619",
                                    border: `1.5px solid ${active ? f.color+"88" : "#1e1e26"}`,
                                    color: active ? f.color : "#555",
                                    outline: "none", cursor: "pointer",
                                    display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                                    minWidth: 52
                                  }}>
                                  <span style={{ fontSize: "18px", lineHeight: 1 }}>{f.emoji}</span>
                                  <span style={{ fontSize: "9px", letterSpacing: "0.04em", fontWeight: active ? 600 : 400 }}>{f.short}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Notes — font-size 16px prevents iOS zoom */}
                        <div>
                          <div style={{ fontSize: "10px", color: "#383838", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Session notes</div>
                          <textarea
                            value={d.note}
                            onChange={e => updateEx(activeDay, i, { note: e.target.value })}
                            placeholder={`e.g. "4×7 @ 20kg added. Last set shaky."`}
                            rows={3}
                            style={{
                              width: "100%", background: "#161619", border: "1px solid #202028",
                              borderRadius: 10, padding: "10px 12px", color: "#bbb",
                              fontSize: "16px", lineHeight: 1.55,
                            }}
                          />
                          {d.note.trim() && (
                            <div style={{ fontSize: "10px", color: "#333", marginTop: 4, textAlign: "right" }}>logged ✓ · {d.note.length} chars</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Collapsed preview */}
                    {!isReadOnly && !d.expanded && (d.note.trim() || d.feel) && (
                      <div style={{ borderTop: "1px solid #1a1a2233", padding: "7px 14px", display: "flex", gap: 8, alignItems: "center" }}>
                        {d.feel && (() => { const f = FEELS.find(x => x.value === d.feel); return f ? <span style={{ fontSize: "14px" }}>{f.emoji}</span> : null; })()}
                        {d.note.trim() && (
                          <span style={{ fontSize: "11px", color: "#2e2e3e", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {d.note.slice(0, 55)}{d.note.length > 55 ? "…" : ""}
                          </span>
                        )}
                        <span style={{ fontSize: "10px", color: "#222", flexShrink: 0 }}>tap ↑</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Finisher */}
            <div style={{ background: `${day.color}0b`, border: `1px solid ${day.color}28`, borderRadius: 12, padding: "12px 14px", fontSize: "12px", color: "#888", display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
              <span>🔥</span>
              <div><span style={{ color: day.color, marginRight: 6, fontSize: "11px", letterSpacing: "0.1em" }}>FINISHER</span>{displayPlan.finisher}</div>
            </div>

            {/* Optimize button */}
            {historyTab === "current" && (
              <div style={{ marginBottom: 4 }}>
                {ai.status === "error" && (
                  <div style={{ fontSize: "11px", color: "#f87171", marginBottom: 8, padding: "10px 12px", background: "#1a0a0a", borderRadius: 8 }}>
                    ⚠ {ai.error}
                  </div>
                )}
                {ai.status === "applied" && (
                  <div style={{ fontSize: "11px", color: "#4ade80", marginBottom: 8, padding: "10px 12px", background: "#0a1a0e", borderRadius: 8 }}>
                    ✓ Plan updated — new version saved to history
                  </div>
                )}
                <button className="btn-optimize"
                  disabled={ai.status === "loading" || (!sessionComplete && !hasAnyLog)}
                  onClick={handleOptimize}
                  style={{
                    width: "100%", padding: "16px", borderRadius: 12, minHeight: 54,
                    background: `linear-gradient(135deg, ${day.color}, ${day.color}bb)`,
                    color: day.textColor, fontFamily: "'Syne',sans-serif", fontWeight: 700,
                    fontSize: "15px", outline: "none",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                  }}>
                  {ai.status === "loading"
                    ? <><span style={{ animation: "pulse 1.2s ease-in-out infinite" }}>✦</span> Analyzing your session…</>
                    : <><SparkleIcon /> Optimize Next {day.theme} Session</>}
                </button>
                {!sessionComplete && !hasAnyLog && (
                  <div style={{ fontSize: "10px", color: "#333", textAlign: "center", marginTop: 6 }}>
                    Log at least one set or add a note to unlock
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── SNACKS TAB ── */}
        {tab === "snacks" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: "10px", color: "#383838", marginBottom: 2, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              3 desk breaks · every single day
            </div>
            {day.snacks.map((snack, i) => {
              const meta = {
                neck:     { icon: "🧠", label: "NECK",     accent: "#38BDF8" },
                bridge:   { icon: "🌉", label: "BRIDGE",   accent: "#34D399" },
                movement: { icon: "⚡", label: "MOVEMENT", accent: day.color }
              }[snack.category] || { icon: "⚡", label: "MOVEMENT", accent: day.color };
              return (
                <div key={i} className="snack-card" style={{ background: "#161619", border: "1px solid #1e1e26", borderRadius: 12, padding: "14px", borderLeft: `3px solid ${meta.accent}` }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 7 }}>
                    <span style={{ fontSize: "10px", color: day.color, letterSpacing: "0.12em", textTransform: "uppercase" }}>{snack.time}</span>
                    <span style={{ fontSize: "9px", background: `${meta.accent}15`, color: meta.accent, border: `1px solid ${meta.accent}30`, borderRadius: 4, padding: "1px 6px", letterSpacing: "0.1em" }}>{meta.icon} {meta.label}</span>
                  </div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "13px", fontWeight: 700, color: "#ddd", marginBottom: 4 }}>{snack.move}</div>
                  <div style={{ fontSize: "11px", color: "#404040" }}>↳ {snack.why}</div>
                </div>
              );
            })}
            <div style={{ background: "#111114", border: "1px solid #1a1a22", borderRadius: 12, padding: "13px 14px", marginTop: 2, fontSize: "12px", color: "#404040", lineHeight: 1.6 }}>
              <span style={{ color: "#666" }}>Pro tip:</span> Set a recurring reminder every 90 min. Snacks work best when reflexive, not optional.
            </div>
          </div>
        )}

        {/* Progression note */}
        <div style={{ background: "#111114", border: "1px solid #1a1a22", borderRadius: 12, padding: "14px", marginTop: 14, fontSize: "12px", color: "#484848", lineHeight: 1.7 }}>
          <div style={{ fontSize: "10px", color: "#2e2e2e", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Progression Rule</div>
          Each week, aim to add 1 rep or a small amount of weight to your main lifts. When you hit the top of the rep range across all sets, increase load. The optimizer handles this automatically once you start logging.
        </div>

      </div>
    </div>
  );
}
