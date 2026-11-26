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
import { Suspense, type ComponentType } from "react";

export interface RemoteRouteProps {
  /** Display name used in the loading and error messages. */
  name: string;
  /** Remote component, typically `lazy(() => import("remote/App"))`. */
  component: ComponentType;
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

/** Renders a federated micro frontend, isolating loading states and failures from the host shell. */
export function RemoteRoute({ name, component: Remote }: RemoteRouteProps) {
  return (
    <ErrorBoundary fallback={<RemoteUnavailable name={name} />}>
      <Suspense fallback={<RemoteLoading name={name} />}>
        <Remote />
      </Suspense>
    </ErrorBoundary>
  );
}
