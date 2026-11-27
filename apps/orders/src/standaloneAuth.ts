import type { AuthUser, GetAccessToken } from "@repo/auth";

// Standalone mode has no host, hence no authentication: use a placeholder user for development.
export const standaloneUser: AuthUser = {
  id: "00000000-0000-0000-0000-000000000000",
  name: "Standalone User",
  username: "standalone@localhost",
  tenantId: "",
  roles: [],
};

export const standaloneGetAccessToken: GetAccessToken = () =>
  Promise.reject(new Error("Access tokens are only available when running inside the host."));
