import "./app.css";
import type { RemoteAppProps } from "@repo/auth";
import { useMemo } from "react";
import { Route, Routes } from "react-router";
import { AuthContext } from "./auth.ts";
import { OrderDetail } from "./pages/OrderDetail.tsx";
import { OrderList } from "./pages/OrderList.tsx";

/**
 * Exposed as `orders/App`. Routes are relative so it works under any mount path (e.g. /orders/*).
 * The host passes the signed-in user; pages read it with `useAuth()`.
 */
export default function App({ user, getAccessToken }: RemoteAppProps) {
  const auth = useMemo(() => ({ user, getAccessToken }), [user, getAccessToken]);

  return (
    <AuthContext value={auth}>
      <Routes>
        <Route index element={<OrderList />} />
        <Route path=":orderId" element={<OrderDetail />} />
      </Routes>
    </AuthContext>
  );
}
