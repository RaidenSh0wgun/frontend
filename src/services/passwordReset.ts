import { request } from "./apiClient";
import type { PasswordResetConfirmPayload, PasswordResetRequestPayload } from "./types";

export async function requestPasswordReset(
  payload: PasswordResetRequestPayload
): Promise<{ message: string }> {
  return request<{ message: string }>("/auth/password/reset/", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email,
      frontend_url: payload.frontend_url || window.location.origin,
    }),
  });
}

export async function confirmPasswordReset(
  payload: PasswordResetConfirmPayload
): Promise<{ message: string }> {
  return request<{ message: string }>("/auth/password/reset/confirm/", {
    method: "POST",
    body: JSON.stringify({
      uid: payload.uid,
      token: payload.token,
      new_password: payload.new_password,
    }),
  });
}
