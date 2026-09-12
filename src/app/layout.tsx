import type { Metadata, Viewport } from "next";
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
};

// Let the page extend under the home indicator so the phone dock can respect
// env(safe-area-inset-bottom).
export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable}`}>
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
