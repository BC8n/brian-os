import { useState, useCallback, useEffect } from "react";
import WorkoutTab from "./WorkoutTab";

const START_DATE = new Date("2026-03-09");
const WORK_DAYS = [1,2,3,4,5];

function addWorkDays(startDate, days) {
  let d = new Date(startDate), added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    if (WORK_DAYS.includes(d.getDay())) added++;
  }
  return d;
}

function fmt(d) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── MUTED PANTONE PHASE COLORS ───────────────────────────────────────────────
const PHASES = [
  {
    id: "p1", title: "Phase 1", subtitle: "Technical Foundation",
    detail: "Python · APIs · Prompt Engineering", color: "#8A9BAD",
    milestone: "First working brand voice prompt system",
    sections: [
      { id: "s1", title: "Environment Setup", items: [
        { id: "a1", text: "Install Python 3.11+", url: "https://www.python.org/downloads/", mins: 15 },
        { id: "a2", text: "Install VS Code", url: "https://code.visualstudio.com/download", mins: 10 },
        { id: "a3", text: "Create GitHub account and first repo", url: "https://github.com/new", mins: 20 },
        { id: "a4", text: "Sign up — OpenAI API", url: "https://platform.openai.com/signup", mins: 10 },
        { id: "a5", text: "Sign up — Anthropic API", url: "https://console.anthropic.com/", mins: 10 },
        { id: "a6", text: "Sign up — Make.com free tier", url: "https://www.make.com/en/register", mins: 10 },
        { id: "a7", text: "Sign up — Pinecone free starter", url: "https://www.pinecone.io/", mins: 10 },
      ]},
      { id: "s2", title: "Python Basics", items: [
        { id: "b1", text: "learnpython.org — Hello World, Variables, Strings", url: "https://www.learnpython.org/", mins: 60 },
        { id: "b2", text: "learnpython.org — Lists, Operators, String Formatting", url: "https://www.learnpython.org/en/Lists", mins: 60 },
        { id: "b3", text: "learnpython.org — Functions and Conditions", url: "https://www.learnpython.org/en/Functions", mins: 60 },
        { id: "b4", text: "learnpython.org — Dictionaries and Loops", url: "https://www.learnpython.org/en/Dictionaries", mins: 60 },
        { id: "b5", text: "Corey Schafer — File I/O in Python (YouTube, 20 min)", url: "https://www.youtube.com/watch?v=Uh2ebFW8OYM", mins: 20 },
        { id: "b6", text: "BUILD: Write 3 Python scripts, push to GitHub", url: "https://github.com/", mins: 90, isBuild: true },
      ]},
      { id: "s3", title: "APIs and First Calls", items: [
        { id: "c1", text: "Read OpenAI Platform Quickstart end-to-end", url: "https://platform.openai.com/docs/overview/", mins: 45 },
        { id: "c2", text: "Read Anthropic API Getting Started", url: "https://docs.anthropic.com/en/api/getting-started", mins: 45 },
        { id: "c3", text: "BUILD: First successful OpenAI API call in Python", url: "https://platform.openai.com/docs/api-reference/introduction", mins: 60, isBuild: true },
        { id: "c4", text: "BUILD: First Anthropic Claude API call in Python", url: "https://docs.anthropic.com/en/api/getting-started", mins: 60, isBuild: true },
        { id: "c5", text: "Explore OpenAI Playground — test prompts without code", url: "https://platform.openai.com/playground", mins: 30 },
      ]},
      { id: "s4", title: "Prompt Engineering", items: [
        { id: "d1", text: "DeepLearning.ai — Prompt Engineering for Developers (FREE ~2hrs)", url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/", mins: 120 },
        { id: "d2", text: "Anthropic Prompt Engineering Overview — read and bookmark", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", mins: 45 },
        { id: "d3", text: "Anthropic Best Practices — Claude 4 techniques", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices", mins: 45 },
        { id: "d4", text: "Anthropic Interactive Tutorial on GitHub", url: "https://github.com/anthropics/prompt-eng-interactive-tutorial", mins: 60 },
        { id: "d5", text: "BUILD: Brand Voice Prompt System", url: "https://github.com/", mins: 90, isBuild: true, isPortfolio: true },
      ]},
    ]
  },
  {
    id: "p2", title: "Phase 2", subtitle: "Make Automation",
    detail: "No-Code Workflows · 5 Live Automations", color: "#9B8AAD",
    milestone: "5 working Make automations built and demoed on Loom",
    sections: [
      { id: "s5", title: "Make Foundation", items: [
        { id: "e1", text: "Make Academy — Foundation course (FREE cert)", url: "https://academy.make.com/bundles/foundation", mins: 120 },
        { id: "e2", text: "Make Academy — Basics: Modules and Data Types", url: "https://academy.make.com/bundles/make-basics", mins: 90 },
        { id: "e3", text: "Read Make + OpenAI Integration docs", url: "https://www.make.com/en/integrations/openai-gpt-3", mins: 30 },
        { id: "e4", text: "Browse Make Templates Library for inspiration", url: "https://www.make.com/en/templates", mins: 20 },
        { id: "e5", text: "Read Make Webhooks documentation", url: "https://www.make.com/en/help/tools/webhooks", mins: 30 },
        { id: "e6", text: "Liam Ottley — Make automation tutorials (YouTube)", url: "https://www.youtube.com/@LiamOttley", mins: 60 },
        { id: "e7", text: "Join Make Community", url: "https://community.make.com/", mins: 10 },
        { id: "e8", text: "Join AI Automation Society on Skool (free)", url: "https://www.skool.com/ai-automation-society", mins: 10 },
      ]},
      { id: "s6", title: "Build 5 Automations", items: [
        { id: "f1", text: "BUILD Auto #1: Form to Google Sheet to Slack notification", url: "https://www.make.com/en/templates", mins: 60, isBuild: true },
        { id: "f2", text: "BUILD Auto #2: Email brief to OpenAI generates copy to Google Doc", url: "https://www.make.com/en/integrations/openai-gpt-3", mins: 90, isBuild: true },
        { id: "f3", text: "BUILD Auto #3: Lead form to OpenAI enriches and scores to Airtable", url: "https://www.make.com/en/integrations/airtable", mins: 90, isBuild: true },
        { id: "f4", text: "BUILD Auto #4: Webhook email router with AI classification", url: "https://www.make.com/en/help/tools/webhooks", mins: 90, isBuild: true },
        { id: "f5", text: "BUILD Auto #5: Competitor blog RSS to AI summary to Slack digest", url: "https://www.make.com/en/integrations/rss", mins: 90, isBuild: true },
        { id: "f6", text: "Record Loom demo of your 3 best automations", url: "https://www.loom.com/", mins: 30, isBuild: true },
      ]},
    ]
  },
  {
    id: "p3", title: "Phase 3", subtitle: "LangChain + RAG",
    detail: "Vector Databases · Knowledge Bases", color: "#7A9B72",
    milestone: "Working RAG knowledge base with Streamlit UI",
    sections: [
      { id: "s7", title: "LangChain Basics", items: [
        { id: "g1", text: "LangChain Tutorials — read introduction", url: "https://python.langchain.com/docs/tutorials/", mins: 45 },
        { id: "g2", text: "LangChain — Build a Simple LLM App", url: "https://python.langchain.com/docs/tutorials/llm_chain/", mins: 90 },
        { id: "g3", text: "LangChain — Build a RAG Application", url: "https://python.langchain.com/docs/tutorials/rag/", mins: 120 },
        { id: "g4", text: "Chroma DB — Getting Started (free local vector DB)", url: "https://docs.trychroma.com/getting-started", mins: 60 },
        { id: "g5", text: "DeepLearning.ai — LangChain Chat With Your Data (FREE ~2.5hrs)", url: "https://www.deeplearning.ai/short-courses/langchain-chat-with-your-data/", mins: 150 },
        { id: "g6", text: "LangChain — Conversational RAG with chat history", url: "https://python.langchain.com/docs/tutorials/qa_chat_history/", mins: 90 },
      ]},
      { id: "s8", title: "Portfolio Project 1 — Content Pipeline", items: [
        { id: "h1", text: "Streamlit quickstart docs", url: "https://docs.streamlit.io/get-started", mins: 30 },
        { id: "h2", text: "BUILD P1: AI Content Production System", url: "https://github.com/", mins: 240, isBuild: true, isPortfolio: true },
        { id: "h3", text: "DEMO P1: Record 3-min Loom walkthrough", url: "https://www.loom.com/", mins: 30, isBuild: true },
        { id: "h4", text: "PUBLISH P1: GitHub README — 6hrs to 45min per asset", url: "https://github.com/", mins: 45, isBuild: true },
      ]},
      { id: "s9", title: "Portfolio Project 2 — Knowledge Base", items: [
        { id: "i1", text: "BUILD P2: AI Knowledge Base Assistant", url: "https://python.langchain.com/docs/tutorials/rag/", mins: 240, isBuild: true, isPortfolio: true },
        { id: "i2", text: "DEMO P2: Record 3-min Loom walkthrough", url: "https://www.loom.com/", mins: 30, isBuild: true },
        { id: "i3", text: "PUBLISH P2: GitHub README with business case", url: "https://github.com/", mins: 45, isBuild: true },
      ]},
    ]
  },
  {
    id: "p4", title: "Phase 4", subtitle: "Certifications",
    detail: "Azure AI-900 · Google Cloud · HubSpot", color: "#C4A882",
    milestone: "Azure AI-900 exam passed",
    sections: [
      { id: "s10", title: "Google Cloud Gen AI — FREE, do first", items: [
        { id: "j1", text: "Google Cloud — Intro to Generative AI (FREE)", url: "https://cloudskillsboost.google/course_templates/536", mins: 45 },
        { id: "j2", text: "Google Cloud — Generative AI Fundamentals Path (FREE)", url: "https://cloudskillsboost.google/paths/183", mins: 180 },
        { id: "j3", text: "Complete path — add badge to LinkedIn", url: "https://www.linkedin.com/", mins: 15 },
      ]},
      { id: "s11", title: "HubSpot AI for Marketers — FREE", items: [
        { id: "k1", text: "HubSpot AI for Marketers Certification (FREE ~4hrs)", url: "https://academy.hubspot.com/courses/ai-for-marketers", mins: 240 },
        { id: "k2", text: "Add HubSpot AI cert to LinkedIn and resume", url: "https://www.linkedin.com/", mins: 15 },
      ]},
      { id: "s12", title: "Emory AI for Marketing — Coursera audit free", items: [
        { id: "l1", text: "Emory — What Can AI Do for Marketing?", url: "https://www.coursera.org/learn/whatcanaidoformarketing", mins: 180 },
        { id: "l2", text: "Practical AI and Prompting for Marketing Professionals", url: "https://www.coursera.org/learn/practical-ai-and-prompting-for-marketing-professionals", mins: 180 },
      ]},
      { id: "s13", title: "Azure AI-900 — $165 exam fee", items: [
        { id: "m1", text: "Microsoft Learn — AI-900 Full Prep Path (FREE study)", url: "https://learn.microsoft.com/en-us/training/paths/get-started-with-artificial-intelligence-on-azure/", mins: 300 },
        { id: "m2", text: "Microsoft Learn — NLP Module", url: "https://learn.microsoft.com/en-us/training/paths/explore-natural-language-processing/", mins: 120 },
        { id: "m3", text: "Microsoft Learn — Generative AI on Azure", url: "https://learn.microsoft.com/en-us/training/paths/introduction-generative-ai/", mins: 120 },
        { id: "m4", text: "Azure AI-900 Practice Assessment — target 85% before booking", url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/practice/assessment?assessment-type=practice&assessmentId=26", mins: 60 },
        { id: "m5", text: "Book Azure AI-900 exam at Pearson VUE ($165)", url: "https://home.pearsonvue.com/microsoft", mins: 15 },
        { id: "m6", text: "PASS: Azure AI-900 Exam", url: "https://home.pearsonvue.com/microsoft", mins: 0, isMilestone: true },
        { id: "m7", text: "Add Azure AI-900 to LinkedIn and resume", url: "https://www.linkedin.com/", mins: 15 },
      ]},
    ]
  },
  {
    id: "p5", title: "Phase 5", subtitle: "Portfolio 3 + 4",
    detail: "Marketing Intelligence · Lead Pipeline", color: "#AD8A8A",
    milestone: "4 portfolio projects with Loom demos live on GitHub",
    sections: [
      { id: "s14", title: "Portfolio Project 3 — Performance Dashboard", items: [
        { id: "n1", text: "Read Google Analytics 4 Data Export guide", url: "https://support.google.com/analytics/answer/9358801", mins: 30 },
        { id: "n2", text: "BUILD P3: Marketing Performance Dashboard", url: "https://github.com/", mins: 300, isBuild: true, isPortfolio: true },
        { id: "n3", text: "DEMO P3: Loom — document eliminated 3hrs weekly reporting", url: "https://www.loom.com/", mins: 30, isBuild: true },
        { id: "n4", text: "PUBLISH P3: GitHub README with metrics", url: "https://github.com/", mins: 45, isBuild: true },
      ]},
      { id: "s15", title: "Portfolio Project 4 — Lead Pipeline", items: [
        { id: "o1", text: "BUILD P4: Lead Pipeline — form to enrichment to scoring to outreach", url: "https://www.make.com/en/integrations/openai-gpt-3", mins: 300, isBuild: true, isPortfolio: true },
        { id: "o2", text: "DEMO P4: Loom — 2hrs to 10min per lead", url: "https://www.loom.com/", mins: 30, isBuild: true },
        { id: "o3", text: "PUBLISH P4: GitHub README with metrics", url: "https://github.com/", mins: 45, isBuild: true },
        { id: "o4", text: "Build portfolio site on Carrd.co (free) — link all 4 demos", url: "https://carrd.co/", mins: 60, isBuild: true },
      ]},
    ]
  },
  {
    id: "p6", title: "Phase 6", subtitle: "Pro-Bono Case Study",
    detail: "Real Client · Named Outcome · Testimonial", color: "#6B8F7A",
    milestone: "Real client case study published with named outcome",
    sections: [
      { id: "s16", title: "Land Pro-Bono Engagement", items: [
        { id: "p1x", text: "Identify 3 former contacts who would benefit from a tool you have already built", url: "https://www.linkedin.com/messaging/", mins: 30 },
        { id: "p2x", text: "Outreach: I built something to show you. 20 minutes? + Loom link", url: "https://www.linkedin.com/messaging/", mins: 30 },
        { id: "p3x", text: "Agree on scope: 1 tool, free, in exchange for written testimonial", mins: 30 },
      ]},
      { id: "s17", title: "Execute and Document", items: [
        { id: "q1", text: "BUILD: Implement the tool for the client", url: "https://github.com/", mins: 480, isBuild: true },
        { id: "q2", text: "Collect written testimonial — specific, quantified if possible", mins: 30 },
        { id: "q3", text: "Write case study: problem, solution, outcome, quote", mins: 90, isBuild: true },
        { id: "q4", text: "Add case study to portfolio site", url: "https://carrd.co/", mins: 30 },
        { id: "q5", text: "Post on LinkedIn: outcome-first", url: "https://www.linkedin.com/", mins: 30 },
      ]},
    ]
  },
  {
    id: "p7", title: "Phase 7", subtitle: "Active Job Search",
    detail: "Applications · Outreach · Interviews", color: "#B09A6B",
    milestone: "First offer or paid engagement at $110k+",
    sections: [
      { id: "s18", title: "Positioning Materials", items: [
        { id: "r1", text: "Update LinkedIn headline: Senior Marketing Manager · AI-Enhanced Marketing Ops", url: "https://www.linkedin.com/", mins: 60 },
        { id: "r2", text: "Update resume — marketing-first, AI as differentiator section", mins: 120 },
        { id: "r3", text: "Draft consulting one-pager: who you serve, problem, solution, proof, contact", mins: 90 },
        { id: "r4", text: "List on Contra (free, no fees)", url: "https://contra.com/", mins: 30 },
        { id: "r5", text: "Apply to Toptal — AI plus marketing profile", url: "https://www.toptal.com/talent/apply", mins: 45 },
      ]},
      { id: "s19", title: "Daily Job Search Rhythm", items: [
        { id: "t1", text: "Apply to 3 targeted roles per day — LinkedIn Jobs", url: "https://www.linkedin.com/jobs/search/?keywords=Senior+Marketing+Manager+AI", mins: 60 },
        { id: "t2", text: "Apply to 3 targeted roles per day — Indeed", url: "https://www.indeed.com/jobs?q=Senior+Marketing+Manager+AI", mins: 30 },
        { id: "t3", text: "Direct outreach to 5 hiring managers per day — value-first messages", url: "https://www.linkedin.com/messaging/", mins: 60 },
        { id: "t4", text: "Post on LinkedIn 2-3x per week — marketing outcomes, AI as the method", url: "https://www.linkedin.com/", mins: 45 },
        { id: "t5", text: "Read McKinsey State of AI — stay current for interviews", url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai", mins: 30 },
        { id: "t6", text: "Wellfound — apply to growth-stage brand roles", url: "https://wellfound.com/jobs?role=ai", mins: 30 },
        { id: "t7", text: "TARGET: First offer or paid engagement at $110k+", isMilestone: true },
      ]},
    ]
  },
];

function getAllItems() {
  return PHASES.flatMap(p => p.sections.flatMap(s => s.items));
}

function computeSchedule(completedSet) {
  const result = {};
  let cursor = new Date(START_DATE);
  for (const phase of PHASES) {
    const allIds = phase.sections.flatMap(s => s.items.map(i => i.id));
    const done = allIds.filter(id => completedSet.has(id)).length;
    const total = allIds.length;
    const remaining = total - done;
    const remDays = Math.max(1, Math.ceil(remaining / 3));
    const start = new Date(cursor);
    const end = addWorkDays(cursor, remDays);
    result[phase.id] = { start, end, pct: total > 0 ? done / total : 0, done, total };
    cursor = new Date(end);
    cursor.setDate(cursor.getDate() + 1);
  }
  return result;
}

const STORAGE_KEY = "aicareer_v6";
function loadSaved() {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    if (r) return JSON.parse(r);
  } catch(e) {}
  return { completed: [] };
}
function persist(c) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed: [...c] })); } catch(e) {}
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const T = {
  // typography
  label:   { fontSize: 9,  letterSpacing: "0.16em", textTransform: "uppercase", color: "#4A4A48" },
  caption: { fontSize: 10, letterSpacing: "0.1em",  color: "#4A4A48" },
  body:    { fontSize: 13, fontWeight: 300, lineHeight: 1.7, color: "#8A8A88" },
  // borders
  rule:    "1px solid #2A2A28",
  ruleFaint: "1px solid #1E1E1C",
};

