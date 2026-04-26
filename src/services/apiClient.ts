import type { AuthTokens } from "./types";

const API_BASE_URL = "/api";

const ACCESS_KEY = "quiz_app_access";
const REFRESH_KEY = "quiz_app_refresh";

export function storeAuth(tokens: AuthTokens) {
  localStorage.setItem(ACCESS_KEY, tokens.access);
  localStorage.setItem(REFRESH_KEY, tokens.refresh);
}

export function loadStoredAuth(): AuthTokens | null {
  const access = localStorage.getItem(ACCESS_KEY);
  const refresh = localStorage.getItem(REFRESH_KEY);
  if (!access || !refresh) return null;
  return { access, refresh };
}

export function clearStoredAuth() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export async function request<T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string
): Promise<T> {
  const token = accessToken ?? localStorage.getItem(ACCESS_KEY);
  const headers: HeadersInit = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData) && !("Content-Type" in headers)) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (typeof data === "string") {
        errorMessage = data;
      } else if (data?.detail) {
        errorMessage = data.detail;
      } else if (data?.error) {
        errorMessage = data.error;
      } else if (Object.keys(data || {}).length) {
        errorMessage = JSON.stringify(data);
      }
    } catch {
      const text = await response.text();
      if (text) {
        const snippet = text.replace(/\s+/g, " ").trim();
        errorMessage = snippet.length > 200 ? snippet.slice(0, 200) + "..." : snippet;
      }
    }
    throw new Error(errorMessage || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
