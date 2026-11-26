import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui";
import { useNavigate } from "react-router";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <section>
      <h1 className="mb-4 font-heading text-2xl font-bold tracking-tight">Welcome</h1>
      <Card>
        <CardHeader>
          <CardTitle>Micro frontend demo</CardTitle>
          <CardDescription>Host shell + independently deployed remotes</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          This shell (host) owns the header, navigation and menu. The catalog and orders apps are separately
          built and deployed, and loaded at runtime with Module Federation. They share React, React Router
          and @repo/ui.
        </CardContent>
        <CardFooter>
          <Button onClick={() => navigate("/catalog")}>Open the catalog</Button>
        </CardFooter>
      </Card>
    </section>
  );
}
