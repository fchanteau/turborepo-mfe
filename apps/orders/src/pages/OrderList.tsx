import { Badge, Button, Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui";
import { useNavigate } from "react-router";
import { useAuth } from "../auth.ts";
import { orders, orderTotal, statusVariant } from "../data.ts";

export function OrderList() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section>
      <h1 className="font-heading text-2xl font-bold tracking-tight">Orders</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Signed in as {user.name} ({user.username})
      </p>
      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle>
                {order.id} — {order.customer}
              </CardTitle>
              <CardDescription>
                {order.date} · {order.lines.length} item(s) · {orderTotal(order)} €
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-between">
              <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
              <Button variant="outline" onClick={() => navigate(order.id)}>
                View order
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
