import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { MotionProvider } from "@/components/motion/motion-provider";
import { siteConfig } from "@/lib/constants/site";

import "./globals.css";

// Inter (fora.so's typeface). Variable font with the optical-size axis so
// large display headlines render with Inter Display's tighter forms.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  axes: ["opsz"],
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
