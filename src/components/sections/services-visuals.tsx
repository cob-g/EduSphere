import type { ReactNode } from "react";

// One rendered image per service category: static, monochrome product mocks
// in the same finish as the hero device and the Trust panels. Each is cut to
// the few elements that say what the category does, nothing more.

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-[380px] rounded-[16px] border border-white/10 bg-[#141416] p-5 text-white shadow-[0_30px_60px_-30px_rgba(0,0,0,.8)]">
      {children}
    </div>
  );
}

function Head({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 border-b border-white/10 pb-3 text-[13px] font-medium">{children}</div>
  );
}

function Bar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-1.5 rounded-pill bg-white/10 ${className}`}>
      <div className="h-full rounded-pill bg-white" style={{ width: `${value}%` }} />
    </div>
  );
}

// A. Adaptive path + auto-graded assessment.
const PATH = [
  ["Cells", "done"],
  ["Genetics", "done"],
  ["Evolution", "done"],
  ["Ecology", "now"],
  ["Review", "next"],
] as const;

export function AcademicVisual() {
  return (
    <Panel>
      <Head>AI-LMS</Head>
      <div className="relative flex items-start justify-between">
        <div className="absolute top-[7px] right-2 left-2 h-px bg-white/15" />
        {PATH.map(([label, state]) => (
          <div key={label} className="relative flex w-1/5 flex-col items-center gap-2">
            <span
              className={`size-[15px] rounded-full ${
                state === "done"
                  ? "bg-white"
                  : state === "now"
                    ? "border-2 border-white bg-[#141416] shadow-[0_0_0_4px_rgba(255,255,255,.1)]"
                    : "border border-white/25 bg-[#141416]"
              }`}
            />
            <span className={`text-[10px] ${state === "next" ? "text-white/35" : "text-white/75"}`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2.5">
        <div className="rounded-[12px] border border-white/10 p-3.5">
          <div className="text-[10px] text-white/45">Engagement</div>
          <div className="mt-1 text-[22px] leading-none font-semibold tracking-[-0.03em]">87%</div>
          <Bar value={87} className="mt-3" />
        </div>
        <div className="rounded-[12px] border border-white/10 p-3.5">
          <div className="text-[10px] text-white/45">Auto-graded</div>
          <div className="mt-1 text-[22px] leading-none font-semibold tracking-[-0.03em]">
            28<span className="text-white/40">/30</span>
          </div>
        </div>
      </div>
    </Panel>
  );
}

// B. Timetable with a flagged conflict, live slots.
const DAYS = ["M", "T", "W", "Th", "F"];
const BLOCKS: Array<[number, number, number, "solid" | "dim" | "conflict"]> = [
  [0, 0, 1, "solid"],
  [0, 2, 1, "dim"],
  [1, 1, 2, "solid"],
  [2, 0, 1, "dim"],
  [2, 1, 1, "conflict"],
  [3, 2, 1, "solid"],
  [4, 0, 2, "dim"],
];
const SLOTS = [
  ["BSCS 1A", 38, 40],
  ["BSIT 1B", 40, 40],
  ["BSED 1A", 22, 40],
] as const;

export function InstitutionalVisual() {
  return (
    <Panel>
      <Head>Enrollment &amp; Scheduling</Head>
      <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] text-white/45">
        {DAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-1.5 grid h-[84px] grid-cols-5 grid-rows-3 gap-1.5">
        {BLOCKS.map(([day, row, span, style], i) => (
          <div
            key={i}
            style={{ gridColumn: day + 1, gridRow: `${row + 1} / span ${span}` }}
            className={
              style === "solid"
                ? "rounded-[6px] bg-white/85"
                : style === "dim"
                  ? "rounded-[6px] bg-white/20"
                  : "grid place-items-center rounded-[6px] border border-dashed border-white/70 text-[9px] text-white/80"
            }
          >
            {style === "conflict" ? "Conflict" : null}
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2.5">
        {SLOTS.map(([sec, used, cap]) => (
          <div key={sec} className="flex items-center gap-3 text-[11px]">
            <span className="w-14 text-white/75">{sec}</span>
            <Bar value={(used / cap) * 100} className="flex-1" />
            <span className={`w-12 text-right tabular-nums ${used === cap ? "text-white" : "text-white/55"}`}>
              {used === cap ? "Full" : `${used}/${cap}`}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// C. Admissions chatbot + retention watchlist.
const RISK = [
  ["Santos, M.", 82],
  ["Lim, J.", 61],
  ["Garcia, R.", 44],
] as const;

export function SupportVisual() {
  return (
    <Panel>
      <Head>Admissions Assistant</Head>
      <div className="space-y-2">
        <div className="ml-auto w-fit max-w-[85%] rounded-[14px_14px_4px_14px] border border-white/20 bg-white/[0.06] px-3 py-2 text-[12px]">
          Kailan ang enrollment for transferees?
        </div>
        <div className="w-fit max-w-[88%] rounded-[14px_14px_14px_4px] border border-white/10 px-3 py-2 text-[12px] text-white/85">
          June 3 to 14. I can reserve a slot for you now.
        </div>
      </div>

      <div className="mt-6 border-t border-white/10 pt-4">
        <div className="text-[11px] text-white/55">At-risk this week</div>
        <div className="mt-3 space-y-2.5">
          {RISK.map(([name, risk]) => (
            <div key={name} className="grid grid-cols-[76px_1fr] items-center gap-3 text-[11px]">
              <span className="text-white/80">{name}</span>
              <Bar value={risk} />
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

// D. Administrator dashboard with a forecast.
const KPIS = [
  ["Enrollment", "4,812"],
  ["Retention", "93%"],
  ["Compliance", "98%"],
] as const;

export function AnalyticsVisual() {
  return (
    <Panel>
      <Head>Administrator Dashboard</Head>
      <div className="grid grid-cols-3 gap-2">
        {KPIS.map(([label, value]) => (
          <div key={label} className="rounded-[12px] border border-white/10 p-3">
            <div className="text-[10px] text-white/45">{label}</div>
            <div className="mt-1 text-[20px] leading-none font-semibold tracking-[-0.03em] tabular-nums">
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-[12px] border border-white/10 p-3.5">
        <div className="text-[10px] text-white/45">Forecast</div>
        <svg viewBox="0 0 320 70" className="mt-2 h-[70px] w-full" aria-hidden>
          <polyline
            fill="none"
            stroke="rgba(255,255,255,.9)"
            strokeWidth="2"
            points="0,52 40,48 80,50 120,40 160,36 200,30"
          />
          <polyline
            fill="none"
            stroke="rgba(255,255,255,.45)"
            strokeWidth="2"
            strokeDasharray="4 5"
            points="200,30 240,26 280,20 320,16"
          />
          <circle cx="200" cy="30" r="3.5" fill="#fff" />
        </svg>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-[12px] border border-white/10 px-3.5 py-3 text-[11px]">
        <span className="text-white/80">CHED report</span>
        <span className="rounded-pill bg-white px-2.5 py-1 text-[10px] font-medium text-ink">Ready</span>
      </div>
    </Panel>
  );
}

// E. Transformation roadmap: phases, stack, training.
const PHASES = [
  ["Assess", "done"],
  ["Design", "done"],
  ["Build", "now"],
  ["Train", "next"],
] as const;
const STACK = ["Cloud infrastructure", "Security", "CHED-aligned SIS"];

export function ConsultingVisual() {
  return (
    <Panel>
      <Head>Roadmap</Head>
      <div className="grid grid-cols-4 gap-1.5">
        {PHASES.map(([label, state]) => (
          <div key={label}>
            <div
              className={`h-1.5 rounded-pill ${
                state === "done" ? "bg-white" : state === "now" ? "bg-white/55" : "bg-white/15"
              }`}
            />
            <div className={`mt-2 text-[10px] ${state === "next" ? "text-white/35" : "text-white/75"}`}>
              {label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
        {STACK.map((item) => (
          <div key={item} className="py-2.5 text-[11px] text-white/80">
            {item}
          </div>
        ))}
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between text-[11px]">
          <span className="text-white/55">Faculty trained</span>
          <span className="tabular-nums">
            120<span className="text-white/40">/150</span>
          </span>
        </div>
        <Bar value={80} className="mt-2" />
      </div>
    </Panel>
  );
}
