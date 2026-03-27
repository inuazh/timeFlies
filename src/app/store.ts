import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "@/entities/user";
import { goalReducer } from "@/entities/goal";

export function makeStore() {
  return configureStore({
    reducer: {
      user: userReducer,
      goal: goalReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
