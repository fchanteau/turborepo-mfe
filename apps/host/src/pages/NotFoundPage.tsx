import { Button, Card } from "@repo/ui";
import { useNavigate } from "react-router";

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Card title="Page not found" footer={<Button onClick={() => navigate("/")}>Go home</Button>}>
      The page you are looking for does not exist.
    </Card>
  );
}
