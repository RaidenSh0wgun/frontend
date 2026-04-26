import { request } from "./apiClient";
import type { AuthTokens, LoginPayload, RegisterPayload } from "./types";

export async function loginRequest(payload: LoginPayload): Promise<AuthTokens> {
  return request<AuthTokens>("/token/", {
    method: "POST",
    body: JSON.stringify({
      username: payload.username,
      password: payload.password,
    }),
  });
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthTokens> {
  const requestData = {
    username: payload.username,
    email: payload.email,
    password1: payload.password,
    password2: payload.password,
  };

  return request<AuthTokens>("/register/", {
    method: "POST",
    body: JSON.stringify(requestData),
  });
}

export async function verifyEmailRequest(email: string): Promise<{ message: string }> {
  return request<{ message: string }>("/auth/email/verify/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function confirmEmailVerification(
  uid: string,
  token: string
): Promise<{ message: string }> {
  return request<{ message: string }>("/auth/email/verify/confirm/", {
    method: "POST",
    body: JSON.stringify({ uid, token }),
  });
}
