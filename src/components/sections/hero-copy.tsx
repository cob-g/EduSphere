import Image from "next/image";

import { Button } from "@/components/ui/button";
import { markBlack } from "@/lib/assets/images";

// Staggered entrance for the hero headline group: the EduSphere mark, the
// headline, lead and calls to action. Driven by CSS so the server HTML is
// already visible before hydration (this is the page's largest paint), and
// reduced-motion users simply get the final state.
const rise = "motion-safe:animate-rise";

export function HeroCopy() {
  return (
    <div data-hero="copy">
      <div className="mb-9 flex justify-center motion-safe:animate-rise-mark">
        <Image
          src={markBlack}
          alt="EduSphere AI"
          sizes="120px"
          // Above the fold on every screen, so it should not wait for the lazy
          // loader to decide it is in view.
          loading="eager"
          className="h-[92px] w-auto max-sm:h-[72px]"
        />
      </div>

      <h1 className={`text-display-1 mb-8 [animation-delay:.1s] [overflow-wrap:anywhere] ${rise}`}>
        One platform.
        <br />
        <span className="text-muted-2">Complete school intelligence.</span>
      </h1>

      <p className={`text-lead mx-auto max-w-[760px] text-muted [animation-delay:.2s] ${rise}`}>
        AI lessons, student records, operations and finance in one platform that understands
        your whole school.
      </p>

      {/* On phones the column gap is 4px tighter. At 402px (iPhone Pro) the two
          actions fit on one row in Inter with a pixel to spare, but not in the
          fallback font, so the row unwrapped when Inter arrived and everything
          below jumped up 36px. */}
      <div
        className={`mt-[34px] flex flex-wrap items-center justify-center gap-3 max-sm:gap-x-2 [animation-delay:.3s] ${rise}`}
      >
        <Button href="#teacher" variant="primary">
          See EduSphere AI
        </Button>
        <Button href="#platform" variant="link" arrow>
          Explore the platform
        </Button>
      </div>
    </div>
  );
}
