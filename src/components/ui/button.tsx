import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "ghost" | "link";
type Size = "sm" | "md";

type ButtonProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  /** Adds a trailing arrow that nudges right on hover. */
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">;

// Monochrome pill buttons. Colours are driven by the nearest `[data-theme]`
// ancestor so the same component works on light and dark sections:
//   primary  -> black on light, white on dark (fora.so / Apple CTA)
//   ghost    -> translucent glass pill (fora.so "Get started")
//   link     -> text-only with arrow (Apple "Learn more ›")
const base =
  "group inline-flex items-center justify-center gap-2 rounded-pill font-medium " +
  "transition-[transform,background-color,color,border-color] duration-200 ease-apple " +
  "hover:-translate-y-px active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-current";

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-12 px-6 text-[15px]",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-white hover:bg-black " +
    "[[data-theme=dark]_&]:bg-white [[data-theme=dark]_&]:text-ink [[data-theme=dark]_&]:hover:bg-paper",
  ghost:
    "border border-black/10 bg-black/[0.04] text-ink backdrop-blur-md hover:bg-black/[0.08] " +
    "[[data-theme=dark]_&]:border-white/15 [[data-theme=dark]_&]:bg-white/10 " +
    "[[data-theme=dark]_&]:text-white [[data-theme=dark]_&]:hover:bg-white/15",
  link: "h-auto px-1 text-ink hover:opacity-70 [[data-theme=dark]_&]:text-white",
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  arrow = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`${base} ${variant === "link" ? "" : sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-200 ease-apple group-hover:translate-x-0.5"
        />
      )}
    </Link>
  );
}
