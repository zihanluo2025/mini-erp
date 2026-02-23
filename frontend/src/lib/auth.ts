import { Amplify } from "aws-amplify";
import { fetchAuthSession, signInWithRedirect, signOut } from "aws-amplify/auth";

const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!;
const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;

// remove protocol prefix, Amplify needs just the domain part
const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!
  .replace(/^https?:\/\//, "");

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

export async function startHostedLogin() {
  await signInWithRedirect();
}

export async function logout() {
  // clean up cookie to prevent Amplify from trying to refresh the session with an expired token
  document.cookie = "erp_auth=; path=/; max-age=0";
  await signOut();
}

export async function getAccessToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSession();
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