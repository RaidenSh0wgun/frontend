import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  updateCurrentUser,
  verifyEmailRequest,
  fetchEnrolledCourses,
  fetchMyCourses,
  type Course,
} from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, refreshUser, setUserState, setAvatarPreviewUrl } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [sex, setSex] = useState("");
  const [status, setStatus] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [avatarRemoving, setAvatarRemoving] = useState(false);

  const isTeacher = user?.role === "teacher";
  const shouldShowCourses = user?.role !== "student" || Boolean(user?.email_verified);
  const { data: courseList, isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ["profile-courses", user?.role, user?.email_verified],
    queryFn: isTeacher ? fetchMyCourses : fetchEnrolledCourses,
    enabled: Boolean(user) && shouldShowCourses,
  });

  useEffect(() => {
    if (!user) return;
    setFullName(user.full_name ?? "");
    setEmail(user.email ?? "");
    setBio(user.bio ?? "");
    setSex(user.sex ?? "");
    setAvatarPreview(null);
    setAvatarFile(null);
    setAvatarPreviewUrl(null);
    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
  }, [user, setAvatarPreviewUrl]);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      setAvatarPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(objectUrl);
    setAvatarPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [avatarFile, setAvatarPreviewUrl]);

  const profileTitle = useMemo(() => {
    if (user?.role === "teacher") return "Teacher Profile";
    if (user?.role === "admin") return "Admin Profile";
    return "Student Profile";
  }, [user]);

  const profileSubtitle = useMemo(() => {
    if (user?.role === "teacher") {
      return "View and update your teacher profile, courses, and account settings.";
    }
    if (user?.role === "admin") {
      return "View and update your admin profile, settings, and account details.";
    }
    return "View and update your student profile, settings, and account details.";
  }, [user]);

  const currentAvatarSrc = avatarPreview || user?.avatar_url;
  const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  const clearAvatarSelection = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarPreviewUrl(null);
    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    setStatus(null);

    if (avatarFile) {
      clearAvatarSelection();
      return;
    }

    if (!user?.avatar_url) {
      return;
    }

    setAvatarRemoving(true);
    try {
      const updatedUser = await updateCurrentUser({ avatar_url: null });
      setUserState(updatedUser);
      await refreshUser();
      clearAvatarSelection();
      setStatus({ message: "Profile image removed.", type: "success" });
      setTimeout(() => setStatus(null), 4000);
    } catch (err) {
      let errorMessage = "Could not remove profile image. Please try again.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setStatus({ message: errorMessage, type: "error" });
    } finally {
      setAvatarRemoving(false);
    }
  };

  const handleSave = async () => {
    setStatus(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", user?.username || "");
      formData.append("email", email.trim());
      formData.append("full_name", fullName.trim());
      formData.append("bio", bio.trim());
      formData.append("sex", sex);
      if (avatarFile) {
        formData.append("avatar_url", avatarFile);
      }

      const updatedUser = await updateCurrentUser(formData);
      setUserState(updatedUser);
      await refreshUser();
      clearAvatarSelection();
      setStatus({ message: "Profile saved successfully.", type: "success" });
      setTimeout(() => setStatus(null), 4000);
    } catch (err) {
      let errorMessage = "Could not save profile. Please try again.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setStatus({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!email) {
      setStatus({ message: "Enter your email address first to request verification.", type: "error" });
      return;
    }
    setVerifyLoading(true);
    setStatus(null);
    try {
      await verifyEmailRequest(email);
      setStatus({ message: "Verification link sent to your email.", type: "success" });
      setTimeout(() => setStatus(null), 4000);
    } catch {
      setStatus({ message: "Failed to send verification email. Please try again.", type: "error" });
    } finally {
      setVerifyLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <h1 className="text-4xl font-bold text-[#1E293B]">{profileTitle}</h1>
                <Button
                  variant="outline"
                  onClick={() => navigate("/profileview")}
                  className="mt-4 sm:mt-0 rounded-2xl border-slate-300 px-5 py-3 text-sm"
                >
                  Back
                </Button>
              </div>
              <p className="mt-2 text-base text-muted-foreground">{profileSubtitle}</p>
            </div>

            <div className="flex flex-col items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-background shadow-xl ring-1 ring-border hover:ring-2 hover:ring-ring transition-all"
                  >
                    {currentAvatarSrc ? (
                      <img
                        src={currentAvatarSrc}
                        alt={`${user.username}'s profile`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl text-white font-medium">
                        {user.username[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </button>
                </DialogTrigger>

                {currentAvatarSrc && (
                  <DialogContent className="bg-transparent p-0 shadow-none sm:max-w-[480px] border-none">
                    <div className="relative w-full aspect-square overflow-hidden rounded-3xl bg-slate-950">
                      <img
                        src={currentAvatarSrc}
                        alt={`${user.username}'s profile`}
                        className="w-full h-full object-cover"
                      />
                      <DialogClose className="absolute top-4 right-4 rounded-full bg-black/70 hover:bg-black px-6 py-2 text-sm text-white transition">
                        Close
                      </DialogClose>
                    </div>
                  </DialogContent>
                )}
              </Dialog>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your display name"
                className="w-full rounded-2xl border border-input bg-background px-5 py-4 text-base focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Email</label>
              <input
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-input bg-background px-5 py-4 text-base focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2 lg:col-span-2">
              <label className="block text-sm font-semibold text-foreground">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={
                  user.role === "teacher"
                    ? "Share a short teacher bio or your teaching focus."
                    : "Tell us a little about yourself."
                }
                className="w-full min-h-[140px] rounded-2xl border border-input bg-background px-5 py-4 text-base focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2 lg:col-span-2">
              <label className="block text-sm font-semibold text-foreground">Profile Picture</label>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (!file) {
                    setAvatarFile(null);
                    return;
                  }
                  if (file.size > 50 * 1024 * 1024) {
                    setStatus({ message: "Image exceeds 50 MB limit.", type: "error" });
                    e.currentTarget.value = "";
                    return;
                  }
                  if (!allowedImageTypes.includes(file.type)) {
                    setStatus({ message: "Unsupported image type.", type: "error" });
                    e.currentTarget.value = "";
                    return;
                  }
                  setAvatarFile(file);
                }}
                className="w-full rounded-2xl border border-input bg-background px-5 py-4 text-base file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {avatarFile && (
                  <p className="text-xs text-muted-foreground">
                    New image selected: <span className="font-medium">{avatarFile.name}</span>
                  </p>
                )}
                {(avatarFile || user.avatar_url) && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRemoveAvatar}
                    disabled={avatarRemoving || loading}
                    className="w-full sm:w-auto rounded-2xl border-slate-300 px-5 py-3 text-sm"
                  >
                    {avatarRemoving ? "Removing..." : avatarFile ? "Clear selected image" : "Remove profile image"}
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Sex</label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                className="w-full rounded-2xl border border-input bg-background px-5 py-4 text-base focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="w-full sm:w-auto py-6 text-lg font-medium bg-[#6366F1] hover:bg-[#4F46E5]"
            >
              {loading ? "Saving..." : "Save Profile"}
            </Button>

            {!user.email_verified && (
              <Button
                variant="outline"
                onClick={handleVerifyEmail}
                disabled={verifyLoading}
                className="w-full sm:w-auto py-6 text-lg"
              >
                {verifyLoading ? "Sending..." : "Send verification email"}
              </Button>
            )}
          </div>

          {status && (
            <div className={`mt-6 rounded-2xl border px-5 py-4 text-sm ${
              status.type === "success"
                ? "border-green-500/30 bg-green-500/10 text-green-400"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}>
              {status.message}
            </div>
          )}
        </div>

        {shouldShowCourses ? (
          coursesLoading ? (
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground">
                {user.role === "teacher" ? "Your Courses" : "Enrolled Courses"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Loading courses...
              </p>
            </div>
          ) : courseList?.length ? (
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground">
                {user.role === "teacher" ? "Your Courses" : "Enrolled Courses"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {user.role === "teacher"
                  ? "These courses are associated with your teacher profile."
                  : "These are the courses you are enrolled in."}
              </p>
              <div className="mt-6 grid gap-4">
                {courseList.map((course) => (
                  <div key={course.id} className="rounded-2xl border border-border bg-background px-5 py-4 text-sm text-foreground">
                    <div className="font-semibold">{course.title}</div>
                    {course.description && <div className="text-slate-500 mt-1">{course.description}</div>}
                  </div>
                ))}
              </div>
            </div>
          ) : null
        ) : null}

        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-foreground">Account settings</h2>
          <div className="mt-6 space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            <p>
              <strong>Email verification:</strong> {user.email_verified ? "Verified" : "Not verified"}
            </p>
            <p>
              <strong>Password reset:</strong> Password reset requests are blocked until your email is verified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