export default function App() {
  const [completed, setCompleted] = useState(() => new Set(loadSaved().completed));
  const [schedule, setSchedule]   = useState(() => computeSchedule(new Set(loadSaved().completed)));
  const [showRecalc, setShowRecalc] = useState(false);
  const [view, setView]           = useState("dashboard");
  const [activePhase, setActivePhase] = useState(null);
  const [expanded, setExpanded]   = useState({});
  const [aiText, setAiText]       = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const total = getAllItems().length;
  const pct   = Math.round((completed.size / total) * 100);

  useEffect(() => persist(completed), [completed]);

  const toggle = useCallback((id) => {
    setCompleted(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
    setShowRecalc(true);
  }, []);

  const recalc = useCallback(() => {
    setSchedule(computeSchedule(completed));
    setShowRecalc(false);
  }, [completed]);

  const optimize = useCallback(async () => {
    setAiLoading(true);
    const doneItems = getAllItems().filter(i => completed.has(i.id)).map(i => i.text);
    const nextItems = getAllItems().filter(i => !completed.has(i.id)).slice(0, 10).map(i => i.text);
    const prompt = "You are a direct career coach. Person: Senior Marketing Manager (9 yrs, adidas Terrex), targeting AI-Enhanced Marketing Ops positioning for $110k+ roles at Nike/Hoka/Adidas and AI-forward companies. Currently unemployed, 4hrs/day Mon-Thu plus flex Fri-Sun.\n\nProgress: " + pct + "% (" + completed.size + "/" + total + " items done)\nRecently completed: " + (doneItems.slice(-6).join(", ") || "none yet") + "\nNext up: " + nextItems.join(", ") + "\n\nGive a 2-3 sentence honest assessment of momentum and ONE specific priority for this week. Be direct. Reference specific items by name.";
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      setAiText(data.insight || "Could not generate insight.");
    } catch(e) {
      setAiText("Connection error — try again.");
    }
    setAiLoading(false);
  }, [completed, pct, total]);

  const todayFocus = (() => {
    for (const phase of PHASES) {
      for (const section of phase.sections) {
        const inc = section.items.filter(i => !completed.has(i.id));
        if (inc.length > 0) return { phase, section, items: inc.slice(0, 5) };
      }
    }
    return null;
  })();

  const activePhaseFull = PHASES.find(p => schedule[p.id] && schedule[p.id].pct < 1) || PHASES[PHASES.length - 1];

  const toggleSection = (key) => setExpanded(prev => ({ ...prev, [key]: prev[key] === false ? true : false }));
  const isSectionExpanded = (key) => expanded[key] !== false;

  const NAV_ITEMS = [
    { id: "dashboard",  label: "Dashboard" },
    { id: "curriculum", label: "Curriculum" },
    { id: "workout",    label: "Workout" },
  ];

  // Item row — no emojis, clean text
  const ItemRow = ({ item, phaseColor }) => {
    const done = completed.has(item.id);
    return (
      <div
        onClick={() => toggle(item.id)}
        style={{
          display: "flex", alignItems: "flex-start", gap: 14,
          padding: "13px 0",
          borderBottom: T.ruleFaint,
          cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {/* Checkbox */}
        <div style={{
          width: 16, height: 16, flexShrink: 0, marginTop: 2,
          border: `1px solid ${done ? phaseColor : "#2A2A28"}`,
          background: done ? phaseColor : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.12s",
        }}>
          {done && (
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 5l2.5 2.5L8.5 2" stroke="#111110" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Tags */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: done ? 0 : 4 }}>
            {item.isMilestone && (
              <span style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C4A882", borderBottom: "1px solid #C4A882", paddingBottom: 1 }}>
                Milestone
              </span>
            )}
            {item.isPortfolio && (
              <span style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8A9BAD", borderBottom: "1px solid #8A9BAD", paddingBottom: 1 }}>
                Portfolio
              </span>
            )}
            {!item.isMilestone && item.isBuild && (
              <span style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7A9B72", borderBottom: "1px solid #7A9B72", paddingBottom: 1 }}>
                Build
              </span>
            )}
          </div>

          <div style={{
            fontSize: 13, lineHeight: 1.55, fontWeight: 300,
            color: done ? "#3A3A38" : "#C8C5BE",
            textDecoration: done ? "line-through" : "none",
            transition: "color 0.12s",
          }}>
            {item.text}
          </div>

          {item.mins > 0 && (
            <div style={{ fontSize: 10, color: "#3A3A38", marginTop: 3, letterSpacing: "0.06em" }}>
              {item.mins >= 60 ? `${Math.floor(item.mins/60)}h${item.mins%60 ? ` ${item.mins%60}m` : ""}` : `${item.mins}m`}
            </div>
          )}
        </div>

        {item.url && (
          <a href={item.url} target="_blank" rel="noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ fontSize: 10, color: "#3A3A38", flexShrink: 0, marginTop: 3, textDecoration: "none", padding: "4px 0" }}>
            <svg width="10" height="10" viewBox="0 0 11 11" fill="none">
              <path d="M1 10L10 1M10 1H3M10 1v7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        )}
      </div>
    );
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#111110",
      color: "#F0EDE6",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontSize: 14,
      overflowX: "hidden",
      maxWidth: "100vw",
      paddingBottom: "calc(60px + env(safe-area-inset-bottom, 0px))",
    }}>
      <style>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        button { cursor: pointer; background: none; border: none; outline: none; font-family: inherit; }
        button:active { opacity: 0.7; }
        a { -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(17,17,16,0.96)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: T.rule,
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}>
        <div style={{
          maxWidth: 680, margin: "0 auto",
          padding: "14px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ fontSize: 13, fontWeight: 400, letterSpacing: "0.08em", color: "#F0EDE6" }}>
            BRIAN.OS
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 10, color: "#4A4A48", letterSpacing: "0.08em", fontVariantNumeric: "tabular-nums" }}>
              {pct}%
            </div>
            <div style={{ width: 48, height: 1, background: "#2A2A28", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${pct}%`, background: "#F0EDE6", transition: "width 0.5s ease" }}/>
            </div>
          </div>
        </div>

        {/* Recalc banner */}
        {showRecalc && (
          <div style={{
            borderTop: T.rule,
            padding: "10px 24px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            maxWidth: "100%",
          }}>
            <span style={{ fontSize: 11, color: "#6B6860", letterSpacing: "0.06em" }}>Progress updated</span>
            <button onClick={recalc} style={{
              fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#F0EDE6", borderBottom: "1px solid #F0EDE6", paddingBottom: 1,
            }}>
              Recalculate
            </button>
          </div>
        )}
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px" }}>

        {/* ═══════════════ DASHBOARD ═══════════════ */}
        {view === "dashboard" && (
          <div style={{ paddingTop: 40 }}>

            {/* Hero */}
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 10, color: "#4A4A48", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </div>
              <div style={{
                fontSize: "clamp(52px, 12vw, 80px)",
                fontWeight: 300,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                color: "#F0EDE6",
                marginBottom: 6,
              }}>
                {pct}<span style={{ fontSize: "0.45em", color: "#4A4A48", fontWeight: 300 }}>%</span>
              </div>
              <div style={{ fontSize: 11, color: "#4A4A48", letterSpacing: "0.08em", marginBottom: 20 }}>
                {completed.size} of {total} tasks complete
              </div>
              <div style={{ height: 1, background: "#2A2A28" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: "#F0EDE6", transition: "width 0.6s ease" }}/>
              </div>
            </div>

            {/* Up next */}
            {todayFocus && (
              <div style={{ marginBottom: 48 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "#4A4A48" }}>
                    Up next
                  </div>
                  <button onClick={() => { setView("curriculum"); setActivePhase(todayFocus.phase.id); }}
                    style={{ fontSize: 10, color: "#4A4A48", letterSpacing: "0.1em", borderBottom: "1px solid #2A2A28", paddingBottom: 1 }}>
                    See all
                  </button>
                </div>
                <div style={{ borderTop: T.rule }}>
                  <div style={{ padding: "14px 0 12px", borderBottom: T.rule }}>
                    <div style={{ fontSize: 13, color: "#F0EDE6", fontWeight: 400, marginBottom: 3 }}>
                      {todayFocus.section.title}
                    </div>
                    <div style={{ fontSize: 10, color: "#4A4A48", letterSpacing: "0.08em" }}>
                      {todayFocus.phase.title}
                    </div>
                  </div>
                  {todayFocus.items.map(item => (
                    <ItemRow key={item.id} item={item} phaseColor={todayFocus.phase.color} />
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "#4A4A48", marginBottom: 16 }}>
                Timeline
              </div>
              <div style={{ borderTop: T.rule }}>
                {PHASES.map((phase) => {
                  const s = schedule[phase.id];
                  if (!s) return null;
                  const done   = s.pct >= 1;
                  const active = !done && activePhaseFull.id === phase.id;
                  return (
                    <div key={phase.id}
                      onClick={() => { setView("curriculum"); setActivePhase(phase.id); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 16,
                        padding: "14px 0",
                        borderBottom: T.ruleFaint,
                        cursor: "pointer",
                      }}>
                      {/* Progress line */}
                      <div style={{ width: 2, height: 32, background: "#1E1E1C", flexShrink: 0, position: "relative" }}>
                        <div style={{
                          position: "absolute", top: 0, left: 0, width: "100%",
                          height: `${s.pct * 100}%`,
                          background: done ? "#7A9B72" : active ? phase.color : "#2A2A28",
                          transition: "height 0.4s",
                        }}/>
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                          <span style={{
                            fontSize: 13, fontWeight: 300,
                            color: done ? "#3A3A38" : active ? "#F0EDE6" : "#6B6860",
                          }}>
                            {phase.subtitle}
                          </span>
                          <span style={{ fontSize: 10, color: done ? "#7A9B72" : "#4A4A48", letterSpacing: "0.06em", flexShrink: 0 }}>
                            {done ? "Done" : fmt(s.end)}
                          </span>
                        </div>
                        <div style={{ height: 1, background: "#1E1E1C" }}>
                          <div style={{
                            height: "100%", width: `${s.pct * 100}%`,
                            background: done ? "#7A9B72" : phase.color,
                            transition: "width 0.4s",
                          }}/>
                        </div>
                      </div>

                      <div style={{ fontSize: 10, color: "#3A3A38", letterSpacing: "0.08em", minWidth: 28, textAlign: "right" }}>
                        {Math.round(s.pct * 100)}%
                      </div>
                    </div>
                  );
                })}

                {/* Projected offer */}
                <div style={{ padding: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 10, color: "#4A4A48", letterSpacing: "0.08em" }}>Projected first offer</span>
                  <span style={{ fontSize: 14, fontWeight: 300, color: "#F0EDE6", letterSpacing: "-0.01em" }}>
                    {schedule["p7"] ? fmt(schedule["p7"].end) : "TBD"}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Coach */}
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "#4A4A48", marginBottom: 16 }}>
                AI Coach
              </div>
              <div style={{ borderTop: T.rule, paddingTop: 20 }}>
                {aiText && (
                  <div style={{
                    fontSize: 13, color: "#8A8A88", lineHeight: 1.8, fontWeight: 300,
                    marginBottom: 24, paddingBottom: 24, borderBottom: T.ruleFaint,
                  }}>
                    {aiText}
                  </div>
                )}
                <button onClick={optimize} disabled={aiLoading} style={{
                  width: "100%", padding: "18px",
                  border: `1px solid ${aiLoading ? "#2A2A28" : "#F0EDE6"}`,
                  color: aiLoading ? "#3A3A38" : "#F0EDE6",
                  fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  transition: "all 0.2s",
                  cursor: aiLoading ? "not-allowed" : "pointer",
                }}>
                  {aiLoading ? (
                    <span style={{ animation: "dash-pulse 1.2s ease-in-out infinite", letterSpacing: "0.16em" }}>
                      Analyzing…
                    </span>
                  ) : (
                    "Get this week's priority"
                  )}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ═══════════════ CURRICULUM ═══════════════ */}
        {view === "curriculum" && (
          <div style={{ paddingTop: 40 }}>
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "#4A4A48", marginBottom: 12 }}>
                AI Career Curriculum
              </div>
              <div style={{ fontSize: "clamp(28px, 6vw, 42px)", fontWeight: 300, letterSpacing: "-0.03em", color: "#F0EDE6", lineHeight: 1.05 }}>
                7 Phases
              </div>
            </div>

            {/* Phase filter — text pills, no background */}
            <div style={{
              display: "flex", gap: 0,
              overflowX: "auto", marginBottom: 32,
              borderBottom: T.rule,
              scrollbarWidth: "none", msOverflowStyle: "none",
            }}>
              <button onClick={() => setActivePhase(null)} style={{
                padding: "10px 16px 12px",
                fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
                color: !activePhase ? "#F0EDE6" : "#3A3A38",
                borderBottom: !activePhase ? "1px solid #F0EDE6" : "1px solid transparent",
                marginBottom: -1, whiteSpace: "nowrap", flexShrink: 0,
                transition: "color 0.15s",
              }}>All</button>
              {PHASES.map(phase => {
                const s = schedule[phase.id];
                const act = activePhase === phase.id;
                return (
                  <button key={phase.id} onClick={() => setActivePhase(act ? null : phase.id)} style={{
                    padding: "10px 14px 12px",
                    fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
                    color: act ? phase.color : "#3A3A38",
                    borderBottom: act ? `1px solid ${phase.color}` : "1px solid transparent",
                    marginBottom: -1, whiteSpace: "nowrap", flexShrink: 0,
                    transition: "color 0.15s",
                  }}>
                    {phase.title}
                  </button>
                );
              })}
            </div>

            {PHASES.filter(p => !activePhase || p.id === activePhase).map(phase => {
              const s = schedule[phase.id];
              return (
                <div key={phase.id} style={{ marginBottom: 48 }}>
                  {/* Phase header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "#4A4A48", marginBottom: 8 }}>
                        {phase.title}
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 300, letterSpacing: "-0.02em", color: "#F0EDE6" }}>
                        {phase.subtitle}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{
                        fontSize: 28, fontWeight: 300, letterSpacing: "-0.03em",
                        color: s && s.pct >= 1 ? "#7A9B72" : phase.color,
                      }}>
                        {s ? Math.round(s.pct * 100) : 0}%
                      </div>
                      <div style={{ fontSize: 10, color: "#4A4A48", letterSpacing: "0.06em" }}>
                        {s ? s.done : 0}/{s ? s.total : 0}
                      </div>
                    </div>
                  </div>

                  {/* Milestone */}
                  <div style={{
                    borderLeft: `2px solid ${phase.color}`,
                    paddingLeft: 14, marginBottom: 20,
                    fontSize: 12, color: "#6B6860", fontWeight: 300, lineHeight: 1.6,
                  }}>
                    {phase.milestone}
                  </div>

                  {/* Sections */}
                  {phase.sections.map(section => {
                    const sc  = section.items.filter(i => completed.has(i.id)).length;
                    const key = `${phase.id}_${section.id}`;
                    const isExp = isSectionExpanded(key);
                    return (
                      <div key={section.id} style={{ borderTop: T.rule, marginBottom: 0 }}>
                        <div onClick={() => toggleSection(key)} style={{
                          padding: "14px 0",
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          cursor: "pointer",
                        }}>
                          <div>
                            <div style={{
                              fontSize: 13, fontWeight: 400,
                              color: sc === section.items.length ? "#4A4A48" : "#F0EDE6",
                              marginBottom: 3,
                            }}>
                              {section.title}
                            </div>
                            <div style={{ fontSize: 10, color: "#3A3A38", letterSpacing: "0.06em" }}>
                              {sc}/{section.items.length}
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 36, height: 1, background: "#1E1E1C" }}>
                              <div style={{
                                height: "100%",
                                width: `${(sc/section.items.length)*100}%`,
                                background: phase.color,
                                transition: "width 0.3s",
                              }}/>
                            </div>
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
                              style={{ transform: isExp ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", color: "#3A3A38" }}>
                              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                        {isExp && (
                          <div style={{ paddingBottom: 8 }}>
                            {section.items.map(item => (
                              <ItemRow key={item.id} item={item} phaseColor={phase.color} />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* ═══════════════ WORKOUT ═══════════════ */}
        {view === "workout" && (
          <div style={{ margin: "0 -24px" }}>
            <WorkoutTab />
          </div>
        )}

      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(17,17,16,0.96)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: T.rule,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        <div style={{
          maxWidth: 680, margin: "0 auto",
          display: "flex", alignItems: "center",
        }}>
          {NAV_ITEMS.map(item => {
            const active = view === item.id;
            return (
              <button key={item.id} onClick={() => setView(item.id)} style={{
                flex: 1,
                padding: "14px 0",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: active ? "#F0EDE6" : "#3A3A38",
                borderTop: active ? "1px solid #F0EDE6" : "1px solid transparent",
                marginTop: -1,
                transition: "color 0.15s, border-color 0.15s",
              }}>
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes dash-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  );
}
