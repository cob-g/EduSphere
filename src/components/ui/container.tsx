import type { ComponentPropsWithoutRef, ElementType } from "react";

type ContainerProps<T extends ElementType> = { as?: T; className?: string } & Omit<
  ComponentPropsWithoutRef<T>,
  "as" | "className"
>;

// Site-width wrapper (1180px max, 22px gutters). Replaces `.wrap` from the reference.
export function Container<T extends ElementType = "div">({
  as,
  className = "",
  ...props
}: ContainerProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  return <Tag className={`container-site ${className}`} {...props} />;
}
