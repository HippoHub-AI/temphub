import { createSlice } from "@reduxjs/toolkit";

export const loaderSlice = createSlice({
  name: "loader",
  initialState: {
    loading: false,
    chatType: "",
  },
  reducers: {
    updateLoader: (state: any, action) => {
      state.loading = action.payload;
    },
    updateChatType: (state: any, action) => {
      state.chatType = action.payload;
    },
  },
});

export const { updateLoader, updateChatType } = loaderSlice.actions;
export const isLoader = (state: any) => state?.loader?.loading;
export const ChatType = (state: any) => state?.loader?.chatType;

export default loaderSlice.reducer;
