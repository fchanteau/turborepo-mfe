import { Badge, Button, Card } from "@repo/ui";
import { useNavigate, useParams } from "react-router";
import { orders, orderTotal, statusTone } from "../data.ts";

export function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = orders.find((o) => o.id === orderId);
  const back = () => navigate("..", { relative: "path" });

  if (!order) {
    return (
      <Card title="Order not found" footer={<Button onClick={back}>Back to orders</Button>}>
        No order matches “{orderId}”.
      </Card>
    );
  }

  return (
    <Card
      title={`Order ${order.id}`}
      footer={
        <>
          <Button variant="ghost" onClick={back}>
            ← Back
          </Button>
          <strong>Total: {orderTotal(order)} €</strong>
        </>
      }
    >
      <p className="mb-2">
        {order.customer} · {order.date} · <Badge tone={statusTone[order.status]}>{order.status}</Badge>
      </p>
      <ul className="list-disc pl-5">
        {order.lines.map((line) => (
          <li key={line.product}>
            {line.quantity} × {line.product} — {line.quantity * line.unitPrice} €
          </li>
        ))}
      </ul>
    </Card>
  );
}
