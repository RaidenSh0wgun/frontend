import { request } from "./apiClient";
import type { NotificationItem } from "./types";

export async function markNotificationRead(notificationId: number, isRead: boolean): Promise<NotificationItem> {
  return request<NotificationItem>(`/notifications/${notificationId}/`, {
    method: "PATCH",
    body: JSON.stringify({ is_read: isRead }),
  });
}

export async function clearNotification(notificationId: number): Promise<void> {
  await request<void>(`/notifications/${notificationId}/`, {
    method: "DELETE",
  });
}

export async function markAllNotificationsRead(): Promise<{ updated: number }> {
  return request<{ updated: number }>("/notifications/", {
    method: "PATCH",
  });
}

export async function clearAllNotifications(): Promise<{ removed: number }> {
  return request<{ removed: number }>("/notifications/", {
    method: "DELETE",
  });
}
