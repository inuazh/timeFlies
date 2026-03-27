import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setGoals,
  addGoal,
  removeGoal,
  setGoalsLoading,
  setGoalsError,
} from "@/entities/goal";
import { apiGetGoals, apiCreateGoal, apiDeleteGoal } from "@/shared/api";
import type { CreateGoalData } from "@/shared/api";

export const fetchGoals = createAsyncThunk(
  "goal/fetchGoals",
  async (_, { dispatch }) => {
    dispatch(setGoalsLoading(true));
    try {
      const goals = await apiGetGoals();
      dispatch(setGoals(goals));
      return goals;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка загрузки целей";
      dispatch(setGoalsError(message));
      throw err;
    } finally {
      dispatch(setGoalsLoading(false));
    }
  }
);

export const createGoal = createAsyncThunk(
  "goal/createGoal",
  async (data: CreateGoalData, { dispatch }) => {
    try {
      const goal = await apiCreateGoal(data);
      dispatch(addGoal(goal));
      return goal;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка создания цели";
      dispatch(setGoalsError(message));
      throw err;
    }
  }
);

export const deleteGoal = createAsyncThunk(
  "goal/deleteGoal",
  async (id: number, { dispatch }) => {
    try {
      await apiDeleteGoal(id);
      dispatch(removeGoal(id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка удаления цели";
      dispatch(setGoalsError(message));
      throw err;
    }
  }
);
