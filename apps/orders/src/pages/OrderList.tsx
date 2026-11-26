import { Badge, Button, Card } from "@repo/ui";
import { useNavigate } from "react-router";
import { orders, orderTotal, statusTone } from "../data.ts";

export function OrderList() {
  const navigate = useNavigate();

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Orders</h1>
      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <Card
            key={order.id}
            title={`${order.id} — ${order.customer}`}
            footer={
              <>
                <Badge tone={statusTone[order.status]}>{order.status}</Badge>
                <Button variant="secondary" onClick={() => navigate(order.id)}>
                  View order
                </Button>
              </>
            }
          >
            {order.date} · {order.lines.length} item(s) · {orderTotal(order)} €
          </Card>
        ))}
      </div>
    </section>
  );
}
