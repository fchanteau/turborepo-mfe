import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui";
import { useNavigate } from "react-router";

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Page not found</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">The page you are looking for does not exist.</CardContent>
      <CardFooter>
        <Button onClick={() => navigate("/")}>Go home</Button>
      </CardFooter>
    </Card>
  );
}
