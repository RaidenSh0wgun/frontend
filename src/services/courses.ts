import { request } from "./apiClient";
import type { Course, EnrolledStudent, ListResponse, PaginatedResponse } from "./types";

export async function fetchMyCourses(): Promise<Course[]> {
  const data = await request<ListResponse<Course>>("/courses/my/");
  return Array.isArray(data) ? data : data.results ?? [];
}

export async function fetchTeacherCourses(): Promise<Course[]> {
  return fetchMyCourses();
}

export async function fetchCoursesPage(path: string): Promise<PaginatedResponse<Course>> {
  const data = await request<ListResponse<Course> | PaginatedResponse<Course>>(path);
  if (Array.isArray(data)) {
    return {
      count: data.length,
      next: null,
      previous: null,
      results: data,
    };
  }
  if ("count" in data && "next" in data && "previous" in data && "results" in data) {
    return data;
  }
  return {
    count: (data.results ?? []).length,
    next: null,
    previous: null,
    results: data.results ?? [],
  };
}

export async function fetchTeacherCoursesPage(page = 1): Promise<PaginatedResponse<Course>> {
  return fetchCoursesPage(`/courses/my/?page=${page}`);
}

export async function createCourse(
  payload: Pick<Course, "title" | "description" | "passkey">
): Promise<Course> {
  return request<Course>("/courses/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCourse(
  id: number,
  payload: Partial<Pick<Course, "title" | "description" | "passkey" | "is_active">>
): Promise<Course> {
  return request<Course>(`/courses/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteCourse(id: number): Promise<void> {
  await request<void>(`/courses/${id}/`, { method: "DELETE" });
}

export async function enrollCourse(id: number, passkey?: string): Promise<Course> {
  return request<Course>(`/courses/${id}/enroll/`, {
    method: "POST",
    body: JSON.stringify({ passkey }),
  });
}

export async function unenrollCourse(id: number): Promise<Course> {
  return request<Course>(`/courses/${id}/enroll/`, { method: "DELETE" });
}

export async function fetchEnrolledCourses(): Promise<Course[]> {
  const data = await request<ListResponse<Course>>("/courses/enrolled/");
  return Array.isArray(data) ? data : data.results ?? [];
}

export async function fetchEnrolledCoursesPage(page = 1): Promise<PaginatedResponse<Course>> {
  return fetchCoursesPage(`/courses/enrolled/?page=${page}`);
}

export async function fetchCourses(): Promise<Course[]> {
  const data = await request<ListResponse<Course>>("/courses/");
  return Array.isArray(data) ? data : data.results ?? [];
}

export async function fetchCoursesPaginated(page = 1): Promise<PaginatedResponse<Course>> {
  return fetchCoursesPage(`/courses/?page=${page}`);
}

export async function fetchCourseDetail(id: number): Promise<Course> {
  return request<Course>(`/courses/${id}/detail/`);
}

export async function fetchCourseStudents(courseId: number): Promise<EnrolledStudent[]> {
  return request<EnrolledStudent[]>(`/courses/${courseId}/students/`);
}
