import { Outlet, Link, useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ReportsModal from "@/components/ReportsModal";
import AboutUsModal from "@/components/AboutUsModal";
import {
  clearAllNotifications,
  clearNotification,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  updateAdminReport,
} from "@/services/api";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Users,
  BarChart3,
  NotebookPen,
  PanelLeft,
  Shield,
  Bell,
  Mail,
  CalendarClock,
  MessageSquareText,
  AlertCircle,
  MessageSquarePlus,
  Info,
} from "lucide-react";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();
  const isUnverifiedStudent = user?.role === "student" && user.email_verified !== true;
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled: Boolean(user),
  });
  const notificationItems = notifications?.in_app ?? [];
  const notificationCount = notifications?.unread_count ?? 0;
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "colorblind">(() => {
    const stored = localStorage.getItem("app_theme_mode");
    if (stored === "light" || stored === "dark" || stored === "colorblind") {
      return stored;
    }
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      return "dark";
    }
    if (root.classList.contains("colorblind")) {
      return "colorblind";
    }
    if (root.classList.contains("light")) {
      return "light";
    }
    return "light";
  });
  const [reportOpen, setReportOpen] = useState(false);
  const [aboutUsOpen, setAboutUsOpen] = useState(false);

  const syncNotifications = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const markNotificationReadMutation = useMutation({
    mutationFn: ({ notificationId, isRead }: { notificationId: number; isRead: boolean }) =>
      markNotificationRead(notificationId, isRead),
    onSuccess: syncNotifications,
    onError: () => alert("Unable to update notification."),
  });

  const clearNotificationMutation = useMutation({
    mutationFn: (notificationId: number) => clearNotification(notificationId),
    onSuccess: syncNotifications,
    onError: () => alert("Unable to clear notification."),
  });

  const markAllNotificationsReadMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: syncNotifications,
    onError: () => alert("Unable to update notifications."),
  });

  const clearAllNotificationsMutation = useMutation({
    mutationFn: clearAllNotifications,
    onSuccess: syncNotifications,
    onError: () => alert("Unable to clear notifications."),
  });

  const resolveReportFromNotificationMutation = useMutation({
    mutationFn: ({ reportId, isResolved }: { reportId: number; isResolved: boolean }) =>
      updateAdminReport(reportId, { is_resolved: isResolved }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
      syncNotifications();
    },
    onError: () => alert("Unable to update report."),
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "colorblind", "light");
    if (themeMode === "light") {
      root.classList.add("light");
    }
    if (themeMode === "dark") {
      root.classList.add("dark");
    }
    if (themeMode === "colorblind") {
      root.classList.add("colorblind");
    }
    localStorage.setItem("app_theme_mode", themeMode);
  }, [themeMode]);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <SidebarProvider>
      <div className="flex h-dvh w-full overflow-hidden bg-background">
        <Sidebar className="bg-card backdrop-blur-xl border-r border-border">
          <SidebarHeader className="px-5 py-5 bg-card border-b border-border">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <NotebookPen className="text-white" />
              </div>
              <span className="font-black text-2xl bg-primary bg-clip-text text-transparent">
                QuizApp
              </span>
            </Link>
          </SidebarHeader>

          <SidebarContent className="px-3 py-5 bg-card">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/")}>
                  <Link to="/" className="flex items-center gap-3 text-sm">
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {user?.role !== "admin" && !isUnverifiedStudent && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/courses")}>
                      <Link to="/courses" className="flex items-center gap-3 text-sm text-foreground">
                        <BookOpen size={18} />
                        Courses
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/calendar")}>
                      <Link to="/calendar" className="flex items-center gap-3 text-sm text-foreground">
                        <Calendar size={18} />
                        Calendar
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}

              {user?.role === "teacher" && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/students")}>
                      <Link to="/students" className="flex items-center gap-3 text-sm text-foreground">
                        <Users size={18} />
                        Students
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/scores")}>
                      <Link to="/scores" className="flex items-center gap-3 text-sm text-foreground">
                        <BarChart3 size={18} />
                        Quiz Scores
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}

              {user?.role === "admin" && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/admin") && !location.pathname.startsWith("/admin/reports")}>
                      <Link to="/admin" className="flex items-center gap-3 text-sm text-foreground">
                        <Shield size={18} />
                        Admin Panel
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/admin/reports")}>
                      <Link to="/admin/reports" className="flex items-center gap-3 text-sm text-foreground">
                        <AlertCircle size={18} />
                        Reports
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-5 bg-card mt-auto border-t border-border">
            <Link
              to="/profileview"
              className="mb-4 flex items-center gap-3 rounded-2xl bg-background px-3 py-3 transition hover:bg-muted"
            >
              <div className="w-11 h-11 overflow-hidden rounded-full flex items-center justify-center bg-primary text-primary-foreground font-medium text-sm">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={`${user.username}'s profile`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.username?.[0]?.toUpperCase() || "U"
                )}
              </div>
              <div className="min-w-0 ">
                <p className="font-medium text-foreground text-sm truncate">
                  {user?.full_name || user?.username}
                </p>
                <p className="text-xs text-primary font-medium truncate"></p>
                <p className="text-xs text-muted-foreground truncate">@{user?.username}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </Link>

            <button
              onClick={logout}
              className="w-full rounded-xl bg-background hover:bg-destructive transition py-2.5 text-sm font-medium text-foreground hover:text-white border border-border"
            >
              Logout
            </button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex h-full min-w-0 flex-col">
          <header className="sticky top-0 h-14 bg-card border-b border-border backdrop-blur-xl flex items-center px-4 md:px-6 z-20 shrink-0">
            <SidebarTrigger className="mr-3 text-muted-foreground hover:text-foreground">
              <PanelLeft size={20} />
            </SidebarTrigger>
            <div className="flex-1" />
            <select
              value={themeMode}
              onChange={(e) => setThemeMode(e.target.value as "light" | "dark" | "colorblind")}
              className="mr-3 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="colorblind">Color-blind</option>
            </select>
            <div className="flex items-center gap-2">
              {user?.role !== "admin" && (
                <>
                  <button
                    type="button"
                    onClick={() => setReportOpen(true)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    aria-label="Report issue"
                    title="Report issue"
                  >
                    <MessageSquarePlus size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAboutUsOpen(true)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    aria-label="About us"
                    title="About us"
                  >
                    <Info size={18} />
                  </button>
                </>
              )}
              <details className="relative">
                <summary className="relative list-none cursor-pointer rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition">
                  <Bell size={18} />
                  {notificationCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  )}
                </summary>
                <div className="absolute right-0 mt-2 w-96 rounded-2xl border border-border bg-card p-4 shadow-xl">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">Notifications</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => markAllNotificationsReadMutation.mutate()}
                        disabled={!notificationItems.length || markAllNotificationsReadMutation.isPending}
                        className="rounded-lg border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Read all
                      </button>
                      <button
                        type="button"
                        onClick={() => clearAllNotificationsMutation.mutate()}
                        disabled={!notificationItems.length || clearAllNotificationsMutation.isPending}
                        className="rounded-lg border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-3 text-xs text-muted-foreground">
                    <div className="rounded-xl border border-border bg-background p-3">
                      <p className="flex items-center gap-2 text-foreground">
                        <Mail size={14} />
                        <span className="font-medium">Email</span>
                      </p>
                      <p className="mt-1">Invitations, reminders, and result publications</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-3">
                      {user?.role === "admin" ? (
                        <>
                          <p className="flex items-center gap-2 text-foreground">
                            <AlertCircle size={14} />
                            <span className="font-medium">Reports</span>
                          </p>
                          <p className="mt-1">User-submitted issue reports</p>
                          <div className="mt-2 max-h-44 space-y-2 overflow-y-auto pr-1">
                            {notificationItems.length ? (
                              notificationItems.map((item) => (
                                <div
                                  key={item.id}
                                  className={`rounded-xl border p-3 ${
                                    item.is_read ? "border-border bg-background" : "border-primary/30 bg-primary/10"
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                      <p className={item.is_read ? "text-muted-foreground" : "font-medium text-foreground"}>
                                        {item.title}
                                      </p>
                                      {item.created_at ? (
                                        <p className="mt-1 text-[11px] text-muted-foreground">
                                          {new Date(item.created_at).toLocaleString()}
                                        </p>
                                      ) : null}
                                    </div>
                                    <div className="flex shrink-0 items-center gap-1">
                                      {typeof item.metadata?.report_id === "number" ? (
                                        <label className="flex items-center gap-2 rounded-lg border border-border bg-background px-2 py-1 text-[11px] font-medium text-foreground transition hover:bg-muted">
                                          <input
                                            type="checkbox"
                                            onChange={(e) =>
                                              resolveReportFromNotificationMutation.mutate({
                                                reportId: item.metadata?.report_id as number,
                                                isResolved: e.target.checked,
                                              })
                                            }
                                            disabled={resolveReportFromNotificationMutation.isPending}
                                            className="h-4 w-4 rounded border-border"
                                          />
                                          Resolve
                                        </label>
                                      ) : !item.is_read ? (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            markNotificationReadMutation.mutate({
                                              notificationId: item.id,
                                              isRead: true,
                                            })
                                          }
                                          disabled={markNotificationReadMutation.isPending}
                                          className="rounded-lg border border-border bg-background px-2 py-1 text-[11px] font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                          Mark read
                                        </button>
                                      ) : (
                                        <span className="rounded-lg border border-border px-2 py-1 text-[11px] text-muted-foreground">
                                          Read
                                        </span>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => clearNotificationMutation.mutate(item.id)}
                                        disabled={clearNotificationMutation.isPending}
                                        className="rounded-lg border border-border bg-background px-2 py-1 text-[11px] font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                      >
                                        Clear
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-muted-foreground">No reports.</p>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="flex items-center gap-2 text-foreground">
                            <CalendarClock size={14} />
                            <span className="font-medium">In-app</span>
                          </p>
                          <p className="mt-1 flex items-center gap-2">
                            <CalendarClock size={13} />
                            <span>Calendar events for deadlines</span>
                          </p>
                          <p className="mt-1 flex items-center gap-2">
                            <MessageSquareText size={13} />
                            <span>UI feedbacks for submission and status</span>
                          </p>
                          <div className="mt-2 max-h-44 space-y-2 overflow-y-auto pr-1">
                            {notificationItems.length ? (
                              notificationItems.map((item) => (
                                <div
                                  key={item.id}
                                  className={`rounded-xl border p-3 ${
                                    item.is_read ? "border-border bg-background" : "border-primary/30 bg-primary/10"
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                      <p className={item.is_read ? "text-muted-foreground" : "font-medium text-foreground"}>
                                        {item.title}
                                      </p>
                                      {item.created_at ? (
                                        <p className="mt-1 text-[11px] text-muted-foreground">
                                          {new Date(item.created_at).toLocaleString()}
                                        </p>
                                      ) : null}
                                    </div>
                                    <div className="flex shrink-0 items-center gap-1">
                                      {!item.is_read ? (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            markNotificationReadMutation.mutate({
                                              notificationId: item.id,
                                              isRead: true,
                                            })
                                          }
                                          disabled={markNotificationReadMutation.isPending}
                                          className="rounded-lg border border-border bg-background px-2 py-1 text-[11px] font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                          Mark read
                                        </button>
                                      ) : (
                                        <span className="rounded-lg border border-border px-2 py-1 text-[11px] text-muted-foreground">
                                          Read
                                        </span>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => clearNotificationMutation.mutate(item.id)}
                                        disabled={clearNotificationMutation.isPending}
                                        className="rounded-lg border border-border bg-background px-2 py-1 text-[11px] font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                      >
                                        Clear
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-muted-foreground">No in-app notifications yet.</p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
        <ReportsModal open={reportOpen} onOpenChange={setReportOpen} />
        <AboutUsModal open={aboutUsOpen} onOpenChange={setAboutUsOpen} />
      </div>
    </SidebarProvider>
  );
}
