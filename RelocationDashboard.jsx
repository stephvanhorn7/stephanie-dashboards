import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from "recharts";
import {
  Play, ChevronLeft, ChevronRight, Share2, Lock, SlidersHorizontal,
  MoreHorizontal, Pin, CheckCircle2, Sun, Moon, TrendingUp, Clock, Flag, AlertTriangle
} from "lucide-react";

/* ---------- palette ---------- */
const C = {
  blue: "#2684FF", green: "#36B37E", teal: "#00B8D9",
  red: "#FF5630", amber: "#FFAB00", purple: "#6554C0",
};
const light = {
  app: "#F4F5F7", card: "#FFFFFF", text: "#172B4D", sub: "#6B778C",
  border: "#DFE1E6", track: "#EBECF0", chip: "#F4F5F7",
  band: "#F7EFDF", title: "#14403A", toolbar: "#FFFFFF",
};
const dark = {
  app: "#0E1726", card: "#16202E", text: "#E6EDF5", sub: "#8B97A8",
  border: "#243044", track: "#243044", chip: "#1E2A3A",
  band: "#16202E", title: "#4FD1C5", toolbar: "#16202E",
};

/* ---------- data (bookstore MVP project) ---------- */
const velocityData = [
  { s: "Sprint 1", commit: 20, done: 16, added: 16, removed: 2, est: 20 },
  { s: "Sprint 2", commit: 18, done: 15, added: 15, removed: 1, est: 17 },
  { s: "Sprint 3", commit: 9, done: 8, added: 8, removed: 1, est: 9 },
  { s: "Sprint 4", commit: 9, done: 5, added: 5, removed: 1, est: 9 },
  { s: "Sprint 5", commit: 9, done: 5, added: 5, removed: 1, est: 8 },
  { s: "Sprint 6", commit: 3, done: 4, added: 1, removed: 1, est: 3 },
  { s: "Sprint 7", commit: 2, done: 2, added: 1, removed: 1, est: 2 },
  { s: "Sprint 8", commit: 17, done: 16, added: 15, removed: 2, est: 17 },
];
const burndown = [
  { d: "Oct 25", guide: 20, rem: 19 },
  { d: "Oct 26", guide: 17, rem: 18 },
  { d: "Oct 27", guide: 13, rem: 15 },
  { d: "Oct 28", guide: 10, rem: 9 },
  { d: "Oct 29", guide: 7, rem: 9 },
  { d: "Oct 30", guide: 3, rem: 5 },
  { d: "Oct 31", guide: 0, rem: 5 },
];
const releases = [
  { v: "v1.0 · Catalog & Search", done: 60, prog: 25, count: 4, date: "Aug 09", dot: C.amber },
  { v: "v1.1 · Accounts & Auth", done: 80, prog: 15, count: 3, date: "Aug 09", dot: C.green },
  { v: "v1.2 · Cart & Checkout", done: 35, prog: 30, count: 5, date: "Aug 16", dot: C.amber },
  { v: "v1.3 · Stripe Payments", done: 20, prog: 25, count: 5, date: "Aug 23", dot: C.red },
  { v: "v1.4 · Secure Infra", done: 10, prog: 20, count: 4, date: "Aug 30", dot: C.red },
];
const goals = [
  { name: "Online Store · Sprint 1", items: ["Ship product catalog browsing", "Enable keyword search & results", "Stand up checkout MVP flow"] },
  { name: "Online Store · Sprint 2", items: ["Integrate Stripe payment processing", "Launch user accounts & sign-in", "Harden secure server infrastructure"] },
];
const epics = [
  { name: "Product Catalog & Search", code: "BK-101", status: "IN PROGRESS", pct: 40, color: C.amber, done: 4, total: 10, start: "May 09", end: "Aug 09" },
  { name: "Cart & Checkout MVP", code: "BK-102", status: "IN PROGRESS", pct: 25, color: C.teal, done: 2, total: 8, start: "May 09", end: "Aug 09" },
  { name: "Payments & Security", code: "BK-103", status: "TO DO", pct: 0, color: C.sub, done: 0, total: 12, start: "May 09", end: "Aug 09" },
  { name: "User Accounts & Auth", code: "BK-104", status: "DONE", pct: 100, color: C.green, done: 5, total: 5, start: "May 09", end: "Aug 09" },
];
const impediments = [
  { title: "Stripe account verification pending", type: "Task", pr: "High", who: "Gorka Puente", init: "GP", t: "BK-27" },
  { title: "Search relevance tuning unresolved", type: "Sub-task", pr: "Medium", who: "Diego Rosado", init: "DR", t: "BK-26" },
  { title: "Inventory CSV import blocked", type: "Task", pr: "High", who: "Francisco Moira", init: "FM", t: "BK-25" },
  { title: "TLS certificate procurement", type: "Epic", pr: "Medium", who: "Irene Roselí", init: "IR", t: "BK-24" },
  { title: "Accessibility audit scheduling", type: "Task", pr: "Low", who: "Íñigo González", init: "IG", t: "BK-23" },
];
const prColor = { High: C.red, Medium: C.amber, Low: C.blue };

