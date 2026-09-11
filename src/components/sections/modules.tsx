import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";

import { ModuleCard } from "./module-card";

type Row = "lit" | "base" | "short";

type Module = {
  eyebrow: string;
  title: string;
  text: string;
  kpis?: { value: string; label: string }[];
  rows?: Row[];
};

const modules: Module[] = [
  {
    eyebrow: "Teaching System",
    title: "AI-assisted teaching inside the LMS.",
    text: "Lesson upload, AI lesson building, narration, avatar delivery, Q&A, quizzes, feedback, and teacher analytics.",
    kpis: [
      { value: "128", label: "AI lessons" },
      { value: "92%", label: "Completion" },
    ],
    rows: ["lit", "base", "short", "base"],
  },
  {
    eyebrow: "Registrar",
    title: "Records that stay connected.",
    text: "Enrollment, grades, documents, academic history, and traceable changes.",
    rows: ["lit", "base", "short"],
  },
  {
    eyebrow: "Finance",
    title: "Billing with school context.",
    text: "Payments, balances, official records, reconciliation, and financial visibility tied to the student journey.",
    rows: ["base", "lit", "short"],
  },
  {
    eyebrow: "Command Center",
    title: "See the school in real time.",
    text: "Enrollment, finance, teaching activity, student performance, and alerts in one executive view.",
  },
];

const rowStyles: Record<Row, string> = {
  lit: "w-[70%] bg-white",
  base: "w-full bg-[#242932]",
  short: "w-[46%] bg-[#242932]",
};

// Skeleton rows used inside the mock screens. The reference's blue row is
// rendered white here (monochrome rule).
export function SkeletonRows({ rows }: { rows: Row[] }) {
  return (
    <div aria-hidden>
      {rows.map((row, i) => (
        <div key={i} className={`my-[11px] h-2.5 rounded-pill ${rowStyles[row]}`} />
      ))}
    </div>
  );
}

export function Modules() {
  return (
    <Section theme="dark" tone="night" id="modules" className="py-[105px] md:py-[150px]">
      <Container>
        <div className="text-center">
          <Reveal>
            <Eyebrow>The school operating system</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-display-2 mb-7">
              Everything important.
              <br />
              Connected.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lead mx-auto max-w-[780px] text-muted-dark">
              EduSphere combines school operations with intelligence instead of making schools
              stitch together unrelated tools.
            </p>
          </Reveal>
        </div>

        <div className="mt-[70px] grid grid-cols-1 gap-3.5 min-[1001px]:grid-cols-[1.15fr_.85fr]">
          {modules.map((m, i) => {
            const large = i === 0;
            return (
              <Reveal
                key={m.eyebrow}
                delay={i * 0.08}
                className={large ? "min-[1001px]:row-span-2" : ""}
              >
                <ModuleCard
                  className={
                    large ? "min-h-[420px] min-[1001px]:min-h-[654px]" : "min-h-[320px]"
                  }
                >
                  <Eyebrow>{m.eyebrow}</Eyebrow>
                  <h3 className="mb-3 text-[34px] leading-[1.05] font-semibold tracking-[-0.04em]">
                    {m.title}
                  </h3>
                  <p className="max-w-[430px] leading-[1.6] text-muted-dark">{m.text}</p>

                  {(m.kpis || m.rows) && (
                    <div className="mt-[34px] rounded-panel border border-line-dark bg-night-3 p-[18px]">
                      {m.kpis && (
                        <div className="grid grid-cols-2 gap-2.5">
                          {m.kpis.map((k) => (
                            <div
                              key={k.label}
                              className="rounded-2xl border border-[#262b33] p-[15px]"
                            >
                              <b className="text-[25px] font-semibold tracking-[-0.03em]">
                                {k.value}
                              </b>
                              <small className="mt-[5px] block text-[9px] text-muted-dark-2">
                                {k.label}
                              </small>
                            </div>
                          ))}
                        </div>
                      )}
                      {m.rows && <SkeletonRows rows={m.rows} />}
                    </div>
                  )}
                </ModuleCard>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
