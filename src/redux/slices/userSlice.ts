import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    update: (state: any, action) => {
      state.user = {
        ...state?.user,
        user_info: { ...state.user?.user_info, ...action?.payload },
      };
    },
    updateToken: (state: any, action) => {
      state.user = {
        ...state?.user,
        keycloak_user: { ...state.user?.keycloak_user, ...action?.payload },
      };
    },
  },
});
export const { login, logout, update, updateToken } = userSlice.actions;
export const selectUser = (state: any) => state.user?.user;
export default userSlice.reducer;