// Stories injected (unplanned work added after sprint start)
const injects = [
  { story: "Add gift-wrap option at checkout", pts: 3, added: "Day 4", reason: "Stakeholder request", t: "BK-208" },
  { story: "Support Apple Pay express checkout", pts: 5, added: "Day 6", reason: "Payments scope change", t: "BK-211" },
  { story: "Fix duplicate ISBN in catalog import", pts: 2, added: "Day 7", reason: "Defect escalation", t: "BK-214" },
  { story: "Cookie consent banner", pts: 3, added: "Day 8", reason: "Legal / compliance", t: "BK-217" },
];

// Stories whose cycle time (days) exceeds their story-point estimate
const aging = [
  { story: "Search relevance ranking", pts: 3, cycle: 9, t: "BK-142" },
  { story: "Stripe webhook reconciliation", pts: 5, cycle: 12, t: "BK-155" },
  { story: "Order confirmation emails", pts: 3, cycle: 7, t: "BK-168" },
  { story: "Cart multi-device sync", pts: 2, cycle: 6, t: "BK-160" },
  { story: "Accessibility: keyboard navigation", pts: 2, cycle: 5, t: "BK-173" },
];

/* ---------- small components ---------- */
function Ring({ size = 64, stroke = 7, pct = 0, color = C.green, track, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .6s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0 }} className="flex flex-col items-center justify-center leading-none">
        {children}
      </div>
    </div>
  );
}

function Card({ t, title, icon: Icon, iconColor = C.blue, span = "", right, children }) {
  return (
    <section
      className={`rounded-xl shadow-sm p-4 sm:p-5 flex flex-col ${span}`}
      style={{ background: t.card, border: `1px solid ${t.border}` }}
    >
      {title && (
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {Icon && <Icon size={15} style={{ color: iconColor }} />}
            <h3 className="font-semibold text-sm" style={{ color: t.text }}>{title}</h3>
          </div>
          {right}
        </header>
      )}
      {children}
    </section>
  );
}

function Tag({ t, children, color }) {
  return (
    <span className="text-[10px] font-bold tracking-wide px-1.5 py-0.5 rounded"
      style={{ background: t.chip, color: color || t.sub }}>{children}</span>
  );
}

