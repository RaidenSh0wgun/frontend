export type Role = "student" | "teacher" | "admin";

export type QuestionType = "identification" | "enumeration" | "mcq" | "tf";

export interface User {
  id: number;
  username: string;
  email?: string;
  role: Role;
  full_name?: string;
  bio?: string;
  sex?: string;
  avatar_url?: string;
  email_verified?: boolean;
  courses?: string[];
  enrolled_courses?: string[];
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  email?: string;
}

export interface Course {
  id: number;
  title: string;
  description?: string;
  is_active?: boolean;
  is_enrolled?: boolean;
  author?: number;
  author_name?: string;
  passkey?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type ListResponse<T> = T[] | { results?: T[] };

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Quiz {
  id: number;
  title: string;
  course: number;
  description?: string;
  duration_minutes: number;
  is_active?: boolean;
  due_date?: string | null;
  has_attempted?: boolean;
  show_scores_after_quiz?: boolean;
  question_count?: number;
}

export interface QuestionChoice {
  id: number;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  question_type: QuestionType;
  answer_format?: string;
  correct_text?: string;
  choices: QuestionChoice[];
}

export interface QuizDetail extends Quiz {
  questions: Question[];
  has_attempted?: boolean;
}

export interface QuizAttemptScore {
  id: number;
  score: number;
  total: number;
  effective_score?: number;
  created_at?: string;
}

export interface QuizViewResponse {
  quiz: Quiz;
  attempt: QuizAttemptScore | null;
}

export interface QuizChoicePayload {
  text: string;
  is_correct?: boolean;
}

export interface QuizQuestionPayload {
  text: string;
  question_type: QuestionType;
  answer_format?: string;
  correct_text?: string;
  choices: QuizChoicePayload[];
}

export interface QuizCreatePayload {
  title: string;
  description?: string;
  duration_minutes: number;
  course: number;
  due_date?: string | null;
  show_scores_after_quiz?: boolean;
  questions?: QuizQuestionPayload[];
}

export interface QuizTimerResponse {
  started_at: string | null;
  remaining_seconds: number;
}

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  start: string;
  end: string | null;
  event_type: string;
  related_course: number | null;
  related_quiz: number | null;
}

export interface NotificationItem {
  id: number;
  channel: "in_app" | "email";
  type: string;
  title: string;
  created_at?: string;
  is_read?: boolean;
  metadata?: Record<string, unknown>;
}

export interface NotificationsResponse {
  email: Array<{ type: string; title: string }>;
  in_app: NotificationItem[];
  unread_count: number;
}

export interface EnrolledStudent {
  id: number;
  user: number;
  username: string;
  full_name: string;
}

export interface QuizAttempt {
  id: number;
  student: number;
  student_name: string;
  username: string;
  score: number;
  score_override?: number | null;
  effective_score?: number;
  total: number;
  answers?: Record<string, number | string>;
  created_at: string;
  edited_at?: string | null;
  edited_by?: number | null;
}

export interface AdminManagedUser {
  id: number;
  username: string;
  email?: string;
  is_active: boolean;
  role: Role;
  full_name: string;
  sex?: string;
  email_verified?: boolean;
}

export interface AdminReport {
  id: number;
  title: string;
  description: string;
  category: string;
  created_at: string;
  is_resolved: boolean;
  is_removed: boolean;
  resolved_at?: string | null;
  removed_at?: string | null;
  reporter_username: string;
  reporter_email: string;
  reporter_role: Role | "";
}

export interface PasswordResetRequestPayload {
  email: string;
  frontend_url?: string;
}

export interface PasswordResetConfirmPayload {
  uid: string;
  token: string;
  new_password: string;
}
