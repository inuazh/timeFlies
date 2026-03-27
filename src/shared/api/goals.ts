import type { Goal } from "@/entities/goal";

export interface CreateGoalData {
  title: string;
  targetYear: number;
  targetWeek: number;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error((data as { error: string }).error || "Произошла ошибка");
  }
  return data as T;
}

export async function apiGetGoals(): Promise<Goal[]> {
  const res = await fetch("/api/goals");
  return handleResponse<Goal[]>(res);
}

export async function apiCreateGoal(data: CreateGoalData): Promise<Goal> {
  const res = await fetch("/api/goals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Goal>(res);
}

export async function apiDeleteGoal(id: number): Promise<void> {
  const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json();
    throw new Error((data as { error: string }).error || "Ошибка удаления");
  }
}
