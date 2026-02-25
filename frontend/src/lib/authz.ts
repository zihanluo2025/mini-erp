// src/lib/authz.ts
// Comments in English.

import { getIdToken } from "@/lib/auth";

export type Role = "admin" | "user";

function base64UrlDecode(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = "=".repeat((4 - (base64.length % 4)) % 4);
  return atob(base64 + pad);
}

function decodeJwtPayload(token: string): any {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  return JSON.parse(base64UrlDecode(parts[1]));
}

export async function getGroups(): Promise<string[]> {
  const idToken = await getIdToken();
  if (!idToken) return [];

  const payload = decodeJwtPayload(idToken);
  const groups = payload?.["cognito:groups"] ?? [];
  return Array.isArray(groups) ? groups : [];
}

export async function isAdmin(): Promise<boolean> {
  const groups = await getGroups();
  return groups.map((g) => String(g).toLowerCase()).includes("admin");
}