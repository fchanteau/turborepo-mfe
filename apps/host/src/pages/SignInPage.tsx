import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui";
import { useAuth } from "../auth/useAuth.ts";

export function SignInPage() {
  const { signIn } = useAuth();

  return (
    <Card className="mx-auto mt-12 max-w-md">
      <CardHeader>
        <CardTitle>Sign in required</CardTitle>
        <CardDescription>Use your Microsoft work account to access the application.</CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        After signing in, your identity is shared with every micro frontend loaded in this shell.
      </CardContent>
      <CardFooter>
        <Button onClick={() => signIn()}>Sign in with Microsoft</Button>
      </CardFooter>
    </Card>
  );
}
