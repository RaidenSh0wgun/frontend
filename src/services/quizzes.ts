import { request } from "./apiClient";
import type {
  ListResponse,
  NotificationsResponse,
  Question,
  Quiz,
  QuizAttempt,
  QuizCreatePayload,
  QuizDetail,
  QuizQuestionPayload,
  QuizTimerResponse,
  QuizViewResponse,
} from "./types";

export async function fetchQuizzesForCourse(courseId: number): Promise<Quiz[]> {
  const data = await request<ListResponse<Quiz>>(`/quizzes/?course=${courseId}`);
  return Array.isArray(data) ? data : data.results ?? [];
}

export async function createQuiz(payload: QuizCreatePayload): Promise<Quiz> {
  return request<Quiz>("/quizzes/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateQuiz(
  id: number,
  payload: Partial<Omit<Quiz, "id" | "course">>
): Promise<Quiz> {
  return request<Quiz>(`/quizzes/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteQuiz(id: number): Promise<void> {
  await request<void>(`/quizzes/${id}/`, { method: "DELETE" });
}

export async function fetchQuizDetail(id: number): Promise<QuizDetail> {
  return request<QuizDetail>(`/quizzes/${id}/`);
}

export async function createQuestion(quizId: number, payload: QuizQuestionPayload): Promise<unknown> {
  return request<unknown>(`/quizzes/${quizId}/questions/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchQuizQuestions(quizId: number): Promise<Question[]> {
  return request<Question[]>(`/quizzes/${quizId}/questions/`);
}

export async function deleteQuestion(questionId: number): Promise<void> {
  await request<void>(`/questions/${questionId}/`, { method: "DELETE" });
}

export async function updateQuestion(
  questionId: number,
  payload: Partial<QuizQuestionPayload>
): Promise<Question> {
  const data = await request<{ message: string; data: Question }>(`/questions/${questionId}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return data.data;
}

export async function submitQuizAnswers(
  quizId: number,
  answers: Record<number, number | string>
): Promise<{ score: number; total: number }> {
  return request<{ score: number; total: number }>(`/quizzes/${quizId}/submit/`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
}

export async function fetchQuizTimer(quizId: number): Promise<QuizTimerResponse> {
  return request<QuizTimerResponse>(`/quizzes/${quizId}/timer/`);
}

export async function fetchCalendarQuizzes(): Promise<Quiz[]> {
  return request<Quiz[]>("/quizzes/calendar/");
}

export async function fetchNotifications(): Promise<NotificationsResponse> {
  return request<NotificationsResponse>("/notifications/");
}

export async function fetchPendingQuizzes(): Promise<Quiz[]> {
  return request<Quiz[]>("/quizzes/pending/");
}

export async function fetchAttemptedQuizzes(): Promise<Quiz[]> {
  return request<Quiz[]>("/quizzes/attempted/");
}

export async function fetchQuizViewDetail(quizId: number): Promise<QuizViewResponse> {
  return request<QuizViewResponse>(`/quizzes/${quizId}/view/`);
}

export async function fetchQuizAttempts(quizId: number): Promise<QuizAttempt[]> {
  return request<QuizAttempt[]>(`/quizzes/${quizId}/attempts/`);
}

export async function logQuizActivity(
  quizId: number,
  action: "answer_change" | "page_refresh" | "focus_loss" | "copy_paste" | "screenshot" | "tab_switch",
  metadata: Record<string, unknown> = {}
): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>(`/quizzes/${quizId}/activity/`, {
    method: "POST",
    body: JSON.stringify({ action, metadata }),
  });
}

export async function fetchQuizAttemptDetail(quizId: number, attemptId: number): Promise<QuizAttempt> {
  return request<QuizAttempt>(`/quizzes/${quizId}/attempts/${attemptId}/`);
}

export async function updateQuizAttempt(
  quizId: number,
  attemptId: number,
  payload: Partial<Pick<QuizAttempt, "answers" | "score_override">>
): Promise<QuizAttempt> {
  return request<QuizAttempt>(`/quizzes/${quizId}/attempts/${attemptId}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
