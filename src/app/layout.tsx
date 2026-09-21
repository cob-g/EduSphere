import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { Instrument_Serif, Inter } from "next/font/google";

import { MotionProvider } from "@/components/motion/motion-provider";
import { organizationSchema, siteConfig } from "@/lib/constants/site";

import "./globals.css";

// Inter (fora.so's typeface). Variable font with the optical-size axis so
// large display headlines render with Inter Display's tighter forms.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  axes: ["opsz"],
});

// Display headlines use Inter with their own fallback, not next/font's
// automatic one. That fallback (Arial at 107%) is tuned for Inter at text
// sizes, but the display cut the optical-size axis selects for big headlines
// runs about 6% narrower. On iPhone-width screens the difference wrapped the
// hero headline onto an extra line until Inter arrived, and the page then
// jumped up 60px. globals.css pairs this family name with a hand-tuned
// "Inter Display Fallback" instead. The name is read from next/font rather
// than written out, so it stays correct if the generated name ever changes.
// (A second Inter() instance would do the same job but emits a second copy of
// the font file under a different URL, and the browser downloads both.)
const interFamilyName = inter.style.fontFamily.split(",")[0].trim();

// One italic serif, used for the second line of two-tone headlines. It is the
// one thing on the page Apple's system never does, and it carries the warmth
// a script face would, at display size and still legible.
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  metadataBase: siteConfig.url,
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
  },
  // The Open Graph image comes from app/opengraph-image.png via the file
  // convention. This only asks X and other summary-card readers to show it
  // large rather than as a thumbnail.
  twitter: { card: "summary_large_image" },
};

// Let the page extend under the home indicator so the phone dock can respect
// env(safe-area-inset-bottom).
export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${serif.variable}`}
      style={{ "--font-inter-name": interFamilyName } as CSSProperties}
    >
      <body>
        <MotionProvider>{children}</MotionProvider>
        <script
          type="application/ld+json"
          // Static, server-built JSON from our own constants; no user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
      </body>
    </html>
  );
}
