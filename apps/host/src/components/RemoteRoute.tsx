import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ErrorBoundary,
  Spinner,
} from "@repo/ui";
import type { RemoteAppProps } from "@repo/auth";
import { Suspense, type ComponentType } from "react";
import { useAuth } from "../auth/useAuth.ts";

export interface RemoteRouteProps {
  /** Display name used in the loading and error messages. */
  name: string;
  /** Remote component, typically `lazy(() => import("remote/App"))`. */
  component: ComponentType<RemoteAppProps>;
}

function RemoteUnavailable({ name }: { name: string }) {
  return (
    <Card className="ring-destructive/30">
      <CardHeader>
        <CardTitle>{name} is unavailable</CardTitle>
        <CardDescription>The micro frontend could not be loaded.</CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground">Make sure it is running, then retry.</CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </CardFooter>
    </Card>
  );
}

function RemoteLoading({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
      <Spinner />
      Loading {name.toLowerCase()}…
    </div>
  );
}

/**
 * Renders a federated micro frontend, isolating loading states and failures from the host shell.
 * Passes the signed-in user and a token getter to the remote (see `RemoteAppProps` in @repo/auth).
 */
export function RemoteRoute({ name, component: Remote }: RemoteRouteProps) {
  const { user, getAccessToken } = useAuth();
  // Remote routes are only rendered for signed-in users (AuthenticatedTemplate in App.tsx).
  if (!user) return null;

  return (
    <ErrorBoundary fallback={<RemoteUnavailable name={name} />}>
      <Suspense fallback={<RemoteLoading name={name} />}>
        <Remote user={user} getAccessToken={getAccessToken} />
      </Suspense>
    </ErrorBoundary>
  );
}
