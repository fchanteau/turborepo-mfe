import type { ButtonHTMLAttributes } from "react";
import { cn } from "../cn.ts";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:enabled:bg-primary-hover",
  secondary: "border-border bg-surface text-fg hover:enabled:bg-background",
  ghost: "bg-transparent text-primary hover:enabled:bg-primary-soft",
};

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "cursor-pointer rounded-lg border border-transparent px-4 py-2 font-semibold transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
