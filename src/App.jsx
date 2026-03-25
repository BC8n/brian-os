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

  const toggleSection = (key) => setExpanded(prev => ({ ...prev, [key]: prev[key] === false ? true : false }));
  const isSectionExpanded = (key) => expanded[key] !== false;

  const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard", icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="8" height="8" rx="2" fill={active ? "#1a1a1a" : "none"} stroke={active ? "#1a1a1a" : "#8a8a8e"} strokeWidth="1.5"/>
        <rect x="13" y="3" width="8" height="8" rx="2" fill={active ? "#1a1a1a" : "none"} stroke={active ? "#1a1a1a" : "#8a8a8e"} strokeWidth="1.5"/>
        <rect x="3" y="13" width="8" height="8" rx="2" fill={active ? "#1a1a1a" : "none"} stroke={active ? "#1a1a1a" : "#8a8a8e"} strokeWidth="1.5"/>
        <rect x="13" y="13" width="8" height="8" rx="2" fill={active ? "#1a1a1a" : "none"} stroke={active ? "#1a1a1a" : "#8a8a8e"} strokeWidth="1.5"/>
      </svg>
    )},
    { id: "curriculum", label: "Curriculum", icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke={active ? "#1a1a1a" : "#8a8a8e"} strokeWidth="1.5" strokeLinejoin="round" fill={active ? "#1a1a1a" : "none"}/>
        <path d="M2 17l10 5 10-5" stroke={active ? "#1a1a1a" : "#8a8a8e"} strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M2 12l10 5 10-5" stroke={active ? "#1a1a1a" : "#8a8a8e"} strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    )},
    { id: "workout", label: "Workout", icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M6.5 6.5h11M6.5 12h11M6.5 17.5h11" stroke={active ? "#1a1a1a" : "#8a8a8e"} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="3.5" cy="6.5" r="1" fill={active ? "#1a1a1a" : "#8a8a8e"}/>
        <circle cx="3.5" cy="12" r="1" fill={active ? "#1a1a1a" : "#8a8a8e"}/>
        <circle cx="3.5" cy="17.5" r="1" fill={active ? "#1a1a1a" : "#8a8a8e"}/>
      </svg>
    )},
  ];

  const ItemRow = ({ item, phaseColor }) => {
    const done = completed.has(item.id);
    return (
      <div
        onClick={() => toggle(item.id)}
        style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          padding: "11px 0", borderBottom: "1px solid #f0f0f0",
          cursor: "pointer", WebkitTapHighlightColor: "transparent",
        }}
      >
        <div style={{
          width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 1,
          border: `1.5px solid ${done ? phaseColor : "#d0d0d5"}`,
          background: done ? phaseColor : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
        }}>
          {done && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.5 2.5L8 3" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 3 }}>
            {item.isMilestone && <span style={{ fontSize: 9, fontWeight: 500, color: "#8B6E5A", background: "#EDE9E4", padding: "1px 6px", borderRadius: 10, letterSpacing: "0.06em" }}>MILESTONE</span>}
            {item.isPortfolio && <span style={{ fontSize: 9, fontWeight: 500, color: "#4E6070", background: "#E4E8EC", padding: "1px 6px", borderRadius: 10, letterSpacing: "0.06em" }}>PORTFOLIO</span>}
            {!item.isMilestone && item.isBuild && <span style={{ fontSize: 9, fontWeight: 500, color: "#5A7054", background: "#E8EDE6", padding: "1px 6px", borderRadius: 10, letterSpacing: "0.06em" }}>BUILD</span>}
          </div>
          <div style={{
            fontSize: 14, lineHeight: 1.45, color: done ? "#b0b0b5" : "#1a1a1a",
            textDecoration: done ? "line-through" : "none", transition: "color 0.15s",
          }}>{item.text}</div>
          {item.mins > 0 && (
            <div style={{ fontSize: 12, color: "#aeaeb2", marginTop: 3 }}>
              {item.mins >= 60 ? `${Math.floor(item.mins/60)}h${item.mins%60 ? ` ${item.mins%60}m` : ""}` : `${item.mins}m`}
            </div>
          )}
        </div>
        {item.url && (
          <a href={item.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
            style={{ fontSize: 12, color: "#aeaeb2", flexShrink: 0, marginTop: 2, textDecoration: "none", padding: "4px 0" }}>
            ↗
          </a>
        )}
      </div>
    );
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F5F4F0",
      color: "#1A1A18",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontSize: 14,
      overflowX: "hidden",
      maxWidth: "100vw",
      paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))",
    }}>

      {/* ── TOP BAR ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(245,244,240,0.94)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}>
        <div style={{
          maxWidth: 680, margin: "0 auto",
          padding: "14px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.4px", color: "#1a1a1a" }}>
            Brian.OS
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 12, color: "#aeaeb2", fontVariantNumeric: "tabular-nums" }}>{pct}%</div>
            <div style={{ width: 60, height: 3, background: "#E2E0DB", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: "#1a1a1a", borderRadius: 2, transition: "width 0.5s ease" }}/>
            </div>
          </div>
        </div>

        {/* Recalc banner */}
        {showRecalc && (
          <div style={{
            background: "#fff9ed", borderTop: "1px solid #fde68a",
            padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
            maxWidth: "100%",
          }}>
            <span style={{ fontSize: 13, color: "#92400e" }}>Progress updated</span>
            <button onClick={recalc} style={{
              background: "#1a1a1a", color: "#FFFFFF", border: "none",
              borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.01em",
            }}>Recalculate</button>
          </div>
        )}
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px" }}>

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <div style={{ paddingTop: 24 }}>

            {/* Hero stat */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 13, color: "#aeaeb2", marginBottom: 6, letterSpacing: "0.01em" }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </div>
              <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: "-1px", color: "#1a1a1a", lineHeight: 1.1 }}>
                {pct}<span style={{ fontSize: 22, fontWeight: 400, color: "#aeaeb2" }}>%</span>
              </div>
              <div style={{ fontSize: 14, color: "#8a8a8e", marginTop: 4 }}>
                {completed.size} of {total} tasks complete
              </div>
              <div style={{ marginTop: 12, height: 3, background: "#E2E0DB", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: "#1a1a1a", borderRadius: 2, transition: "width 0.6s ease" }}/>
              </div>
            </div>

            {/* Today's focus */}
            {todayFocus && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#aeaeb2", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Up next</div>
                <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "4px 16px 0", border: "1px solid #f0f0f0" }}>
                  <div style={{ padding: "14px 0 12px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>{todayFocus.section.title}</div>
                      <div style={{ fontSize: 12, color: "#aeaeb2", marginTop: 2 }}>{todayFocus.phase.title}</div>
                    </div>
                    <button onClick={() => { setView("curriculum"); setActivePhase(todayFocus.phase.id); }}
                      style={{ background: "none", border: "none", color: "#007aff", fontSize: 14, cursor: "pointer", fontFamily: "inherit", padding: "4px 0" }}>
                      See all
                    </button>
                  </div>
                  {todayFocus.items.map(item => <ItemRow key={item.id} item={item} phaseColor={todayFocus.phase.color}/>)}
                </div>
              </div>
            )}

            {/* Phase timeline */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#aeaeb2", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Timeline</div>
              <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #f0f0f0", overflow: "hidden" }}>
                {PHASES.map((phase, idx) => {
                  const s = schedule[phase.id];
                  if (!s) return null;
                  const done = s.pct >= 1;
                  const active = !done && activePhaseFull.id === phase.id;
                  return (
                    <div key={phase.id}
                      onClick={() => { setView("curriculum"); setActivePhase(phase.id); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "13px 16px",
                        borderBottom: idx < PHASES.length - 1 ? "1px solid #f0f0f0" : "none",
                        cursor: "pointer", background: active ? "#F0EFEB" : "transparent",
                      }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                        background: done ? "#34c759" : active ? phase.color : "#d1d1d6",
                      }}/>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                          <span style={{ fontSize: 14, fontWeight: active ? 600 : 400, color: done ? "#aeaeb2" : "#1a1a1a" }}>{phase.subtitle}</span>
                          <span style={{ fontSize: 12, color: done ? "#34c759" : "#aeaeb2", flexShrink: 0 }}>{done ? "Done" : fmt(s.end)}</span>
                        </div>
                        <div style={{ height: 2, background: "#E8E6E1", borderRadius: 1, overflow: "hidden" }}>
                          <div style={{ width: `${s.pct * 100}%`, height: "100%", background: done ? "#34c759" : phase.color, transition: "width 0.4s" }}/>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div style={{ padding: "14px 16px", borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#8a8a8e" }}>Projected first offer</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>{schedule["p7"] ? fmt(schedule["p7"].end) : "TBD"}</span>
                </div>
              </div>
            </div>

            {/* AI Optimize */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#aeaeb2", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>AI Coach</div>
              <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "16px", border: "1px solid #f0f0f0" }}>
                {aiText && (
                  <div style={{ fontSize: 14, color: "#3a3a3c", lineHeight: 1.7, marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #f0f0f0" }}>
                    {aiText}
                  </div>
                )}
                <button onClick={optimize} disabled={aiLoading} style={{
                  width: "100%", padding: "13px", borderRadius: 12,
                  background: aiLoading ? "#EDECEA" : "#1A1A18",
                  color: aiLoading ? "#B0ADA6" : "#F5F4F0",
                  border: "none", fontSize: 15, fontWeight: 600,
                  cursor: aiLoading ? "not-allowed" : "pointer",
                  fontFamily: "inherit", letterSpacing: "-0.2px",
                  transition: "background 0.2s",
                }}>
                  {aiLoading ? "Analyzing…" : "Get this week's priority"}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* CURRICULUM */}
        {view === "curriculum" && (
          <div style={{ paddingTop: 24 }}>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 20 }}>Curriculum</div>

            {/* Phase filter pills */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 20, scrollbarWidth: "none", msOverflowStyle: "none" }}>
              <button onClick={() => setActivePhase(null)} style={{
                padding: "7px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500,
                background: !activePhase ? "#1a1a1a" : "#EDECEA",
                color: !activePhase ? "#FFFFFF" : "#3a3a3c",
                border: "none", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0,
              }}>All</button>
              {PHASES.map(phase => {
                const s = schedule[phase.id];
                const act = activePhase === phase.id;
                return (
                  <button key={phase.id} onClick={() => setActivePhase(act ? null : phase.id)} style={{
                    padding: "7px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500,
                    background: act ? "#1a1a1a" : "#EDECEA",
                    color: act ? "#FFFFFF" : "#3a3a3c",
                    border: "none", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0,
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <span>{phase.subtitle}</span>
                    <span style={{ fontSize: 11, color: act ? "rgba(255,255,255,0.6)" : "#aeaeb2" }}>{s ? Math.round(s.pct * 100) : 0}%</span>
                  </button>
                );
              })}
            </div>

            {PHASES.filter(p => !activePhase || p.id === activePhase).map(phase => {
              const s = schedule[phase.id];
              return (
                <div key={phase.id} style={{ marginBottom: 28 }}>
                  {/* Phase header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#aeaeb2", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>{phase.title}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", color: "#1a1a1a" }}>{phase.subtitle}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: s && s.pct >= 1 ? "#34c759" : phase.color }}>{s ? Math.round(s.pct * 100) : 0}%</div>
                      <div style={{ fontSize: 12, color: "#aeaeb2" }}>{s ? s.done : 0}/{s ? s.total : 0}</div>
                    </div>
                  </div>

                  {/* Milestone badge */}
                  <div style={{ fontSize: 12, color: "#8a8a8e", background: "#EDECEA", borderRadius: 8, padding: "8px 12px", marginBottom: 12 }}>
                    {phase.milestone}
                  </div>

                  {/* Sections */}
                  {phase.sections.map(section => {
                    const sc = section.items.filter(i => completed.has(i.id)).length;
                    const key = `${phase.id}_${section.id}`;
                    const isExp = isSectionExpanded(key);
                    return (
                      <div key={section.id} style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #f0f0f0", marginBottom: 10, overflow: "hidden" }}>
                        <div onClick={() => toggleSection(key)} style={{
                          padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
                          cursor: "pointer", WebkitTapHighlightColor: "transparent",
                        }}>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: sc === section.items.length ? "#34c759" : "#1a1a1a" }}>{section.title}</div>
                            <div style={{ fontSize: 12, color: "#aeaeb2", marginTop: 2 }}>{sc}/{section.items.length} complete</div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 44, height: 3, background: "#E8E6E1", borderRadius: 2, overflow: "hidden" }}>
                              <div style={{ width: `${(sc/section.items.length)*100}%`, height: "100%", background: phase.color, transition: "width 0.3s" }}/>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                              style={{ transform: isExp ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }}>
                              <path d="M4 6l4 4 4-4" stroke="#aeaeb2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                        {isExp && (
                          <div style={{ padding: "0 16px", borderTop: "1px solid #f0f0f0" }}>
                            {section.items.map(item => <ItemRow key={item.id} item={item} phaseColor={phase.color}/>)}
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

        {/* WORKOUT */}
        {view === "workout" && (
          <div style={{ margin: "0 -20px" }}>
            <WorkoutTab />
          </div>
        )}

      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(245,244,240,0.94)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,0,0,0.06)",
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
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                padding: "10px 0 10px",
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "inherit", WebkitTapHighlightColor: "transparent",
              }}>
                {item.icon(active)}
                <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, color: active ? "#1a1a1a" : "#8a8a8e", letterSpacing: "0.01em" }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
