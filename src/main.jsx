import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";
import {
  Plane, Church, Home, ShoppingCart, Briefcase, Utensils, MapPin,
  Share2, Lock, SlidersHorizontal, MoreHorizontal, ChevronLeft, ChevronRight,
  Moon, Sun, AlertTriangle, CheckCircle2, XCircle, Building2, TrendingUp,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA — synthesized from the Texas Relocation Preference Profile     */
/* ------------------------------------------------------------------ */
const LC = "Las Colinas";
const LW = "Legacy West";

const COLORS = {
  light: { lc: "#0d9488", lw: "#7c3aed", grid: "#e2e8f0", axis: "#64748b" },
  dark: { lc: "#2dd4bf", lw: "#a78bfa", grid: "#334155", axis: "#94a3b8" },
};

const CRITERIA = [
  { key: "DFW Airport Access", short: "DFW Access", lc: 10, lw: 6, weight: 3, icon: Plane },
  { key: "Potter's House Proximity", short: "Potter's House", lc: 9, lw: 4, weight: 3, icon: Church },
  { key: "Walkable Luxury Lifestyle", short: "Walkability", lc: 7, lw: 10, weight: 2, icon: Utensils },
  { key: "Lock-and-Leave Housing", short: "Housing", lc: 8, lw: 9, weight: 2, icon: Home },
  { key: "Kroger Career Path", short: "Kroger Path", lc: 9, lw: 7, weight: 2, icon: Briefcase },
  { key: "Healthcare / Tech Job Market", short: "Job Market", lc: 7, lw: 9, weight: 2, icon: Building2 },
  { key: "Grocery & Amenities", short: "Grocery", lc: 7, lw: 9, weight: 1, icon: ShoppingCart },
];

function weighted(metric) {
  const got = CRITERIA.reduce((s, c) => s + c[metric] * c.weight, 0);
  const max = CRITERIA.reduce((s, c) => s + 10 * c.weight, 0);
  return Math.round((got / max) * 100);
}
const SCORE = { lc: weighted("lc"), lw: weighted("lw") };

const COMMUTE = [
  { label: "DFW Airport", lc: "7–12", lw: "20–25" },
  { label: "Potter's House", lc: "~20", lw: "40–45" },
];

const NON_NEGOTIABLES = [
  { label: "American / DFW low-friction transit", lc: "met", lw: "partial" },
  { label: "In-person at Potter's House (SW Dallas)", lc: "met", lw: "partial" },
  { label: "Lock-and-leave luxury (no sprawl)", lc: "met", lw: "met" },
  { label: "Walkable upscale dining & nightlife", lc: "partial", lw: "met" },
  { label: "No golf-oriented community", lc: "flag", lw: "met" },
  { label: "Kroger internal corporate transfer", lc: "met", lw: "partial" },
];

const PROFILES = [
  {
    name: LC, tag: "Irving, TX",
    sub: "The geographic sweet spot",
    housing: "Gated waterfront townhomes & luxury villas along Lake Carolyn and the urban canals.",
    lifestyle: "Toyota Music Factory, live jazz, lakeside bistro dining and walking trails.",
    grocery: "Kroger regional manufacturing & supply-chain hub on site; new H-E-B flagship reported.",
    bars: [{ k: "Commute fit", v: 95 }, { k: "Career fit", v: 88 }, { k: "Lifestyle fit", v: 72 }],
  },
  {
    name: LW, tag: "Plano, TX",
    sub: "The luxury tech center",
    housing: "Ultra-modern urban villas, brownstones and concierge high-rise condos.",
    lifestyle: "Rooftop cocktail bars and elite outdoor shopping at the door, active 7 days a week.",
    grocery: "Ground-zero grocery wars — H-E-B and Kroger Marketplace flagships clustered together.",
    bars: [{ k: "Commute fit", v: 58 }, { k: "Career fit", v: 86 }, { k: "Lifestyle fit", v: 96 }],
  },
];

const IMPEDIMENTS = [
  { id: "REL-1", issue: "Legacy West → Potter's House is 40–45 min", area: LW, type: "Commute", priority: "High" },
  { id: "REL-2", issue: "Las Colinas has TPC / Four Seasons golf footprint — confirm exact sub-area", area: LC, type: "Filter", priority: "Medium" },
  { id: "REL-3", issue: 'H-E-B "June 17, 2026" opening claim unverified', area: LC, type: "Verify", priority: "Medium" },
  { id: "REL-4", issue: "Commute estimates sensitive to current SH-114 / SH-121 construction", area: "Both", type: "Verify", priority: "Medium" },
  { id: "REL-5", issue: "Walkable nightlife less dense than Legacy West core", area: LC, type: "Lifestyle", priority: "Low" },
  { id: "REL-6", issue: "Townhome / villa listing prices not yet validated", area: "Both", type: "Verify", priority: "Low" },
];

/* ------------------------------------------------------------------ */
/*  THEME TOKENS                                                        */
/* ------------------------------------------------------------------ */
function tokens(dark) {
  return dark
    ? {
        page: "bg-slate-900", header: "bg-slate-800/60",
        card: "bg-slate-800 border-slate-700", text: "text-slate-100",
        sub: "text-slate-400", faint: "text-slate-500", border: "border-slate-700",
        chip: "bg-slate-700 text-slate-200", input: "bg-slate-800 border-slate-700 text-slate-200",
        track: "#334155", rowHover: "hover:bg-slate-700/40", c: COLORS.dark,
      }
    : {
        page: "bg-slate-100", header: "bg-white/70",
        card: "bg-white border-slate-200", text: "text-slate-800",
        sub: "text-slate-500", faint: "text-slate-400", border: "border-slate-200",
        chip: "bg-slate-100 text-slate-600", input: "bg-white border-slate-300 text-slate-700",
        track: "#e2e8f0", rowHover: "hover:bg-slate-50", c: COLORS.light,
      };
}

/* ------------------------------------------------------------------ */
/*  SMALL PIECES                                                        */
/* ------------------------------------------------------------------ */
function Card({ t, title, icon: Icon, accent = "text-teal-500", children, menu = true }) {
  return (
    <div className={`mb-4 inline-block w-full break-inside-avoid rounded-xl border ${t.card} shadow-sm`}>
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon className={`h-4 w-4 ${accent}`} />}
          <span className={`text-sm font-semibold ${t.text}`}>{title}</span>
        </div>
        {menu && <MoreHorizontal className={`h-4 w-4 ${t.faint}`} />}
      </div>
      <div className="px-4 pb-4">{children}</div>
    </div>
  );
}

