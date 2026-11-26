import { lazy } from "react";
import { Route, Routes } from "react-router";
import { Header } from "./components/Header.tsx";
import { Menu } from "./components/Menu.tsx";
import { RemoteRoute } from "./components/RemoteRoute.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";
import { SettingsPage } from "./pages/SettingsPage.tsx";

const CatalogApp = lazy(() => import("catalog/App"));
const OrdersApp = lazy(() => import("orders/App"));

export function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Menu />
        <main className="max-w-[1100px] flex-1 p-6">
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="catalog/*" element={<RemoteRoute name="Catalog" component={CatalogApp} />} />
            <Route path="orders/*" element={<RemoteRoute name="Orders" component={OrdersApp} />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
