"use client";

import { motion } from "motion/react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

const enter = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
} as const;

const ease = [0.22, 1, 0.36, 1] as const;

function stagger(index: number) {
  return { duration: 0.9, ease, delay: index * 0.1 };
}

// Staggered entrance for the hero headline group: the EduSphere mark, the
// headline, lead and calls to action.
export function HeroCopy() {
  return (
    <div data-hero="copy">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.1, ease }}
        className="mb-9 flex justify-center"
      >
        <Image
          src="/brand/edusphere-mark-black.png"
          alt="EduSphere AI"
          width={952}
          height={777}
          preload
          className="h-[92px] w-auto max-[680px]:h-[72px]"
        />
      </motion.div>

      <motion.h1 {...enter} transition={stagger(1)} className="text-display-1 mb-8">
        One platform.
        <br />
        <span className="text-muted-2">Complete school intelligence.</span>
      </motion.h1>

      <motion.p
        {...enter}
        transition={stagger(2)}
        className="text-lead mx-auto max-w-[760px] text-muted"
      >
        AI lessons, student records, operations and finance in one platform that understands
        your whole school.
      </motion.p>

      <motion.div
        {...enter}
        transition={stagger(3)}
        className="mt-[34px] flex flex-wrap items-center justify-center gap-3"
      >
        <Button href="#teacher" variant="primary">
          See EduSphere AI
        </Button>
        <Button href="#platform" variant="link" arrow>
          Explore the platform
        </Button>
      </motion.div>
    </div>
  );
}
