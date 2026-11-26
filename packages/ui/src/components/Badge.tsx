import type { HTMLAttributes } from "react";
import { cn } from "../cn.ts";

export type BadgeTone = "neutral" | "success" | "warning";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const tones: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-muted",
  success: "bg-green-100 text-green-800",
  warning: "bg-amber-100 text-amber-800",
};

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-semibold", tones[tone], className)}
      {...props}
    />
  );
}
