import { request } from "./apiClient";
import type { AdminManagedUser } from "./types";

export async function fetchAdminUsers(params?: {
  search?: string;
  role?: "student" | "teacher" | "all";
}): Promise<AdminManagedUser[]> {
  const query = new URLSearchParams();
  if (params?.search) {
    query.set("search", params.search);
  }
  if (params?.role) {
    query.set("role", params.role);
  }
  const qs = query.toString();
  return request<AdminManagedUser[]>(`/admin/users/${qs ? `?${qs}` : ""}`);
}

export async function fetchAdminUserDetail(userId: number): Promise<AdminManagedUser> {
  return request<AdminManagedUser>(`/admin/users/${userId}/`);
}

export async function updateAdminUser(
  userId: number,
  payload: Partial<Pick<AdminManagedUser, "username" | "full_name" | "is_active" | "role" | "email_verified">> & {
    password?: string;
  }
): Promise<AdminManagedUser> {
  return request<AdminManagedUser>(`/admin/users/${userId}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminUser(userId: number): Promise<void> {
  await request<void>(`/admin/users/${userId}/`, { method: "DELETE" });
}
