import { getAccessToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

type Query = Record<string, string | number | boolean | null | undefined>;

function withQuery(path: string, query?: Query) {
  if (!query) return path;

  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === null || v === undefined) continue;
    const s = String(v);
    if (s.length === 0) continue;
    sp.set(k, s);
  }
  const qs = sp.toString();
  return qs ? `${path}?${qs}` : path;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  query?: Query
): Promise<T> {
  const token = await getAccessToken();

  const res = await fetch(`${API_BASE}${withQuery(path, query)}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }

  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
}