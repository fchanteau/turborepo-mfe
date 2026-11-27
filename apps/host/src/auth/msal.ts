import {
  EventType,
  PublicClientApplication,
  type AuthenticationResult,
  type Configuration,
  type RedirectRequest,
} from "@azure/msal-browser";

// Absolute URL of the host, including the Vite base (e.g. https://<owner>.github.io/<repo>/).
const appUrl = new URL(import.meta.env.BASE_URL, window.location.origin);
// Redirect bridge page (redirect.html). Register this URL as a "Single-page application" redirect URI.
export const redirectUri = new URL("redirect.html", appUrl).href;

const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MSAL_TENANT_ID}`,
    redirectUri,
    postLogoutRedirectUri: redirectUri,
  },
};

/** Scopes requested at sign-in. */
export const loginRequest: RedirectRequest = { scopes: ["User.Read"] };

/** Creates and initializes the MSAL instance. Must complete before rendering `MsalProvider`. */
export async function createMsalInstance() {
  const instance = new PublicClientApplication(msalConfig);
  await instance.initialize();

  const [firstAccount] = instance.getAllAccounts();
  if (!instance.getActiveAccount() && firstAccount) {
    instance.setActiveAccount(firstAccount);
  }

  instance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      instance.setActiveAccount((event.payload as AuthenticationResult).account);
    }
  });

  return instance;
}
