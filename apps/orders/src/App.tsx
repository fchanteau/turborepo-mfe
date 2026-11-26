import "./app.css";
import { Route, Routes } from "react-router";
import { OrderDetail } from "./pages/OrderDetail.tsx";
import { OrderList } from "./pages/OrderList.tsx";

/** Exposed as `orders/App`. Routes are relative so it works under any mount path (e.g. /orders/*). */
export default function App() {
  return (
    <Routes>
      <Route index element={<OrderList />} />
      <Route path=":orderId" element={<OrderDetail />} />
    </Routes>
  );
}
