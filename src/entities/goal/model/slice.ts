import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Goal, GoalState } from "./types";

const initialState: GoalState = {
  items: [],
  isLoading: false,
  error: null,
};

const goalSlice = createSlice({
  name: "goal",
  initialState,
  reducers: {
    setGoals(state, action: PayloadAction<Goal[]>) {
      state.items = action.payload;
      state.error = null;
    },
    addGoal(state, action: PayloadAction<Goal>) {
      state.items.push(action.payload);
      state.error = null;
    },
    removeGoal(state, action: PayloadAction<number>) {
      state.items = state.items.filter((g) => g.id !== action.payload);
    },
    setGoalsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setGoalsError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setGoals, addGoal, removeGoal, setGoalsLoading, setGoalsError } =
  goalSlice.actions;
export const goalReducer = goalSlice.reducer;
