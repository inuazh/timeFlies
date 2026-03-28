import { createAsyncThunk } from "@reduxjs/toolkit";
import { setUser, clearUser, setUserLoading, setUserError } from "@/entities/user";
import { apiRegister, apiLogin, apiLogout, apiGetMe, ApiHttpError } from "@/shared/api";
import type { RegisterData, LoginData } from "@/shared/api";

export const register = createAsyncThunk(
  "auth/register",
  async (data: RegisterData, { dispatch }) => {
    dispatch(setUserLoading(true));
    dispatch(setUserError(null));
    try {
      const user = await apiRegister(data);
      dispatch(setUser(user));
      return user;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка регистрации";
      dispatch(setUserError(message));
      throw err;
    } finally {
      dispatch(setUserLoading(false));
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginData, { dispatch }) => {
    dispatch(setUserLoading(true));
    dispatch(setUserError(null));
    try {
      const user = await apiLogin(data);
      dispatch(setUser(user));
      return user;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка входа";
      dispatch(setUserError(message));
      throw err;
    } finally {
      dispatch(setUserLoading(false));
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    await apiLogout();
    dispatch(clearUser());
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { dispatch }) => {
    dispatch(setUserLoading(true));
    try {
      const user = await apiGetMe();
      dispatch(setUser(user));
      return user;
    } catch (err) {
      if (err instanceof ApiHttpError && err.status === 401) {
        // Явный 401 — токен протух или невалиден, разлогиниваем
        dispatch(clearUser());
        return null;
      }
      // Сетевая ошибка / сервер спит — пробрасываем чтобы DashboardPage не редиректил
      throw err;
    } finally {
      dispatch(setUserLoading(false));
    }
  }
);
