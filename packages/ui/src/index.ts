/*
 * Public API of @repo/ui. Apps must import from "@repo/ui" only: Module Federation shares this
 * entry as a singleton, whereas deep imports would not be shared between host and remotes.
 * Export every component added with `pnpm --filter @repo/ui ui:add <name>` here.
 */
export { cn } from "#lib/utils";

export { Badge, badgeVariants } from "#components/badge";
export { Button, buttonVariants } from "#components/button";
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#components/card";
export { Spinner } from "#components/spinner";

export { ErrorBoundary } from "#components/error-boundary";
export type { ErrorBoundaryProps } from "#components/error-boundary";
