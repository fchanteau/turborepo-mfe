import { twMerge } from "tailwind-merge";

type ClassValue = string | false | null | undefined;

/** Joins class names and resolves conflicting Tailwind utilities (the last one wins). */
export function cn(...classes: ClassValue[]) {
  return twMerge(classes.filter(Boolean).join(" "));
}
