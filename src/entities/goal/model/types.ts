export interface Goal {
  id: number;
  userId: number;
  title: string;
  targetYear: number;
  targetWeek: number;
  colorIndex: number;
  createdAt?: string;
}

export interface GoalState {
  items: Goal[];
  isLoading: boolean;
  error: string | null;
}
