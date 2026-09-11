import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNav } from "@/components/layout/site-nav";
import { AiTeacher } from "@/components/sections/ai-teacher";
import { Cta } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";
import { LessonFlow } from "@/components/sections/lesson-flow";
import { Mission } from "@/components/sections/mission";
import { Modules } from "@/components/sections/modules";
import { Trust } from "@/components/sections/trust";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <Mission />
        <AiTeacher />
        <LessonFlow />
        <Modules />
        <Trust />
        <Cta />
      </main>
      <SiteFooter />
    </>
  );
}