/* ---------- main ---------- */
export default function Dashboard() {
  const [isDark, setIsDark] = useState(false);
  const t = isDark ? dark : light;

  const tooltipStyle = {
    background: t.card, border: `1px solid ${t.border}`,
    borderRadius: 8, fontSize: 12, color: t.text,
  };
  const ctrlBtn = "w-8 h-8 rounded-lg flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2";

  return (
    <div className="min-h-screen w-full" style={{ background: t.app, color: t.text, fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
      {/* slide band */}
      <div className="px-5 sm:px-8 py-5" style={{ background: t.band }}>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight" style={{ color: t.title }}>Dashboard</h1>
      </div>

      {/* toolbar */}
      <div className="px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3" style={{ background: t.toolbar, borderBottom: `1px solid ${t.border}` }}>
        <div className="px-3 py-1.5 rounded-lg text-sm font-medium flex-1 min-w-[140px] max-w-xs"
          style={{ border: `1px solid ${t.border}`, color: t.text }}>Online Bookstore · Agile Team</div>

        <div className="hidden md:flex items-center gap-1 mx-auto" style={{ color: t.sub }}>
          <button className={ctrlBtn} style={{ background: C.blue, color: "#fff" }}><Play size={14} /></button>
          <button className={ctrlBtn}><ChevronLeft size={16} /></button>
          <span className="text-sm w-6 text-center font-medium" style={{ color: t.text }}>2</span>
          <button className={ctrlBtn}><ChevronRight size={16} /></button>
        </div>

        <div className="flex items-center gap-2 ml-auto" style={{ color: t.sub }}>
          <button onClick={() => setIsDark(v => !v)}
            className="flex items-center gap-2 text-xs font-medium focus:outline-none focus-visible:ring-2 rounded-lg px-1"
            aria-label="Toggle dark mode">
            <span className="hidden sm:inline">{isDark ? "Light mode" : "Dark mode"}</span>
            <span className="w-9 h-5 rounded-full flex items-center px-0.5 transition-colors"
              style={{ background: isDark ? C.blue : t.track }}>
              <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center transition-transform"
                style={{ transform: isDark ? "translateX(16px)" : "translateX(0)" }}>
                {isDark ? <Moon size={10} color={C.blue} /> : <Sun size={10} color={C.amber} />}
              </span>
            </span>
          </button>
          <button className="hidden sm:flex items-center gap-1 text-xs font-medium px-2 py-1"><Share2 size={14} /> Share</button>
          <button className={ctrlBtn}><Lock size={14} /></button>
          <div className="flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg" style={{ border: `1px solid ${t.border}`, color: t.text }}>
            <SlidersHorizontal size={13} /> 2 Filters
          </div>
          <button className={ctrlBtn} style={{ background: C.blue, color: "#fff" }}><MoreHorizontal size={16} /></button>
        </div>
      </div>

      {/* grid */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Velocity */}
        <Card t={t} title="Velocity" icon={Pin} iconColor={C.blue} span="md:col-span-2 xl:col-span-2"
          right={<MoreHorizontal size={16} style={{ color: t.sub }} />}>
          <div className="flex items-center justify-end -mt-2 mb-1">
            <Ring size={78} stroke={9} pct={78} color={C.green} track={t.track}>
              <span className="text-xl font-bold" style={{ color: t.text }}>25</span>
              <span className="text-[9px]" style={{ color: t.sub }}>Story Points</span>
            </Ring>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={velocityData} margin={{ top: 4, right: 4, left: -18, bottom: 0 }} barGap={1} barCategoryGap="18%">
              <CartesianGrid vertical={false} stroke={t.border} />
              <XAxis dataKey="s" tick={{ fontSize: 10, fill: t.sub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: t.sub }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: t.track, opacity: 0.4 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: t.sub }} iconType="circle" iconSize={8} />
              <Bar name="Commitment" dataKey="commit" fill={C.blue} radius={[2, 2, 0, 0]} />
              <Bar name="Completed" dataKey="done" fill={C.green} radius={[2, 2, 0, 0]} />
              <Bar name="Added work" dataKey="added" fill={C.teal} radius={[2, 2, 0, 0]} />
              <Bar name="Removed work" dataKey="removed" fill={C.red} radius={[2, 2, 0, 0]} />
              <Bar name="Estimate change" dataKey="est" fill={C.amber} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Releases */}
        <Card t={t} title="Releases" icon={Pin} iconColor={C.blue}>
          <p className="text-xs font-semibold mb-3" style={{ color: t.text }}>Release hub</p>
          <div className="flex flex-col gap-3">
            {releases.map((r) => (
              <div key={r.v} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs truncate" style={{ color: t.text }}>{r.v}</span>
                    <Tag t={t}>UNRELEASED</Tag>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden flex" style={{ background: t.track }}>
                    <span style={{ width: `${r.done}%`, background: C.blue }} />
                    <span style={{ width: `${r.prog}%`, background: C.green }} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: r.dot }} />
                  <span className="text-[11px]" style={{ color: t.sub }}>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Sprint goals */}
        <Card t={t} title="Sprint goals" icon={Pin} iconColor={C.amber}>
          <div className="flex flex-col gap-4">
            {goals.map((g) => (
              <div key={g.name}>
                <p className="text-xs font-semibold mb-2" style={{ color: t.text }}>{g.name}</p>
                <ul className="flex flex-col gap-2">
                  {g.items.map((it, i) => (
                    <li key={it} className="flex items-start gap-2">
                      {i === 0
                        ? <CheckCircle2 size={15} color={C.green} className="mt-0.5 shrink-0" />
                        : <span className="mt-0.5 shrink-0 w-[15px] h-[15px] rounded-full flex items-center justify-center text-[9px] font-bold"
                            style={{ background: t.chip, color: t.sub }}>{i + 1}</span>}
                      <span className="text-[11px] leading-tight" style={{ color: t.sub }}>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        {/* KPI / Formula gadget */}
        <Card t={t} title="Store KPIs" icon={Pin} iconColor={C.purple}>
          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <p className="text-[11px] mb-1" style={{ color: t.sub }}>Issues</p>
              <p className="text-2xl font-bold" style={{ color: t.text }}>1,284</p>
              <p className="text-[11px] mt-3 mb-1" style={{ color: t.sub }}>Revenue</p>
              <p className="text-2xl font-bold" style={{ color: t.text }}>$4,600</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-[11px] mb-2 self-start" style={{ color: t.sub }}>Bugs</p>
              <Ring size={92} stroke={11} pct={20} color={C.purple} track={t.track}>
                <span className="text-lg font-bold" style={{ color: t.text }}>20%</span>
              </Ring>
              <p className="text-[10px] mt-2" style={{ color: t.sub }}>122 of 610 bugs</p>
            </div>
          </div>
        </Card>

        {/* Sprint health */}
        <Card t={t} title="Sprint Health" icon={Pin} iconColor={C.blue}>
          <p className="text-[11px] -mt-2 mb-3" style={{ color: t.sub }}>Metric: Issue count</p>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: t.text }}>Online Store · Sprint 1</span>
              <Tag t={t} color={C.green}>ACTIVE</Tag>
            </div>
            <Ring size={48} stroke={6} pct={40} color={C.blue} track={t.track}>
              <span className="text-[11px] font-bold" style={{ color: t.text }}>40%</span>
            </Ring>
          </div>
          <div className="h-2 rounded-full overflow-hidden flex mb-1" style={{ background: t.track }}>
            <span style={{ width: "20%", background: t.sub }} />
            <span style={{ width: "40%", background: C.blue }} />
            <span style={{ width: "40%", background: C.green }} />
          </div>
          <p className="text-[10px] text-center mb-3" style={{ color: t.sub }}>Issues: 48</p>
          <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${t.border}` }}>
            <div className="flex flex-col gap-1 text-[11px]" style={{ color: t.sub }}>
              <span className="flex items-center gap-1.5"><Clock size={12} /> 6 days left</span>
              <span className="flex items-center gap-1.5"><AlertTriangle size={12} color={C.red} /> 1 blocker left</span>
              <span className="flex items-center gap-1.5"><Flag size={12} color={C.amber} /> 1 flagged left</span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-1 rounded flex items-center gap-1"
              style={{ background: `${C.red}1a`, color: C.red }}><TrendingUp size={11} /> 13% Scope changed</span>
          </div>
        </Card>

        {/* Resolved issues */}
        <Card t={t} title="Resolved Issues" icon={Pin} iconColor={C.green}>
          <p className="text-[11px] -mt-2 mb-3" style={{ color: t.sub }}>Sprint 8</p>
          <div className="flex items-end justify-between">
            <span className="text-5xl font-bold" style={{ color: t.text }}>21</span>
            <div className="text-right">
              <span className="text-xs font-semibold flex items-center gap-1 justify-end" style={{ color: C.green }}>
                <TrendingUp size={13} /> 13%
              </span>
              <span className="text-[11px]" style={{ color: t.sub }}>Previous: 18</span>
            </div>
          </div>
        </Card>

        {/* Epics progress */}
        <Card t={t} title="Epics Progress" icon={Pin} iconColor={C.blue} span="md:col-span-2 xl:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {epics.map((e) => (
              <div key={e.code} className="rounded-lg p-3" style={{ border: `1px solid ${t.border}` }}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: e.color }} />
                      <span className="text-xs font-semibold truncate" style={{ color: t.text }}>{e.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag t={t}>{e.status}</Tag>
                      <span className="text-[10px]" style={{ color: t.sub }}>{e.code}</span>
                    </div>
                  </div>
                  <Ring size={44} stroke={5} pct={e.pct} color={e.pct === 0 ? t.track : e.color} track={t.track}>
                    <span className="text-[10px] font-bold" style={{ color: t.text }}>{e.pct}%</span>
                  </Ring>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: t.track }}>
                  <span className="block h-full rounded-full" style={{ width: `${e.pct}%`, background: e.color }} />
                </div>
                <div className="flex items-center justify-between text-[10px]" style={{ color: t.sub }}>
                  <span>Issues: {e.total}</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ background: C.green }} />{e.end}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Burndown */}
        <Card t={t} title="Sprint Burndown" icon={Pin} iconColor={C.blue} span="md:col-span-2 xl:col-span-2">
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={burndown} margin={{ top: 6, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke={t.border} vertical={false} />
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: t.sub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: t.sub }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: t.sub }} iconType="plainline" iconSize={14} />
              <Line name="Guideline" type="monotone" dataKey="guide" stroke={C.blue} strokeWidth={2} dot={{ r: 3 }} />
              <Line name="Remaining work" type="monotone" dataKey="rem" stroke={C.green} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Impediments / Sprint Blockers */}
        <Card t={t} title="Impediments · Sprint Blockers" icon={AlertTriangle} iconColor={C.red} span="md:col-span-2 xl:col-span-4">
          <p className="text-[11px] -mt-2 mb-3" style={{ color: t.sub }}>Sprints: Online Store Sprint 1 and Sprint 2</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 620 }}>
              <thead>
                <tr className="text-[10px] uppercase tracking-wide" style={{ color: t.sub }}>
                  <th className="font-semibold pb-2 pr-3">Impediment</th>
                  <th className="font-semibold pb-2 pr-3">Type</th>
                  <th className="font-semibold pb-2 pr-3">Priority</th>
                  <th className="font-semibold pb-2 pr-3">Assignee</th>
                  <th className="font-semibold pb-2 pr-3 text-right">Ticket</th>
                </tr>
              </thead>
              <tbody>
                {impediments.map((b) => (
                  <tr key={b.t} style={{ borderTop: `1px solid ${t.border}` }}>
                    <td className="py-2.5 pr-3 text-xs" style={{ color: t.text }}>{b.title}</td>
                    <td className="py-2.5 pr-3 text-xs" style={{ color: t.sub }}>{b.type}</td>
                    <td className="py-2.5 pr-3">
                      <span className="flex items-center gap-1.5 text-xs" style={{ color: t.text }}>
                        <span className="w-2 h-2 rounded-full" style={{ background: prColor[b.pr] }} />{b.pr}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className="flex items-center gap-2 text-xs" style={{ color: t.text }}>
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                          style={{ background: C.purple }}>{b.init}</span>
                        <span className="truncate">{b.who}</span>
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-right text-xs font-semibold" style={{ color: C.blue }}>{b.t}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Injected stories */}
        <Card t={t} title="Injected Stories" icon={Pin} iconColor={C.teal} span="md:col-span-2 xl:col-span-2">
          <p className="text-[11px] -mt-2 mb-3" style={{ color: t.sub }}>Unplanned work added after sprint start</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 460 }}>
              <thead>
                <tr className="text-[10px] uppercase tracking-wide" style={{ color: t.sub }}>
                  <th className="font-semibold pb-2 pr-3">Story</th>
                  <th className="font-semibold pb-2 pr-3">Pts</th>
                  <th className="font-semibold pb-2 pr-3">Added</th>
                  <th className="font-semibold pb-2 pr-3">Reason</th>
                  <th className="font-semibold pb-2 pr-3 text-right">Ticket</th>
                </tr>
              </thead>
              <tbody>
                {injects.map((s) => (
                  <tr key={s.t} style={{ borderTop: `1px solid ${t.border}` }}>
                    <td className="py-2.5 pr-3 text-xs" style={{ color: t.text }}>
                      <span className="flex items-center gap-2">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0" style={{ background: `${C.teal}1a`, color: C.teal }}>INJECT</span>
                        <span className="truncate">{s.story}</span>
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-xs font-semibold" style={{ color: t.text }}>{s.pts}</td>
                    <td className="py-2.5 pr-3 text-xs whitespace-nowrap" style={{ color: t.sub }}>{s.added}</td>
                    <td className="py-2.5 pr-3 text-xs" style={{ color: t.sub }}>{s.reason}</td>
                    <td className="py-2.5 pr-3 text-right text-xs font-semibold" style={{ color: C.blue }}>{s.t}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] mt-3" style={{ color: t.sub }}>
            {injects.length} injects · {injects.reduce((a, b) => a + b.pts, 0)} unplanned points this sprint
          </p>
        </Card>

        {/* Cycle time > story points */}
        <Card t={t} title="Cycle Time > Story Points" icon={AlertTriangle} iconColor={C.amber} span="md:col-span-2 xl:col-span-2">
          <p className="text-[11px] -mt-2 mb-3" style={{ color: t.sub }}>Stories taking more days to finish than their estimate</p>
          <div className="flex flex-col gap-3.5">
            {aging.map((s) => {
              const over = s.cycle - s.pts;
              const max = Math.max(s.cycle, s.pts);
              return (
                <div key={s.t}>
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <span className="text-xs truncate" style={{ color: t.text }}>{s.story}</span>
                    <span className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: `${C.red}1a`, color: C.red }}>+{over}d over</span>
                      <span className="text-[11px] font-semibold" style={{ color: C.blue }}>{s.t}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] w-14 shrink-0 text-right" style={{ color: t.sub }}>{s.pts} pts</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: t.track }}>
                      <span className="block h-full rounded-full" style={{ width: `${(s.pts / max) * 100}%`, background: C.blue }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] w-14 shrink-0 text-right" style={{ color: t.sub }}>{s.cycle} days</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: t.track }}>
                      <span className="block h-full rounded-full" style={{ width: `${(s.cycle / max) * 100}%`, background: C.red }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] mt-3" style={{ color: t.sub }}>
            {aging.length} stories flagged · blue = estimated points, red = actual days
          </p>
        </Card>
      </div>

      <p className="text-right text-xs px-6 pb-6" style={{ color: t.sub }}>#-64</p>
    </div>
  );
}
