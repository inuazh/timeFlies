export interface User {
  id: number;
  name: string;
  email: string;
  birthDate: string;
  createdAt?: string;
}

export interface UserState {
  data: User | null;
  isLoading: boolean;
  error: string | null;
}
