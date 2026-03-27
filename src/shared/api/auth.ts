export interface RegisterData {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  birthDate: string;
  createdAt: string;
}

export interface ApiError {
  error: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error((data as ApiError).error || "Произошла ошибка");
  }
  return data as T;
}

export async function apiRegister(data: RegisterData): Promise<UserResponse> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<UserResponse>(res);
}

export async function apiLogin(data: LoginData): Promise<UserResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<UserResponse>(res);
}

export async function apiLogout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function apiGetMe(): Promise<UserResponse> {
  const res = await fetch("/api/auth/me");
  return handleResponse<UserResponse>(res);
}
