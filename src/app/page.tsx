import { StackCheck } from "@/components/dev/stack-check";
import { siteConfig } from "@/lib/constants/site";

// Development placeholder — replaced when the real homepage is implemented.
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium text-neutral-500">{siteConfig.name}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Public Website Foundation</h1>
      <p className="mt-3 text-lg text-neutral-600">{siteConfig.tagline}</p>
      <StackCheck />
    </main>
  );
}
