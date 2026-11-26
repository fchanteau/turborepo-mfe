import type { BadgeTone } from "@repo/ui";

export type OrderStatus = "pending" | "shipped" | "delivered";

export interface OrderLine {
  product: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  date: string;
  customer: string;
  status: OrderStatus;
  lines: OrderLine[];
}

export const statusTone: Record<OrderStatus, BadgeTone> = {
  pending: "warning",
  shipped: "neutral",
  delivered: "success",
};

export const orderTotal = (order: Order) =>
  order.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);

export const orders: Order[] = [
  {
    id: "ORD-1001",
    date: "2026-11-20",
    customer: "Alice Martin",
    status: "delivered",
    lines: [{ product: "Mechanical keyboard", quantity: 1, unitPrice: 129 }],
  },
  {
    id: "ORD-1002",
    date: "2026-11-24",
    customer: "Bruno Petit",
    status: "shipped",
    lines: [
      { product: "Wireless mouse", quantity: 2, unitPrice: 59 },
      { product: "Mechanical keyboard", quantity: 1, unitPrice: 129 },
    ],
  },
  {
    id: "ORD-1003",
    date: "2026-11-26",
    customer: "Chloé Durand",
    status: "pending",
    lines: [{ product: "27\" 4K monitor", quantity: 1, unitPrice: 449 }],
  },
];
