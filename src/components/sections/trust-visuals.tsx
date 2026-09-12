import { Check, Lock, Sparkles } from "lucide-react";

// Monochrome product mocks for the trust cards. Static, server-rendered, and
// decorative: each card's copy already says what the picture shows.

const ROLES = ["Registrar", "Teacher", "Finance", "Student"];
const AREAS = ["Records", "Grades", "Billing", "Lessons"];
// true = allowed. Rows follow ROLES, columns follow AREAS.
const GRANTS = [
  [true, true, false, false],
  [false, true, false, true],
  [true, false, true, false],
  [false, true, true, true],
];

export function AccessVisual() {
  return (
    <Mock>
      <MockHeader title="Permissions" meta="San Isidro Academy" />
      <div className="grid grid-cols-[92px_repeat(4,1fr)] text-[11px] text-white/55 max-sm:grid-cols-[68px_repeat(4,1fr)] max-sm:text-[10px]">
        <span />
        {AREAS.map((a) => (
          <span key={a} className="pb-3 text-center">
            {a}
          </span>
        ))}
        {ROLES.map((role, r) => (
          <div key={role} className="contents">
            <span
              className={`flex items-center border-t border-white/10 py-3.5 ${r === 1 ? "text-white" : ""}`}
            >
              {role}
            </span>
            {GRANTS[r].map((ok, c) => (
              <span
                key={c}
                className={`grid place-items-center border-t border-white/10 py-3.5 ${r === 1 ? "bg-white/[0.04]" : ""}`}
              >
                <span
                  className={`grid size-6 place-items-center rounded-full ${ok ? "bg-white text-ink" : "border border-white/15 text-white/40"}`}
                >
                  {ok ? (
                    <Check aria-hidden className="size-3.5" strokeWidth={2.5} />
                  ) : (
                    <Lock aria-hidden className="size-3" strokeWidth={2} />
                  )}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-5 text-[11px] text-white/45">
        Teacher · Grade 8 Mathematics · 3 of 4 areas
      </p>
    </Mock>
  );
}

const EVENTS = [
  { what: "Grade updated", detail: "Quarter 1 · 84 to 88", who: "Ms. Reyes", when: "09:41" },
  { what: "Lesson approved", detail: "Linear equations", who: "Ms. Reyes", when: "09:12" },
  { what: "Payment recorded", detail: "Tuition · Q2", who: "Finance office", when: "Yesterday" },
  { what: "Enrollment confirmed", detail: "Grade 8 · Section B", who: "Registrar", when: "Mon" },
];

export function AuditVisual() {
  return (
    <Mock>
      <MockHeader title="Activity" meta="Dela Cruz, Ana · 2024-0231" />
      <ol className="relative ml-2 border-l border-white/12">
        {EVENTS.map((e, i) => (
          <li key={e.what} className="relative pb-6 pl-6 last:pb-0">
            <span
              className={`absolute top-1.5 -left-[5px] size-[9px] rounded-full ${i === 0 ? "bg-white" : "border border-white/40 bg-night-3"}`}
            />
            <div className="flex items-baseline justify-between gap-4">
              <span className={`text-[13px] ${i === 0 ? "text-white" : "text-white/80"}`}>
                {e.what}
              </span>
              <span className="text-[11px] text-white/40 tabular-nums">{e.when}</span>
            </div>
            <div className="mt-0.5 text-[11px] text-white/45">
              {e.detail} · {e.who}
            </div>
          </li>
        ))}
      </ol>
    </Mock>
  );
}

const SCHOOLS = [
  { name: "San Isidro Academy", students: "1,240", records: "38,910" },
  { name: "Mabini Science HS", students: "860", records: "22,104" },
  { name: "Lumen International", students: "540", records: "14,377" },
];

export function BoundaryVisual() {
  return (
    <Mock>
      <MockHeader title="Institutions" meta="Isolated by school" />
      <div className="grid gap-2.5">
        {SCHOOLS.map((s, i) => (
          <div
            key={s.name}
            className={`flex items-center justify-between rounded-[12px] border px-4 py-3.5 ${i === 0 ? "border-white/25 bg-white/[0.05]" : "border-white/10"}`}
          >
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-[9px] border border-white/15 text-white/80">
                <Lock aria-hidden className="size-3.5" strokeWidth={2} />
              </span>
              <div>
                <div className="text-[13px] text-white">{s.name}</div>
                <div className="text-[11px] text-white/45">{s.students} students</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[13px] text-white tabular-nums">{s.records}</div>
              <div className="text-[11px] text-white/45">records</div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-[11px] text-white/45">
        No shared tables. No cross-school queries.
      </p>
    </Mock>
  );
}

export function ReviewVisual() {
  return (
    <Mock>
      <MockHeader title="Lesson review" meta="Generated 2 min ago" />
      <div className="rounded-[12px] border border-white/10 p-4">
        <div className="mb-3 flex items-center gap-2 text-[11px] text-white/55">
          <Sparkles aria-hidden className="size-3.5" strokeWidth={2} />
          AI draft · Linear equations · Grade 8
        </div>
        <div aria-hidden className="space-y-2.5">
          <div className="h-2.5 w-[82%] rounded-pill bg-white/70" />
          <div className="h-2.5 w-full rounded-pill bg-white/15" />
          <div className="h-2.5 w-[92%] rounded-pill bg-white/15" />
          <div className="h-2.5 w-[58%] rounded-pill bg-white/15" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-white/55">
          {["Narration", "Quiz · 8 items", "Feedback"].map((p) => (
            <span key={p} className="rounded-[8px] border border-white/10 px-2.5 py-2 text-center">
              {p}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="rounded-pill bg-white px-4 py-2 text-[12px] font-medium text-ink">
          Approve
        </span>
        <span className="rounded-pill border border-white/20 px-4 py-2 text-[12px] text-white/80">
          Request changes
        </span>
      </div>
      <p className="mt-5 text-[11px] text-white/45">
        Hidden from students until a teacher approves.
      </p>
    </Mock>
  );
}

function Mock({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[420px] rounded-[16px] border border-white/10 bg-night-3 p-5 text-white shadow-[0_30px_60px_-30px_rgba(0,0,0,.8)]">
      {children}
    </div>
  );
}

function MockHeader({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="mb-4 flex items-baseline justify-between border-b border-white/10 pb-3">
      <span className="text-[13px] font-medium text-white">{title}</span>
      <span className="text-[11px] text-white/45">{meta}</span>
    </div>
  );
}
