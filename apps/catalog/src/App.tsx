import "./app.css";
import { Route, Routes } from "react-router";
import { ProductDetail } from "./pages/ProductDetail.tsx";
import { ProductList } from "./pages/ProductList.tsx";

/** Exposed as `catalog/App`. Routes are relative so it works under any mount path (e.g. /catalog/*). */
export default function App() {
  return (
    <Routes>
      <Route index element={<ProductList />} />
      <Route path=":productId" element={<ProductDetail />} />
    </Routes>
  );
}
