import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import SparklesTitle from "@/components/ui/sparkles-title3";

import { TeacherDevice } from "./teacher-device";

// Band 3: the AI Virtual Teacher cinematic. The intro stands over a horizon of
// light with sparkles falling away beneath it, into the stage.
export function AiTeacher() {
  return (
    <Section theme="dark" tone="night" id="teacher" className="pt-[150px] pb-0 max-sm:pt-[105px]">
      <SparklesTitle>
        <Container className="max-w-[1000px] pb-16 text-center max-sm:pb-10">
          <Reveal>
            <Eyebrow>EduSphere AI Virtual Teacher</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-display-2 mb-7">
              Upload lesson.
              <br />
              AI teaches.
              <br />
              Teacher supervises.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lead mx-auto max-w-[720px] text-muted-dark">
              Approved lessons become narration, visuals, student Q&amp;A, quizzes and feedback.
            </p>
          </Reveal>
        </Container>
      </SparklesTitle>

      {/* Cinematic stage */}
      <div
        className="relative -mt-24 grid min-h-[940px] place-items-center max-sm:-mt-16 max-sm:min-h-[760px]"
        style={{
          background:
            "radial-gradient(circle at 50% 28%,rgba(255,255,255,.14),transparent 24%)," +
            "radial-gradient(circle at 50% 48%,rgba(255,255,255,.07),transparent 36%),#000",
        }}
      >
        <TeacherDevice />
      </div>
    </Section>
  );
}