function Gauge({ value, color, track, label, size = 104 }) {
  const stroke = 11;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - value / 100);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold" style={{ color }}>{value}%</span>
        {label && <span className="text-[10px] uppercase tracking-wide opacity-70" style={{ color }}>{label}</span>}
      </div>
    </div>
  );
}

function MiniBar({ value, color, track }) {
  return (
    <div className="h-2 w-full rounded-full" style={{ background: track }}>
      <div className="h-2 rounded-full" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

const STATUS = {
  met: { Icon: CheckCircle2, cls: "text-emerald-500", lbl: "Met" },
  partial: { Icon: AlertTriangle, cls: "text-amber-500", lbl: "Partial" },
  flag: { Icon: AlertTriangle, cls: "text-rose-500", lbl: "Flag" },
};

const PRIORITY = {
  High: "bg-rose-100 text-rose-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-slate-200 text-slate-600",
};

/* ------------------------------------------------------------------ */
/*  MAIN                                                                */
/* ------------------------------------------------------------------ */
export default function RelocationDashboard() {
  const [dark, setDark] = useState(false);
  const t = tokens(dark);
  const c = t.c;

  const barData = CRITERIA.map((x) => ({ name: x.short, [LC]: x.lc, [LW]: x.lw }));
  const radarData = CRITERIA.map((x) => ({ subject: x.short, [LC]: x.lc, [LW]: x.lw }));

  const tooltipStyle = {
    background: dark ? "#1e293b" : "#fff",
    border: `1px solid ${c.grid}`,
    borderRadius: 8,
    fontSize: 12,
    color: dark ? "#e2e8f0" : "#334155",
  };

  return (
    <div className={`min-h-screen w-full ${t.page} ${t.text} p-3 sm:p-5`}>
      {/* Title strip */}
      <div className="mb-4 rounded-xl px-1">
        <h1 className="text-3xl font-bold tracking-tight text-teal-600 dark:text-teal-400">
          Relocation Dashboard
        </h1>
      </div>

      {/* Toolbar */}
      <div className={`mb-5 flex flex-wrap items-center gap-3 rounded-xl border ${t.border} ${t.header} px-3 py-2 backdrop-blur`}>
        <div className={`flex min-w-[180px] flex-1 items-center gap-2 rounded-lg border px-3 py-1.5 ${t.input}`}>
          <MapPin className="h-4 w-4 text-teal-500" />
          <span className="truncate text-sm font-medium">Texas Relocation · DFW Metro</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ChevronLeft className={`h-4 w-4 ${t.faint}`} />
          <span className={`text-sm ${t.sub}`}>1</span>
          <ChevronRight className={`h-4 w-4 ${t.faint}`} />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDark((d) => !d)}
            className="flex items-center gap-2 text-sm"
            aria-label="Toggle dark mode"
          >
            <span className={t.sub}>Dark mode</span>
            <span className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${dark ? "bg-teal-500" : "bg-slate-300"}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${dark ? "translate-x-4" : "translate-x-0.5"}`} />
            </span>
            {dark ? <Moon className="h-4 w-4 text-teal-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
          </button>
          <Share2 className={`hidden h-4 w-4 sm:block ${t.faint}`} />
          <Lock className={`hidden h-4 w-4 sm:block ${t.faint}`} />
          <span className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs ${t.chip}`}>
            <SlidersHorizontal className="h-3.5 w-3.5" /> 2 Filters
          </span>
          <MoreHorizontal className={`h-4 w-4 ${t.faint}`} />
        </div>
      </div>

      {/* Masonry of gadgets */}
      <div className="columns-1 gap-4 md:columns-2 xl:columns-3">

        {/* Overall match */}
        <Card t={t} title="Overall Match" icon={TrendingUp} accent="text-teal-500">
          <div className="flex items-center justify-around py-1">
            <div className="flex flex-col items-center gap-1">
              <Gauge value={SCORE.lc} color={c.lc} track={t.track} label="LC" />
              <span className={`text-xs font-medium ${t.sub}`}>{LC}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Gauge value={SCORE.lw} color={c.lw} track={t.track} label="LW" />
              <span className={`text-xs font-medium ${t.sub}`}>{LW}</span>
            </div>
          </div>
          <p className={`mt-2 text-center text-xs ${t.faint}`}>
            Weighted to the profile's non-negotiables (DFW + Potter's House count triple)
          </p>
        </Card>

        {/* Commute snapshot */}
        <Card t={t} title="Commute Snapshot" icon={Plane} accent="text-sky-500">
          {COMMUTE.map((r) => (
            <div key={r.label} className={`flex items-center justify-between border-b py-3 last:border-0 ${t.border}`}>
              <span className={`text-sm ${t.sub}`}>{r.label}</span>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-lg font-bold" style={{ color: c.lc }}>{r.lc}<span className="text-xs font-normal"> min</span></div>
                  <div className={`text-[10px] ${t.faint}`}>{LC}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold" style={{ color: c.lw }}>{r.lw}<span className="text-xs font-normal"> min</span></div>
                  <div className={`text-[10px] ${t.faint}`}>{LW}</div>
                </div>
              </div>
            </div>
          ))}
        </Card>

        {/* Criteria comparison bar chart */}
        <Card t={t} title="Criteria Comparison" icon={Building2} accent="text-violet-500">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} margin={{ top: 6, right: 4, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: c.axis }} interval={0} angle={-25} textAnchor="end" height={48} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: c.axis }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: dark ? "#1e293b" : "#f1f5f9" }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey={LC} fill={c.lc} radius={[3, 3, 0, 0]} />
              <Bar dataKey={LW} fill={c.lw} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Non-negotiables checklist */}
        <Card t={t} title="Non-Negotiables" icon={CheckCircle2} accent="text-emerald-500">
          <div className={`mb-2 flex justify-end gap-5 pr-1 text-[10px] font-semibold ${t.faint}`}>
            <span style={{ color: c.lc }}>{LC}</span>
            <span style={{ color: c.lw }}>{LW}</span>
          </div>
          {NON_NEGOTIABLES.map((n) => {
            const a = STATUS[n.lc], b = STATUS[n.lw];
            return (
              <div key={n.label} className={`flex items-center justify-between border-b py-2 last:border-0 ${t.border}`}>
                <span className={`pr-3 text-xs ${t.sub}`}>{n.label}</span>
                <div className="flex shrink-0 items-center gap-6">
                  <a.Icon className={`h-4 w-4 ${a.cls}`} />
                  <b.Icon className={`h-4 w-4 ${b.cls}`} />
                </div>
              </div>
            );
          })}
        </Card>

        {/* Radar */}
        <Card t={t} title="Fit Radar" icon={TrendingUp} accent="text-teal-500">
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData} outerRadius="72%">
              <PolarGrid stroke={c.grid} />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: c.axis }} />
              <Radar name={LC} dataKey={LC} stroke={c.lc} fill={c.lc} fillOpacity={0.35} />
              <Radar name={LW} dataKey={LW} stroke={c.lw} fill={c.lw} fillOpacity={0.3} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Neighborhood profiles */}
        {PROFILES.map((p, i) => (
          <Card key={p.name} t={t} title={p.name} icon={Home} accent={i === 0 ? "text-teal-500" : "text-violet-500"}>
            <span className={`text-xs font-medium`} style={{ color: i === 0 ? c.lc : c.lw }}>{p.tag} · {p.sub}</span>
            <div className="mt-3 space-y-3">
              <div>
                <div className={`text-[11px] font-semibold uppercase tracking-wide ${t.faint}`}>Housing</div>
                <p className={`text-xs ${t.sub}`}>{p.housing}</p>
              </div>
              <div>
                <div className={`text-[11px] font-semibold uppercase tracking-wide ${t.faint}`}>Lifestyle</div>
                <p className={`text-xs ${t.sub}`}>{p.lifestyle}</p>
              </div>
              <div>
                <div className={`text-[11px] font-semibold uppercase tracking-wide ${t.faint}`}>Grocery & Career</div>
                <p className={`text-xs ${t.sub}`}>{p.grocery}</p>
              </div>
              <div className="space-y-2 pt-1">
                {p.bars.map((b) => (
                  <div key={b.k}>
                    <div className={`mb-1 flex justify-between text-[10px] ${t.faint}`}>
                      <span>{b.k}</span><span>{b.v}%</span>
                    </div>
                    <MiniBar value={b.v} color={i === 0 ? c.lc : c.lw} track={t.track} />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}

        {/* Impediments */}
        <Card t={t} title="Impediments & Watch-Outs" icon={AlertTriangle} accent="text-rose-500">
          <p className={`mb-2 text-xs ${t.faint}`}>Open items before committing to either area</p>
          <div className="space-y-1">
            {IMPEDIMENTS.map((b) => (
              <div key={b.id} className={`flex items-start gap-2 rounded-lg p-2 ${t.rowHover}`}>
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                <div className="min-w-0 flex-1">
                  <p className={`text-xs ${t.text}`}>{b.issue}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${PRIORITY[b.priority]}`}>{b.priority}</span>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] ${t.chip}`}>{b.type}</span>
                    <span className={`text-[10px] ${t.faint}`}>{b.area}</span>
                    <span className={`ml-auto text-[10px] font-mono ${t.faint}`}>{b.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recommendation */}
        <Card t={t} title="Recommendation" icon={CheckCircle2} accent="text-teal-500" menu={false}>
          <div className="flex items-center gap-3 rounded-lg p-3" style={{ background: dark ? "#0f766e22" : "#0d948811" }}>
            <Gauge value={SCORE.lc} color={c.lc} track={t.track} size={72} />
            <div>
              <div className="text-sm font-bold" style={{ color: c.lc }}>Las Colinas leads</div>
              <p className={`text-xs ${t.sub}`}>
                Wins the non-negotiables — DFW access and a 20-min Potter's House drive.
              </p>
            </div>
          </div>
          <p className={`mt-3 text-xs ${t.sub}`}>
            <span style={{ color: c.lw }} className="font-semibold">{LW}</span> still wins on walkable luxury and job-market density.
            The call flips only if a sophisticated walkable district is weighted above commute.
          </p>
        </Card>

        <div className={`mb-4 break-inside-avoid text-right text-xs ${t.faint}`}>REL · v1</div>
      </div>
    </div>
  );
}
