import type { RemoteAppProps } from "@repo/auth";
import { createContext, use } from "react";

/** Authentication received from the host (or the standalone entry) through the App props. */
export const AuthContext = createContext<RemoteAppProps | null>(null);

export function useAuth() {
  const auth = use(AuthContext);
  if (!auth) throw new Error("useAuth must be used inside the remote App.");
  return auth;
}
