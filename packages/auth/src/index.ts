/*
 * Authentication contract between the host and the remote micro frontends.
 * Types only: the host owns authentication (MSAL) and passes these values to each remote's
 * exposed App as props. Remotes never depend on MSAL.
 */

/** Signed-in user, as provided by the host. */
export interface AuthUser {
  /** Object ID of the user in Microsoft Entra ID (`oid` claim). */
  id: string;
  /** Display name (`name` claim). */
  name: string;
  /** Sign-in name, usually the email address (`preferred_username` claim). */
  username: string;
  /** Tenant ID of the user (`tid` claim). */
  tenantId: string;
  /** App roles assigned to the user (`roles` claim). Empty when none. */
  roles: string[];
}

/** Acquires an access token for the given scopes, e.g. `["User.Read"]`. */
export type GetAccessToken = (scopes: string[]) => Promise<string>;

/** Props received by every remote's exposed `./App` module. */
export interface RemoteAppProps {
  user: AuthUser;
  getAccessToken: GetAccessToken;
}
