import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../cn.ts";

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  footer?: ReactNode;
}

export function Card({ title, footer, children, className, ...props }: CardProps) {
  return (
    <article className={cn("flex flex-col gap-3 rounded-lg border border-border bg-surface p-4", className)} {...props}>
      {title && <header className="text-lg font-bold">{title}</header>}
      <div className="flex-1 text-muted">{children}</div>
      {footer && <footer className="flex items-center justify-between gap-2">{footer}</footer>}
    </article>
  );
}
