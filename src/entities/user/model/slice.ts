import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User, UserState } from "./types";

const initialState: UserState = {
  data: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.data = action.payload;
      state.error = null;
    },
    clearUser(state) {
      state.data = null;
      state.error = null;
    },
    setUserLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setUserError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setUser, clearUser, setUserLoading, setUserError } =
  userSlice.actions;
export const userReducer = userSlice.reducer;
