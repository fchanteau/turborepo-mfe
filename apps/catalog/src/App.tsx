import "./app.css";
import type { RemoteAppProps } from "@repo/auth";
import { useMemo } from "react";
import { Route, Routes } from "react-router";
import { AuthContext } from "./auth.ts";
import { ProductDetail } from "./pages/ProductDetail.tsx";
import { ProductList } from "./pages/ProductList.tsx";

/**
 * Exposed as `catalog/App`. Routes are relative so it works under any mount path (e.g. /catalog/*).
 * The host passes the signed-in user; pages read it with `useAuth()`.
 */
export default function App({ user, getAccessToken }: RemoteAppProps) {
  const auth = useMemo(() => ({ user, getAccessToken }), [user, getAccessToken]);

  return (
    <AuthContext value={auth}>
      <Routes>
        <Route index element={<ProductList />} />
        <Route path=":productId" element={<ProductDetail />} />
      </Routes>
    </AuthContext>
  );
}
