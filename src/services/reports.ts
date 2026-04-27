import { request } from "./apiClient";
import type { AdminReport } from "./types";

export async function submitReport(payload: { title: string; description: string; category: string }): Promise<void> {
  await request<void>("/reports/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchAdminReports(params?: { role?: "all" | "teacher" | "student" }) {
  const query = new URLSearchParams();
  if (params?.role) {
    query.set("role", params.role);
  }
  const queryString = query.toString();
  return request<AdminReport[]>(`/reports/${queryString ? `?${queryString}` : ""}`);
}

export async function updateAdminReport(
  reportId: number,
  payload: { is_resolved?: boolean; is_removed?: boolean }
): Promise<AdminReport> {
  return request<AdminReport>(`/reports/${reportId}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function removeAdminReport(reportId: number): Promise<void> {
  await request<void>(`/reports/${reportId}/`, {
    method: "DELETE",
  });
}
