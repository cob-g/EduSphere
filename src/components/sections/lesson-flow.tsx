import { Reveal } from "@/components/motion/reveal";
import StackInteractor, { type StackItem } from "@/components/ui/connoisseur-stack-interactor";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";

// Band 4: the lesson flow, one section instead of four. Each step has its own
// illustration (public/product), clipped and reassembled by the stack
// interactor as the reader moves through the steps.

const steps: StackItem[] = [
  {
    num: "01",
    name: "Upload lesson",
    description:
      "PDF, PowerPoint, Word, images, video or a lesson plan. EduSphere starts from the teacher's approved material.",
    image: "/product/step-1-upload.jpg",
    layout: "layers",
  },
  {
    num: "02",
    name: "AI understands",
    description:
      "Objectives, concepts, examples, activities, likely questions and assessment opportunities, identified from the source.",
    image: "/product/step-2-ai-understands.jpg",
    layout: "mosaic",
  },
  {
    num: "03",
    name: "Teacher approves",
    description:
      "Edit the script, change the tone, add examples, approve the quiz. Publish only when it is ready.",
    image: "/product/step-3-teacher-approves.jpg",
    layout: "grid",
  },
  {
    num: "04",
    name: "One record",
    description:
      "Enrollment, payments, grades, attendance, documents and AI learning data stay on one authorized student context.",
    image: "/product/step-4-one-record.jpg",
    layout: "columns",
  },
];

export function LessonFlow() {
  return (
    <Section theme="light" tone="white" id="platform" className="py-[150px] max-[680px]:py-[105px]">
      <Container className="max-w-[1180px]">
        <div className="mb-16 text-center max-[680px]:mb-10">
          <Reveal>
            <Eyebrow>Start with the teacher</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-display-2">From lesson to learning.</h2>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <StackInteractor items={steps} />
        </Reveal>
      </Container>
    </Section>
  );
}
