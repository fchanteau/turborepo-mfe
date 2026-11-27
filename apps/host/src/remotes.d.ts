// Types for modules exposed by remote micro frontends.
// Every remote App receives the signed-in user from the host (see RemoteAppProps in @repo/auth).
declare module "catalog/App" {
  import type { ComponentType } from "react";
  import type { RemoteAppProps } from "@repo/auth";
  const App: ComponentType<RemoteAppProps>;
  export default App;
}

declare module "orders/App" {
  import type { ComponentType } from "react";
  import type { RemoteAppProps } from "@repo/auth";
  const App: ComponentType<RemoteAppProps>;
  export default App;
}
