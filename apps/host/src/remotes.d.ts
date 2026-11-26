// Types for modules exposed by remote micro frontends.
declare module "catalog/App" {
  import type { ComponentType } from "react";
  const App: ComponentType;
  export default App;
}

declare module "orders/App" {
  import type { ComponentType } from "react";
  const App: ComponentType;
  export default App;
}
