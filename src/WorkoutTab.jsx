import { useState, useEffect } from "react";

// ─── FEEL OPTIONS ──────────────────────────────────────────────────────────────
const FEELS = [
  { value: "too_easy", label: "Too Easy",  short: "EASE UP",  color: "#6B8F7A" },
  { value: "easy",     label: "Easy",      short: "EASY",     color: "#7A9B72" },
  { value: "perfect",  label: "Perfect",   short: "PERFECT",  color: "#F0EDE6" },
  { value: "hard",     label: "Hard",      short: "HARD",     color: "#B08878" },
  { value: "too_hard", label: "Too Hard",  short: "BACK OFF", color: "#8B5A5A" },
];

// ─── BASE PLAN ─────────────────────────────────────────────────────────────────
const BASE_PLAN = {
  schedule: "Mon / Wed / Fri  ·  or any 3 non-consecutive days",
  days: [
    {
      id: "A", label: "Day A", theme: "Push Power", color: "#F0EDE6", textColor: "#111110",
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
      id: "B", label: "Day B", theme: "Pull Strength", color: "#C4A882", textColor: "#111110",
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
      id: "C", label: "Day C", theme: "Full Body", color: "#8A9BAD", textColor: "#111110",
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

// ─── ICONS (no emojis) ────────────────────────────────────────────────────────
const CheckIcon = ({ size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <path d="M1.5 6l3 3L10.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ChevronIcon = ({ open }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const AIIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <path d="M7 1l1.2 4.8L13 7l-4.8 1.2L7 13l-1.2-4.8L1 7l4.8-1.2L7 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
);
const ArrowIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M1 10L10 1M10 1H3M10 1v7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── PROMPT BUILDERS ──────────────────────────────────────────────────────────
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
  const [exData, setExData]           = useState(() => {
    try { return JSON.parse(localStorage.getItem("workout_exdata") || "{}"); } catch { return {}; }
  });
  const [history, setHistory]         = useState(() => {
    try { return JSON.parse(localStorage.getItem("workout_history") || "{}"); } catch { return {}; }
  });
  const [aiState, setAiState]         = useState({});
  const [showApprove, setShowApprove] = useState(null);

  const day          = BASE_PLAN.days.find(d => d.id === activeDay);
  const dayHistory   = history[activeDay] || [];
  const currentPlan  = dayHistory.length > 0 ? dayHistory[dayHistory.length - 1] : day.mainBlock;
  const previousPlan = dayHistory.length > 1 ? dayHistory[dayHistory.length - 2] : null;
  const ai           = aiState[activeDay] || { status: "idle" };

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

  useEffect(() => {
    try { localStorage.setItem("workout_history", JSON.stringify(history)); } catch {}
  }, [history]);

  useEffect(() => {
    try { localStorage.setItem("workout_exdata", JSON.stringify(exData)); } catch {}
  }, [exData]);

  const exercises   = historyTab === "previous" && previousPlan ? previousPlan.exercises : currentPlan.exercises;
  const displayPlan = historyTab === "previous" && previousPlan ? previousPlan : currentPlan;

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      background: "#111110",
      minHeight: "100%",
      color: "#F0EDE6",
      paddingBottom: "env(safe-area-inset-bottom, 20px)",
    }}>
      <style>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        .wo-btn { cursor: pointer; border: none; outline: none; background: none; font-family: inherit; }
        .wo-btn:active { opacity: 0.75; }
        textarea { resize: none; outline: none; font-family: inherit; }
        textarea::placeholder { color: #333330; }
        @keyframes wo-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes wo-slide  { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        .wo-slide { animation: wo-slide 0.2s ease; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{
        padding: "32px 24px 24px",
        borderBottom: "1px solid #2A2A28",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{
            fontSize: 10, letterSpacing: "0.18em", color: "#4A4A48",
            textTransform: "uppercase", marginBottom: 16,
          }}>
            Training Protocol
          </div>
          <div style={{
            fontSize: "clamp(28px, 6vw, 44px)",
            fontWeight: 300,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "#F0EDE6",
            marginBottom: 20,
          }}>
            Upper Body<br />
            <span style={{ color: "#6B6860", fontWeight: 300 }}>Strength</span>
          </div>
          <div style={{ display: "flex", gap: 20, fontSize: 11, color: "#3A3A38", letterSpacing: "0.08em" }}>
            <span>3× / WEEK</span>
            <span style={{ color: "#2A2A28" }}>·</span>
            <span>UNDER 20 MIN</span>
          </div>
        </div>
      </div>

      {/* ── DAY SELECTOR ── */}
      <div style={{ padding: "20px 24px 0", maxWidth: 680, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 1, borderBottom: "1px solid #2A2A28" }}>
          {BASE_PLAN.days.map(d => {
            const dHist = history[d.id] || [];
            const isActive = activeDay === d.id;
            return (
              <button key={d.id} className="wo-btn"
                onClick={() => { setActiveDay(d.id); setTab("workout"); setHistoryTab("current"); }}
                style={{
                  flex: 1,
                  padding: "14px 8px 16px",
                  borderBottom: isActive ? `2px solid ${d.color}` : "2px solid transparent",
                  marginBottom: -1,
                  color: isActive ? d.color : "#3A3A38",
                  transition: "color 0.15s, border-color 0.15s",
                }}>
                <div style={{ fontSize: 13, fontWeight: 400, letterSpacing: "0.04em", marginBottom: 3 }}>
                  {d.label}
                  {dHist.length > 0 && (
                    <span style={{ fontSize: 9, color: "#3A3A38", marginLeft: 5, letterSpacing: "0.1em" }}>
                      V{dHist.length + 1}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: isActive ? "#6B6860" : "#2A2A28" }}>
                  {d.theme}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: "24px 24px 40px", maxWidth: 680, margin: "0 auto" }}>

        {/* Day meta */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, color: "#4A4A48", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
              {day.focus}
            </div>
            {currentPlan.generatedAt && (
              <div style={{ fontSize: 10, color: "#3A3A38", letterSpacing: "0.06em" }}>
                AI optimized · {currentPlan.generatedAt}
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 11, color: "#4A4A48", letterSpacing: "0.06em" }}>
              {currentPlan.duration}
            </div>
            <div style={{
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: sessionComplete ? "#7A9B72" : "#3A3A38",
              borderBottom: `1px solid ${sessionComplete ? "#7A9B72" : "#2A2A28"}`,
              paddingBottom: 1,
              transition: "all 0.3s",
            }}>
              {completedCount}/{totalEx}
            </div>
          </div>
        </div>

        {/* AI approval */}
        {showApprove === activeDay && ai.suggestion && (
          <div className="wo-slide" style={{
            border: "1px solid #2A2A28",
            borderTop: `2px solid ${day.color}`,
            background: "#1A1A18",
            padding: "20px",
            marginBottom: 24,
          }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
              <span style={{ color: day.color }}><AIIcon /></span>
              <span style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6B6860" }}>
                AI Suggestion — {day.theme} V{(dayHistory.length || 0) + 2}
              </span>
            </div>
            <div style={{
              fontSize: 13, color: "#8A8A88", lineHeight: 1.75,
              marginBottom: 20, paddingBottom: 20,
              borderBottom: "1px solid #2A2A28",
              fontWeight: 300,
            }}>
              {ai.suggestion.reasoning}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: 20 }}>
              {ai.suggestion.exercises.map((ex, i) => {
                const prev = currentPlan.exercises[i];
                const changed = prev && (ex.name !== prev.name || ex.sets !== prev.sets || ex.reps !== prev.reps || ex.rest !== prev.rest);
                return (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 0",
                    borderBottom: "1px solid #1E1E1C",
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 400, color: changed ? day.color : "#6B6860", marginBottom: 2 }}>
                        {ex.name}
                      </div>
                      <div style={{ fontSize: 10, color: "#3A3A38", letterSpacing: "0.06em" }}>
                        {ex.sets}×{ex.reps} · {ex.rest} rest
                      </div>
                    </div>
                    {changed && prev ? (
                      <div style={{ fontSize: 10, textAlign: "right", letterSpacing: "0.06em" }}>
                        <div style={{ color: "#2A2A28", textDecoration: "line-through", marginBottom: 2 }}>
                          {prev.sets}×{prev.reps}
                        </div>
                        <div style={{ color: day.color }}>{ex.sets}×{ex.reps}</div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 9, color: "#2A2A28", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        unchanged
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="wo-btn" onClick={handleApprove} style={{
                flex: 1, padding: "14px",
                background: day.color,
                color: day.textColor,
                fontSize: 12, letterSpacing: "0.12em", fontWeight: 400,
                textTransform: "uppercase",
              }}>
                Apply Plan
              </button>
              <button className="wo-btn" onClick={handleDiscard} style={{
                padding: "14px 20px",
                border: "1px solid #2A2A28",
                color: "#4A4A48",
                fontSize: 12, letterSpacing: "0.12em", fontWeight: 400,
                textTransform: "uppercase",
              }}>
                Discard
              </button>
            </div>
          </div>
        )}

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 24, borderBottom: "1px solid #2A2A28", marginBottom: 24 }}>
          {[["workout","Main Block"], ["snacks","Desk Snacks"]].map(([t, lbl]) => (
            <button key={t} className="wo-btn" onClick={() => setTab(t)} style={{
              padding: "10px 0 12px",
              fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
              color: tab === t ? "#F0EDE6" : "#3A3A38",
              borderBottom: tab === t ? "1px solid #F0EDE6" : "1px solid transparent",
              marginBottom: -1,
              transition: "color 0.15s, border-color 0.15s",
            }}>
              {lbl}
            </button>
          ))}
        </div>

        {/* ── WORKOUT TAB ── */}
        {tab === "workout" && (
          <>
            {/* Week toggle */}
            {previousPlan && (
              <div style={{ display: "flex", gap: 16, marginBottom: 24, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {[["current","This Week"], ["previous","Last Week"]].map(([val, lbl]) => (
                  <button key={val} className="wo-btn" onClick={() => setHistoryTab(val)} style={{
                    color: historyTab === val ? "#F0EDE6" : "#3A3A38",
                    borderBottom: historyTab === val ? "1px solid #F0EDE6" : "1px solid transparent",
                    paddingBottom: 4,
                    transition: "color 0.15s",
                  }}>
                    {lbl}
                  </button>
                ))}
              </div>
            )}

            {historyTab === "previous" && previousPlan?.reasoning && (
              <div style={{
                borderLeft: "2px solid #2A2A28",
                paddingLeft: 16,
                marginBottom: 24,
                fontSize: 12, color: "#6B6860", lineHeight: 1.7, fontWeight: 300,
              }}>
                {previousPlan.reasoning}
              </div>
            )}

            {/* Warmup */}
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 16,
              padding: "14px 0", borderBottom: "1px solid #1E1E1C", marginBottom: 8,
            }}>
              <div style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#3A3A38", paddingTop: 2, minWidth: 52 }}>
                Warmup
              </div>
              <div style={{ fontSize: 12, color: "#6B6860", fontWeight: 300, lineHeight: 1.6 }}>
                {displayPlan.warmup}
              </div>
            </div>

            {/* Exercises */}
            <div style={{ display: "flex", flexDirection: "column", marginBottom: 8 }}>
              {exercises.map((ex, i) => {
                const d = historyTab === "current"
                  ? getEx(activeDay, i)
                  : { sets: Array(ex.sets).fill(true), note: "", feel: null, expanded: false };
                const allDone   = d.sets.every(Boolean);
                const someDone  = d.sets.some(Boolean);
                const isReadOnly = historyTab === "previous";

                return (
                  <div key={i} style={{
                    borderBottom: "1px solid #1E1E1C",
                    opacity: isReadOnly ? 0.6 : 1,
                    transition: "opacity 0.2s",
                  }}>
                    {/* Main row */}
                    <div style={{ padding: "16px 0", display: "flex", gap: 14, alignItems: "flex-start" }}>
                      {/* Check */}
                      <div
                        onClick={() => !isReadOnly && toggleSet(activeDay, i, d.sets.findIndex(s => !s) === -1 ? 0 : d.sets.findIndex(s => !s))}
                        style={{
                          width: 18, height: 18, flexShrink: 0, marginTop: 2,
                          border: `1px solid ${allDone ? day.color : "#2A2A28"}`,
                          background: allDone ? day.color : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: allDone ? day.textColor : "transparent",
                          cursor: isReadOnly ? "default" : "pointer",
                          transition: "all 0.15s",
                        }}>
                        <CheckIcon size={9} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 14, fontWeight: 400,
                          color: allDone && !isReadOnly ? "#3A3A38" : "#F0EDE6",
                          textDecoration: allDone && !isReadOnly ? "line-through" : "none",
                          marginBottom: 6, letterSpacing: "-0.01em",
                          transition: "color 0.15s",
                        }}>
                          {ex.name}
                        </div>
                        <div style={{ display: "flex", gap: 12, fontSize: 10, color: "#4A4A48", letterSpacing: "0.08em", marginBottom: 10 }}>
                          <span>{ex.sets} sets</span>
                          <span style={{ color: "#2A2A28" }}>·</span>
                          <span>{ex.reps} reps</span>
                          <span style={{ color: "#2A2A28" }}>·</span>
                          <span>{ex.rest} rest</span>
                        </div>

                        {/* Set dots */}
                        {!isReadOnly && (
                          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}>
                            {d.sets.map((done, si) => (
                              <div key={si}
                                onClick={() => toggleSet(activeDay, i, si)}
                                style={{
                                  width: 38, height: 38,
                                  border: `1px solid ${done ? day.color : "#2A2A28"}`,
                                  background: done ? day.color : "transparent",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  color: done ? day.textColor : "#3A3A38",
                                  fontSize: 11, letterSpacing: "0.04em",
                                  cursor: "pointer",
                                  transition: "all 0.12s",
                                }}>
                                {done ? <CheckIcon size={10} /> : si + 1}
                              </div>
                            ))}
                            {someDone && !allDone && (
                              <span style={{ fontSize: 10, color: "#4A4A48", marginLeft: 4, letterSpacing: "0.06em" }}>
                                {d.sets.filter(Boolean).length}/{ex.sets}
                              </span>
                            )}
                          </div>
                        )}

                        <div style={{ fontSize: 11, color: "#3A3A38", fontWeight: 300, lineHeight: 1.6 }}>
                          {ex.note}
                        </div>
                      </div>

                      {!isReadOnly && (
                        <button className="wo-btn"
                          onClick={() => updateEx(activeDay, i, { expanded: !d.expanded })}
                          style={{
                            color: d.expanded ? day.color : "#2A2A28",
                            padding: "4px",
                            transition: "color 0.15s",
                          }}>
                          <ChevronIcon open={d.expanded} />
                        </button>
                      )}
                    </div>

                    {/* Expanded panel */}
                    {!isReadOnly && d.expanded && (
                      <div style={{
                        borderTop: "1px solid #1E1E1C",
                        padding: "20px 0 20px 32px",
                        display: "flex", flexDirection: "column", gap: 20,
                      }}>
                        {/* Feel */}
                        <div>
                          <div style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "#3A3A38", marginBottom: 12 }}>
                            How did it feel?
                          </div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {FEELS.map(f => {
                              const isActive = d.feel === f.value;
                              return (
                                <button key={f.value} className="wo-btn"
                                  onClick={() => updateEx(activeDay, i, { feel: isActive ? null : f.value })}
                                  style={{
                                    padding: "8px 14px",
                                    border: `1px solid ${isActive ? f.color : "#2A2A28"}`,
                                    background: isActive ? "transparent" : "transparent",
                                    color: isActive ? f.color : "#3A3A38",
                                    fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase",
                                    transition: "color 0.12s, border-color 0.12s",
                                  }}>
                                  {f.short}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Notes */}
                        <div>
                          <div style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "#3A3A38", marginBottom: 10 }}>
                            Session notes
                          </div>
                          <textarea
                            value={d.note}
                            onChange={e => updateEx(activeDay, i, { note: e.target.value })}
                            placeholder={`e.g. "4×7 @ 20kg added. Last set shaky."`}
                            rows={3}
                            style={{
                              width: "100%",
                              background: "transparent",
                              border: "none",
                              borderBottom: "1px solid #2A2A28",
                              padding: "8px 0",
                              color: "#8A8A88",
                              fontSize: 13, lineHeight: 1.7, fontWeight: 300,
                            }}
                          />
                          {d.note.trim() && (
                            <div style={{ fontSize: 9, color: "#3A3A38", marginTop: 6, letterSpacing: "0.08em" }}>
                              {d.note.length} chars · logged
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Collapsed log preview */}
                    {!isReadOnly && !d.expanded && (d.note.trim() || d.feel) && (
                      <div style={{ padding: "0 0 12px 32px", display: "flex", gap: 12, alignItems: "center" }}>
                        {d.feel && (() => {
                          const f = FEELS.find(x => x.value === d.feel);
                          return f ? <span style={{ fontSize: 9, color: f.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>{f.short}</span> : null;
                        })()}
                        {d.note.trim() && (
                          <span style={{ fontSize: 11, color: "#3A3A38", fontWeight: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {d.note.slice(0, 60)}{d.note.length > 60 ? "…" : ""}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Finisher */}
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 16,
              padding: "16px 0", borderBottom: "1px solid #1E1E1C", marginBottom: 28,
            }}>
              <div style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#3A3A38", paddingTop: 2, minWidth: 52 }}>
                Finisher
              </div>
              <div style={{ fontSize: 12, color: "#6B6860", fontWeight: 300, lineHeight: 1.6 }}>
                {displayPlan.finisher}
              </div>
            </div>

            {/* Optimize */}
            {historyTab === "current" && (
              <div>
                {ai.status === "error" && (
                  <div style={{ fontSize: 11, color: "#8B5A5A", marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #2A2A28", letterSpacing: "0.04em", fontWeight: 300 }}>
                    {ai.error}
                  </div>
                )}
                {ai.status === "applied" && (
                  <div style={{ fontSize: 11, color: "#7A9B72", marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #2A2A28", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Plan updated — new version saved
                  </div>
                )}
                <button className="wo-btn"
                  disabled={ai.status === "loading" || (!sessionComplete && !hasAnyLog)}
                  onClick={handleOptimize}
                  style={{
                    width: "100%", padding: "18px",
                    background: "transparent",
                    border: `1px solid ${(!sessionComplete && !hasAnyLog) ? "#1E1E1C" : day.color}`,
                    color: (!sessionComplete && !hasAnyLog) ? "#2A2A28" : day.color,
                    fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    transition: "opacity 0.2s",
                    opacity: ai.status === "loading" ? 0.5 : 1,
                    cursor: (ai.status === "loading" || (!sessionComplete && !hasAnyLog)) ? "not-allowed" : "pointer",
                  }}>
                  {ai.status === "loading" ? (
                    <span style={{ animation: "wo-pulse 1.2s ease-in-out infinite", letterSpacing: "0.16em" }}>
                      Analyzing session…
                    </span>
                  ) : (
                    <>
                      <AIIcon />
                      Optimize Next {day.theme} Session
                      <ArrowIcon />
                    </>
                  )}
                </button>
                {!sessionComplete && !hasAnyLog && (
                  <div style={{ fontSize: 9, color: "#2A2A28", textAlign: "center", marginTop: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Log at least one set or add a note to unlock
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── SNACKS TAB ── */}
        {tab === "snacks" && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 9, color: "#3A3A38", marginBottom: 24, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              3 desk breaks · every single day
            </div>
            {day.snacks.map((snack, i) => {
              const accent = {
                neck:     "#6B8F7A",
                bridge:   "#7A9B72",
                movement: day.color,
              }[snack.category] || day.color;
              return (
                <div key={i} style={{
                  padding: "20px 0",
                  borderBottom: "1px solid #1E1E1C",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: accent }}>
                      {snack.time}
                    </div>
                    <div style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3A3A38" }}>
                      {snack.category}
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 400, color: "#F0EDE6", marginBottom: 8, letterSpacing: "-0.01em", lineHeight: 1.4 }}>
                    {snack.move}
                  </div>
                  <div style={{ fontSize: 11, color: "#4A4A48", fontWeight: 300, lineHeight: 1.65 }}>
                    {snack.why}
                  </div>
                </div>
              );
            })}
            <div style={{ padding: "20px 0", fontSize: 11, color: "#3A3A38", lineHeight: 1.75, fontWeight: 300 }}>
              Set a recurring reminder every 90 min. Snacks work best when reflexive, not optional.
            </div>
          </div>
        )}

        {/* Progression note */}
        <div style={{
          borderTop: "1px solid #1E1E1C",
          paddingTop: 24, marginTop: 8,
          fontSize: 11, color: "#3A3A38", lineHeight: 1.75, fontWeight: 300,
        }}>
          <div style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#2A2A28", marginBottom: 10 }}>
            Progression Rule
          </div>
          Each week, aim to add 1 rep or a small amount of weight to your main lifts. When you hit the top of the rep range across all sets, increase load. The optimizer handles this automatically once you start logging.
        </div>

      </div>
    </div>
  );
}
