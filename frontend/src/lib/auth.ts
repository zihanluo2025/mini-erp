import { Amplify } from "aws-amplify";
import {
  fetchAuthSession,
  signInWithRedirect,
  signOut,
} from "aws-amplify/auth";

const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!;
const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;

// remove protocol prefix, Amplify needs just the domain part
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

/**
 * Check if there is a valid signed-in session.
 * If tokens exist, user is considered signed in.
 */
export async function isSignedIn(): Promise<boolean> {
  try {
    const session = await fetchAuthSession();
    return !!session.tokens?.idToken;
  } catch {
    return false;
  }
}

/**
 * Start Cognito Hosted UI login.
 * IMPORTANT: Avoid calling redirect login when user is already signed in,
 * otherwise Amplify may throw UserAlreadyAuthenticatedException.
 */
export async function startHostedLogin(options?: { redirectTo?: string }) {
  const signedIn = await isSignedIn();

  // Already signed in → go directly to app, no redirect login
  if (signedIn) {
    window.location.href = options?.redirectTo ?? "/dashboard";
    return;
  }

  // Not signed in → start hosted UI
  await signInWithRedirect();
}

/**
 * Sign out user.
 * - Clear app cookie (if you use it for your own session marker)
 * - Use global signOut to clear Cognito-side session too (cleaner re-login UX)
 */
export async function logout() {
  // clean up cookie to prevent Amplify from trying to refresh the session with an expired token
  document.cookie = "erp_auth=; path=/; max-age=0";

  // global: true clears the Cognito session as well
  await signOut({ global: true });
}

/**
 * Get access token for calling backend APIs.
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.accessToken?.toString() ?? null;
  } catch {
    return null;
  }
}

/**
 * Wait for token to appear (e.g., right after redirect callback).
 */
export async function waitForToken(maxMs = 4000): Promise<string | null> {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    const token = await getAccessToken();
    if (token) return token;
    await new Promise((r) => setTimeout(r, 200));
  }
  return null;
}