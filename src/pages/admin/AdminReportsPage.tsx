import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchAdminReports, removeAdminReport, updateAdminReport } from "@/services/api";

export default function AdminReportsPage() {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState<"all" | "teacher" | "student">("all");

  const { data: reports, isLoading, isError } = useQuery({
    queryKey: ["admin-reports", roleFilter],
    queryFn: () => fetchAdminReports({ role: roleFilter }),
  });

  const refreshReports = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
  };

  const updateReportMutation = useMutation({
    mutationFn: ({ reportId, isResolved }: { reportId: number; isResolved: boolean }) =>
      updateAdminReport(reportId, { is_resolved: isResolved }),
    onSuccess: refreshReports,
    onError: () => alert("Unable to update report."),
  });

  const removeReportMutation = useMutation({
    mutationFn: (reportId: number) => removeAdminReport(reportId),
    onSuccess: refreshReports,
    onError: () => alert("Unable to remove report."),
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Reports</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Submitted bug reports and problem feedback from students and teachers.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["all", "teacher", "student"] as const).map((role) => (
            <Button
              key={role}
              variant={roleFilter === role ? "secondary" : "outline"}
              onClick={() => setRoleFilter(role)}
            >
              {role === "all" ? "All Reports" : `${role.charAt(0).toUpperCase()}${role.slice(1)} Reports`}
            </Button>
          ))}
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          {isLoading ? (
            <p className="py-16 text-center text-lg text-muted-foreground">Loading reports...</p>
          ) : isError ? (
            <p className="py-16 text-center text-lg text-destructive">Unable to load reports.</p>
          ) : reports?.length ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="rounded-3xl border border-border bg-background p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-semibold text-foreground">{report.title}</h2>
                        <label className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground">
                          <input
                            type="checkbox"
                            checked={report.is_resolved}
                            onChange={(e) =>
                              updateReportMutation.mutate({
                                reportId: report.id,
                                isResolved: e.target.checked,
                              })
                            }
                            disabled={updateReportMutation.isPending}
                            className="h-4 w-4 rounded border-border"
                          />
                          Resolve
                        </label>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{report.category}</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{new Date(report.created_at).toLocaleString()}</p>
                      <p>{report.reporter_username || "Unknown user"}</p>
                      <p>{report.reporter_role}</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-muted p-4 text-sm leading-6 text-foreground">
                    {report.description}
                  </div>

                  {report.reporter_email ? (
                    <p className="mt-4 text-sm text-muted-foreground">{report.reporter_email}</p>
                  ) : null}

                  <div className="mt-5 flex justify-end">
                    <Button
                      variant="destructive"
                      onClick={() => removeReportMutation.mutate(report.id)}
                      disabled={removeReportMutation.isPending}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-lg text-muted-foreground">No reports found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
