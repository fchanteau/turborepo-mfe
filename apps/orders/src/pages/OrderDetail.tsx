import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui";
import { useNavigate, useParams } from "react-router";
import { orders, orderTotal, statusVariant } from "../data.ts";

export function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = orders.find((o) => o.id === orderId);
  const back = () => navigate("..", { relative: "path" });

  if (!order) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order not found</CardTitle>
          <CardDescription>No order matches “{orderId}”.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={back}>Back to orders</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order {order.id}</CardTitle>
        <CardDescription>
          {order.customer} · {order.date}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-3">
        <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
        <ul className="list-disc pl-5">
          {order.lines.map((line) => (
            <li key={line.product}>
              {line.quantity} × {line.product} — {line.quantity * line.unitPrice} €
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="ghost" onClick={back}>
          ← Back
        </Button>
        <strong>Total: {orderTotal(order)} €</strong>
      </CardFooter>
    </Card>
  );
}
