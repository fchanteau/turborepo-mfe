import { InteractionRequiredAuthError, type AccountInfo } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import type { AuthUser, GetAccessToken } from "@repo/auth";
import { useCallback, useMemo } from "react";
import { loginRequest } from "./msal.ts";

function toAuthUser(account: AccountInfo): AuthUser {
  const roles = account.idTokenClaims?.roles;
  return {
    id: account.localAccountId,
    name: account.name ?? account.username,
    username: account.username,
    tenantId: account.tenantId,
    roles: Array.isArray(roles) ? roles : [],
  };
}

/** Authentication state and actions of the host, built on MSAL. */
export function useAuth() {
  const { instance, accounts } = useMsal();
  const account = instance.getActiveAccount() ?? accounts[0] ?? null;

  const user = useMemo(() => (account ? toAuthUser(account) : null), [account]);

  const getAccessToken = useCallback<GetAccessToken>(
    async (scopes) => {
      const active = instance.getActiveAccount();
      if (!active) throw new Error("No signed-in user.");
      try {
        const result = await instance.acquireTokenSilent({ scopes, account: active });
        return result.accessToken;
      } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
          // Consent or re-authentication required: the page navigates away and comes back signed in.
          await instance.acquireTokenRedirect({ scopes, account: active });
        }
        throw error;
      }
    },
    [instance],
  );

  const signIn = useCallback(() => instance.loginRedirect(loginRequest), [instance]);
  const signOut = useCallback(() => instance.logoutRedirect({ account: instance.getActiveAccount() }), [instance]);

  return { user, getAccessToken, signIn, signOut };
}
