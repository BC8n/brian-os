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

const PHASES = [
  {
    id: "p1", title: "Phase 1", subtitle: "Technical Foundation",
    detail: "Python · APIs · Prompt Engineering", color: "#0EA5E9", bg: "#0C1A2E",
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
        { id: "d5", text: "BUILD: Brand Voice Prompt System — AI writes in brand style across email, social, blog", url: "https://github.com/", mins: 90, isBuild: true, isPortfolio: true },
      ]},
    ]
  },
  {
    id: "p2", title: "Phase 2", subtitle: "Make Automation",
    detail: "No-Code Workflows · 5 Live Automations", color: "#8B5CF6", bg: "#130F28",
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
    detail: "Vector Databases · Knowledge Bases", color: "#10B981", bg: "#071F17",
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
        { id: "h2", text: "BUILD P1: AI Content Production System — brief in, SEO blog + 3 socials + email in brand voice", url: "https://github.com/", mins: 240, isBuild: true, isPortfolio: true },
        { id: "h3", text: "DEMO P1: Record 3-min Loom walkthrough", url: "https://www.loom.com/", mins: 30, isBuild: true },
        { id: "h4", text: "PUBLISH P1: GitHub README — 6hrs to 45min per asset", url: "https://github.com/", mins: 45, isBuild: true },
      ]},
      { id: "s9", title: "Portfolio Project 2 — Knowledge Base", items: [
        { id: "i1", text: "BUILD P2: AI Knowledge Base Assistant — upload docs, ask questions with citations", url: "https://python.langchain.com/docs/tutorials/rag/", mins: 240, isBuild: true, isPortfolio: true },
        { id: "i2", text: "DEMO P2: Record 3-min Loom walkthrough", url: "https://www.loom.com/", mins: 30, isBuild: true },
        { id: "i3", text: "PUBLISH P2: GitHub README with business case", url: "https://github.com/", mins: 45, isBuild: true },
      ]},
    ]
  },
  {
    id: "p4", title: "Phase 4", subtitle: "Certifications",
    detail: "Azure AI-900 · Google Cloud · HubSpot", color: "#F59E0B", bg: "#1C1408",
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
        { id: "l1", text: "Emory — What Can AI Do for Marketing? (click Audit for free access)", url: "https://www.coursera.org/learn/whatcanaidoformarketing", mins: 180 },
        { id: "l2", text: "Practical AI and Prompting for Marketing Professionals (audit free)", url: "https://www.coursera.org/learn/practical-ai-and-prompting-for-marketing-professionals", mins: 180 },
      ]},
      { id: "s13", title: "Azure AI-900 — $165 exam fee", items: [
        { id: "m1", text: "Microsoft Learn — AI-900 Full Prep Path (FREE study)", url: "https://learn.microsoft.com/en-us/training/paths/get-started-with-artificial-intelligence-on-azure/", mins: 300 },
        { id: "m2", text: "Microsoft Learn — NLP Module", url: "https://learn.microsoft.com/en-us/training/paths/explore-natural-language-processing/", mins: 120 },
        { id: "m3", text: "Microsoft Learn — Generative AI on Azure", url: "https://learn.microsoft.com/en-us/training/paths/introduction-generative-ai/", mins: 120 },
        { id: "m4", text: "Azure AI-900 Practice Assessment — target 85pct before booking", url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/practice/assessment?assessment-type=practice&assessmentId=26", mins: 60 },
        { id: "m5", text: "Book Azure AI-900 exam at Pearson VUE ($165)", url: "https://home.pearsonvue.com/microsoft", mins: 15 },
        { id: "m6", text: "PASS: Azure AI-900 Exam", url: "https://home.pearsonvue.com/microsoft", mins: 0, isMilestone: true },
        { id: "m7", text: "Add Azure AI-900 to LinkedIn and resume", url: "https://www.linkedin.com/", mins: 15 },
      ]},
    ]
  },
  {
    id: "p5", title: "Phase 5", subtitle: "Portfolio 3 + 4",
    detail: "Marketing Intelligence · Lead Pipeline", color: "#EC4899", bg: "#1C0A14",
    milestone: "4 portfolio projects with Loom demos live on GitHub",
    sections: [
      { id: "s14", title: "Portfolio Project 3 — Performance Dashboard", items: [
        { id: "n1", text: "Read Google Analytics 4 Data Export guide", url: "https://support.google.com/analytics/answer/9358801", mins: 30 },
        { id: "n2", text: "BUILD P3: Marketing Performance Dashboard — GA4/CSV to LLM plain-English weekly insights", url: "https://github.com/", mins: 300, isBuild: true, isPortfolio: true },
        { id: "n3", text: "DEMO P3: Loom — document eliminated 3hrs weekly reporting", url: "https://www.loom.com/", mins: 30, isBuild: true },
        { id: "n4", text: "PUBLISH P3: GitHub README with metrics", url: "https://github.com/", mins: 45, isBuild: true },
      ]},
      { id: "s15", title: "Portfolio Project 4 — Lead Pipeline", items: [
        { id: "o1", text: "BUILD P4: Lead Pipeline — form to OpenAI enrichment to scoring to outreach draft to Airtable", url: "https://www.make.com/en/integrations/openai-gpt-3", mins: 300, isBuild: true, isPortfolio: true },
        { id: "o2", text: "DEMO P4: Loom — 2hrs to 10min per lead", url: "https://www.loom.com/", mins: 30, isBuild: true },
        { id: "o3", text: "PUBLISH P4: GitHub README with metrics", url: "https://github.com/", mins: 45, isBuild: true },
        { id: "o4", text: "Build portfolio site on Carrd.co (free) — link all 4 demos", url: "https://carrd.co/", mins: 60, isBuild: true },
      ]},
    ]
  },
  {
    id: "p6", title: "Phase 6", subtitle: "Pro-Bono Case Study",
    detail: "Real Client · Named Outcome · Testimonial", color: "#14B8A6", bg: "#071A18",
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
        { id: "q5", text: "Post on LinkedIn: outcome-first, not I am available for consulting", url: "https://www.linkedin.com/", mins: 30 },
      ]},
    ]
  },
  {
    id: "p7", title: "Phase 7", subtitle: "Active Job Search",
    detail: "Applications · Outreach · Interviews", color: "#F97316", bg: "#1C0E04",
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

export default function App() {
  const [completed, setCompleted] = useState(() => new Set(loadSaved().completed));
  const [schedule, setSchedule] = useState(() => computeSchedule(new Set(loadSaved().completed)));
  const [showRecalc, setShowRecalc] = useState(false);
  const [view, setView] = useState("dashboard");
  const [activePhase, setActivePhase] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [aiText, setAiText] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const total = getAllItems().length;
  const pct = Math.round((completed.size / total) * 100);

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

  const toggleSection = (key) => {
    setExpanded(prev => ({ ...prev, [key]: prev[key] === false ? true : false }));
  };

  const isSectionExpanded = (key) => expanded[key] !== false;

  const C = {
    bg: "#080C14", card: "#0D1117", border: "#1A2535", muted: "#4A5568",
    text: "#CBD5E0", bright: "#E2E8F0", dim: "#2D3748"
  };

  const ItemRow = ({ item, phaseColor }) => {
    const done = completed.has(item.id);
    const [hover, setHover] = useState(false);
    return (
      <div
        onClick={() => toggle(item.id)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "flex", alignItems: "flex-start", gap: 10,
          padding: "8px 10px", borderRadius: 7, marginBottom: 2,
          cursor: "pointer", background: hover ? "rgba(255,255,255,0.04)" : "transparent",
          transition: "background 0.1s"
        }}
      >
        <div style={{
          width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 2,
          border: "2px solid " + (done ? phaseColor : C.dim),
          background: done ? phaseColor : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s"
        }}>
          {done && <span style={{ color: "#000", fontSize: 9, fontWeight: 900, lineHeight: 1 }}>✓</span>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 12, lineHeight: 1.5,
            color: done ? C.muted : C.text,
            textDecoration: done ? "line-through" : "none"
          }}>
            {item.isMilestone && (
              <span style={{ fontSize: 9, fontWeight: 700, color: "#F59E0B", background: "#F59E0B22", padding: "1px 5px", borderRadius: 3, marginRight: 5 }}>MILESTONE</span>
            )}
            {item.isPortfolio && (
              <span style={{ fontSize: 9, fontWeight: 700, color: "#EC4899", background: "#EC489922", padding: "1px 5px", borderRadius: 3, marginRight: 5 }}>PORTFOLIO</span>
            )}
            {!item.isMilestone && item.isBuild && (
              <span style={{ fontSize: 9, fontWeight: 700, color: "#8B5CF6", background: "#8B5CF622", padding: "1px 5px", borderRadius: 3, marginRight: 5 }}>BUILD</span>
            )}
            {item.text}
          </div>
          {item.mins > 0 && (
            <div style={{ fontSize: 10, color: C.dim, marginTop: 1 }}>
              {"~" + (item.mins >= 60 ? Math.floor(item.mins / 60) + "h" + (item.mins % 60 ? " " + (item.mins % 60) + "m" : "") : item.mins + "m")}
            </div>
          )}
        </div>
        {item.url && (
          <a
            href={item.url} target="_blank" rel="noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              fontSize: 10, color: "#2D3F57", padding: "2px 8px",
              border: "1px solid " + C.border, borderRadius: 4,
              whiteSpace: "nowrap", flexShrink: 0, marginTop: 1
            }}
          >
            OPEN →
          </a>
        )}
      </div>
    );
  };

  return (
     <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Mono', 'Fira Code', Consolas, monospace", fontSize: 13, overflowX: "hidden", maxWidth: "100vw" }}>

      <div style={{
        borderBottom: "1px solid " + C.border, padding: "12px 14px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#090D15", position: "sticky", top: 0, zIndex: 100,
        overflowX: "hidden"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#fff", letterSpacing: "-0.5px" }}>BRIAN.OS</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#111827", border: "1px solid " + C.border, borderRadius: 20, padding: "3px 10px" }}>
            <div style={{ width: 40, height: 3, background: C.border, borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: pct + "%", height: "100%", background: "linear-gradient(90deg,#0EA5E9,#8B5CF6)", transition: "width 0.5s" }} />
            </div>
            <span style={{ fontSize: 10, color: "#94A3B8" }}>{pct}%</span>
          </div>
          {["dashboard", "curriculum", "workout"].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                background: view === v ? C.border : "transparent",
                border: "1px solid " + (view === v ? "#2D3F57" : C.border),
                color: view === v ? C.bright : C.muted,
                borderRadius: 6, padding: "4px 8px", fontSize: 9,
                cursor: "pointer", fontFamily: "inherit",
                letterSpacing: "0.5px", textTransform: "uppercase"
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* RECALC BANNER */}
      {showRecalc && (
        <div style={{
          background: "#0A1628", borderBottom: "1px solid #0EA5E9",
          padding: "8px 18px", display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <span style={{ fontSize: 11, color: "#0EA5E9" }}>● Progress updated — recalculate your timeline</span>
          <button
            onClick={recalc}
            style={{
              background: "#0EA5E9", color: "#000", border: "none",
              borderRadius: 5, padding: "4px 14px", fontSize: 11, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit"
            }}
          >
            RECALCULATE →
          </button>
        </div>
      )}

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "18px 16px" }}>

        {/* DASHBOARD VIEW */}
        {view === "dashboard" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>

              {/* Today's Focus */}
              <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 10, padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 9, color: C.muted, letterSpacing: "2px", marginBottom: 3 }}>TODAY'S FOCUS</div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>
                      {todayFocus ? todayFocus.section.title : "All done!"}
                    </div>
                  </div>
                  {todayFocus && (
                    <div style={{ background: "#111827", border: "1px solid " + C.border, borderRadius: 6, padding: "4px 10px", textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: C.muted }}>PHASE</div>
                      <div style={{ fontSize: 11, color: todayFocus.phase.color, fontWeight: 600 }}>{todayFocus.phase.title}</div>
                    </div>
                  )}
                </div>
                {todayFocus ? (
                  <div>
                    {todayFocus.items.map(item => (
                      <ItemRow key={item.id} item={item} phaseColor={todayFocus.phase.color} />
                    ))}
                    <button
                      onClick={() => { setView("curriculum"); setActivePhase(todayFocus.phase.id); }}
                      style={{
                        background: "transparent", border: "1px dashed " + C.border,
                        borderRadius: 7, padding: "6px 12px", color: C.muted,
                        fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                        marginTop: 8, width: "100%"
                      }}
                    >
                      View all {todayFocus.phase.title} tasks →
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "32px 0", color: C.muted }}>All complete. Ready for interviews.</div>
                )}
              </div>

              {/* Phase Timeline */}
              <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 10, padding: 18 }}>
                <div style={{ fontSize: 9, color: C.muted, letterSpacing: "2px", marginBottom: 14 }}>PHASE TIMELINE</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {PHASES.map(phase => {
                    const s = schedule[phase.id];
                    if (!s) return null;
                    const done = s.pct >= 1;
                    const active = !done && activePhaseFull.id === phase.id;
                    return (
                      <div
                        key={phase.id}
                        onClick={() => { setView("curriculum"); setActivePhase(phase.id); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "7px 10px", borderRadius: 7, cursor: "pointer",
                          border: "1px solid " + (active ? phase.color + "40" : "#151F2E"),
                          background: active ? phase.color + "08" : "transparent"
                        }}
                      >
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: done ? "#22C55E" : active ? phase.color : C.border, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: done ? C.muted : active ? C.bright : "#6B7280" }}>{phase.title}</span>
                            <span style={{ fontSize: 10, color: C.muted }}>{phase.subtitle}</span>
                          </div>
                          <div style={{ marginTop: 3, height: 2, background: C.border, borderRadius: 1, overflow: "hidden" }}>
                            <div style={{ width: (s.pct * 100) + "%", height: "100%", background: done ? "#22C55E" : phase.color, transition: "width 0.4s" }} />
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 10, color: done ? "#22C55E" : C.muted }}>{done ? "DONE ✓" : fmt(s.end)}</div>
                          <div style={{ fontSize: 9, color: C.dim }}>{s.done}/{s.total}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 12, padding: "10px 12px", background: "#0A0F18", border: "1px solid " + C.border, borderRadius: 7 }}>
                  <div style={{ fontSize: 9, color: C.muted, marginBottom: 3 }}>PROJECTED FIRST OFFER</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#F97316" }}>
                    {schedule["p7"] ? fmt(schedule["p7"].end) : "TBD"}
                  </div>
                  <div style={{ fontSize: 9, color: C.dim, marginTop: 2 }}>Updates when you hit Recalculate</div>
                </div>
              </div>
            </div>

            {/* AI Optimize */}
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 10, padding: 18, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: aiText ? 12 : 0 }}>
                <div>
                  <div style={{ fontSize: 9, color: C.muted, letterSpacing: "2px", marginBottom: 3 }}>AI PLAN OPTIMIZATION</div>
                  <div style={{ fontSize: 12, color: "#94A3B8" }}>Progress assessment + one specific priority for this week</div>
                </div>
                <button
                  onClick={optimize}
                  disabled={aiLoading}
                  style={{
                    background: aiLoading ? C.border : "linear-gradient(135deg,#0EA5E9,#8B5CF6)",
                    border: "none", borderRadius: 7, padding: "8px 16px",
                    color: "#fff", fontSize: 11, fontWeight: 700,
                    cursor: aiLoading ? "not-allowed" : "pointer",
                    fontFamily: "inherit", minWidth: 120
                  }}
                >
                  {aiLoading ? "ANALYZING..." : "OPTIMIZE →"}
                </button>
              </div>
              {aiText && (
                <div style={{ padding: 14, background: "#0A0F18", borderRadius: 7, border: "1px solid " + C.border, fontSize: 12, color: C.text, lineHeight: 1.8 }}>
                  {aiText}
                </div>
              )}
            </div>

            {/* Phase Cards */}
            <div style={{ fontSize: 9, color: C.muted, letterSpacing: "2px", marginBottom: 10 }}>ALL PHASES</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
              {PHASES.map(phase => {
                const s = schedule[phase.id];
                if (!s) return null;
                const done = s.pct >= 1;
                return (
                  <div
                    key={phase.id}
                    onClick={() => { setView("curriculum"); setActivePhase(phase.id); }}
                    style={{
                      background: phase.bg, border: "1px solid " + phase.color + "20",
                      borderRadius: 9, padding: 14, cursor: "pointer",
                      position: "relative", overflow: "hidden",
                      transition: "transform 0.15s"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: done ? "#22C55E" : "linear-gradient(90deg," + phase.color + ",transparent)" }} />
                    <div style={{ fontSize: 9, color: phase.color, letterSpacing: "1px", marginBottom: 4 }}>{phase.title}</div>
                    <div style={{ fontWeight: 700, fontSize: 12, color: "#fff", marginBottom: 2 }}>{phase.subtitle}</div>
                    <div style={{ fontSize: 10, color: C.muted, marginBottom: 10 }}>{phase.detail}</div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 10, color: C.muted }}>{s.done}/{s.total}</span>
                      <span style={{ fontSize: 10, color: done ? "#22C55E" : phase.color }}>{done ? "DONE ✓" : fmt(s.end)}</span>
                    </div>
                    <div style={{ marginTop: 6, height: 2, background: C.border, borderRadius: 1, overflow: "hidden" }}>
                      <div style={{ width: (s.pct * 100) + "%", height: "100%", background: done ? "#22C55E" : phase.color, transition: "width 0.4s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* WORKOUT VIEW */}
        {view === "workout" && (
          <div style={{ margin: "-18px -16px" }}>
            <WorkoutTab />
          </div>
        )}

        {/* CURRICULUM VIEW */}
        {view === "curriculum" && (
          <div>
            <div style={{ display: "flex", gap: 7, marginBottom: 16, flexWrap: "wrap" }}>
              {PHASES.map(phase => {
                const s = schedule[phase.id];
                const act = activePhase === phase.id;
                return (
                  <button
                    key={phase.id}
                    onClick={() => setActivePhase(act ? null : phase.id)}
                    style={{
                      background: act ? phase.color + "20" : C.card,
                      border: "1px solid " + (act ? phase.color + "60" : C.border),
                      color: act ? "#fff" : "#6B7280",
                      borderRadius: 7, padding: "5px 12px", fontSize: 11,
                      cursor: "pointer", fontFamily: "inherit",
                      display: "flex", alignItems: "center", gap: 6,
                      transition: "all 0.15s"
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: s && s.pct >= 1 ? "#22C55E" : phase.color }} />
                    <span style={{ fontWeight: 700 }}>{phase.title}</span>
                    <span style={{ fontSize: 9, color: C.muted }}>{s ? Math.round(s.pct * 100) : 0}%</span>
                  </button>
                );
              })}
            </div>

            {PHASES.filter(p => !activePhase || p.id === activePhase).map(phase => {
              const s = schedule[phase.id];
              return (
                <div key={phase.id} style={{ marginBottom: 22, background: C.card, border: "1px solid " + phase.color + "25", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ padding: "15px 18px", background: phase.bg, borderBottom: "1px solid " + phase.color + "25", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 9, color: phase.color, letterSpacing: "2px", marginBottom: 4 }}>
                        {phase.title + " · " + (s ? fmt(s.start) + " – " + fmt(s.end) : "")}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: 17, color: "#fff" }}>{phase.subtitle}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{phase.detail}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: phase.color }}>{s ? Math.round(s.pct * 100) : 0}%</div>
                      <div style={{ fontSize: 10, color: C.muted }}>{s ? s.done : 0}/{s ? s.total : 0} items</div>
                      <div style={{ marginTop: 4, padding: "2px 8px", background: phase.color + "15", borderRadius: 4, fontSize: 9, color: phase.color }}>
                        {"✓ " + phase.milestone}
                      </div>
                    </div>
                  </div>
                  {phase.sections.map(section => {
                    const sc = section.items.filter(i => completed.has(i.id)).length;
                    const key = phase.id + "_" + section.id;
                    const isExp = isSectionExpanded(key);
                    return (
                      <div key={section.id} style={{ borderBottom: "1px solid #0F1923" }}>
                        <div
                          onClick={() => toggleSection(key)}
                          style={{ padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", userSelect: "none" }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: sc === section.items.length ? "#22C55E" : C.bright }}>{section.title}</span>
                            <span style={{ fontSize: 9, color: C.muted }}>{sc}/{section.items.length}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 44, height: 2, background: C.border, borderRadius: 1, overflow: "hidden" }}>
                              <div style={{ width: ((sc / section.items.length) * 100) + "%", height: "100%", background: phase.color }} />
                            </div>
                            <span style={{ fontSize: 10, color: C.dim }}>{isExp ? "▲" : "▼"}</span>
                          </div>
                        </div>
                        {isExp && (
                          <div style={{ padding: "0 18px 12px" }}>
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
      </div>
    </div>
  );
}