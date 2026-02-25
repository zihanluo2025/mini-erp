import { Amplify } from "aws-amplify";
import {
  fetchAuthSession,
  signInWithRedirect,
  signOut,
} from "aws-amplify/auth";

const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!;
const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;

const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!.replace(
  /^https?:\/\//,
  ""
);

const redirectSignIn = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGNIN!;
const redirectSignOut = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGNOUT!;

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId,
      loginWith: {
        oauth: {
          domain,
          scopes: ["openid", "email", "profile"],
          redirectSignIn: [redirectSignIn],
          redirectSignOut: [redirectSignOut],
          responseType: "code",
        },
      },
    },
  },
});

function decodeJwtPayload(token: string): unknown | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function isSignedIn(): Promise<boolean> {
  try {

    const session = await fetchAuthSession({ forceRefresh: true });
    const idToken = session.tokens?.idToken?.toString();
    if (!idToken) return false;

   
    const payload = decodeJwtPayload(idToken);
    const exp = payload?.exp;
    if (typeof exp !== "number") return false;

    const nowSec = Math.floor(Date.now() / 1000);

    return exp > nowSec + 30;
  } catch {
    return false;
  }
}

export async function startHostedLogin(options?: { redirectTo?: string }) {
  const signedIn = await isSignedIn();
  if (signedIn) {
    window.location.href = options?.redirectTo ?? "/dashboard";
    return;
  }


  await signInWithRedirect();
}

export async function logout() {
  document.cookie = "erp_auth=; path=/; max-age=0";
  await signOut({ global: true });
}

export async function getAccessToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSession({ forceRefresh: true });
    return session.tokens?.accessToken?.toString() ?? null;
  } catch {
    return null;
  }
}

export async function waitForToken(maxMs = 4000): Promise<string | null> {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    const token = await getAccessToken();
    if (token) return token;
    await new Promise((r) => setTimeout(r, 200));
  }
  return null;
}