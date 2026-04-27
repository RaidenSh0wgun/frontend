import { request } from "./apiClient";
import type { User } from "./types";

export async function fetchCurrentUser(accessToken?: string): Promise<User> {
  return request<User>("/users/me/", {}, accessToken);
}

export async function updateCurrentUser(
  payload:
    | FormData
    | (Partial<Pick<User, "username" | "email" | "full_name" | "bio" | "sex">> & {
        avatar_url?: File | null;
      })
): Promise<User> {
  const isFormData = payload instanceof FormData;
  return request<User>("/users/me/", {
    method: "PATCH",
    body: isFormData ? payload : JSON.stringify(payload),
    headers: isFormData ? {} : { "Content-Type": "application/json" },
  });
}
