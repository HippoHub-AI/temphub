import { createSlice } from "@reduxjs/toolkit";

export const popUpSlice = createSlice({
  name: "popUp",
  initialState: {
    uploadpopup: false,
    adminInstruction: false,
  },
  reducers: {
    updatePopup: (state: any, action) => {
      state.uploadpopup = action.payload;
    },
    reset: (state: any) => {
      state.uploadpopup = false;
    },
    changeInstruction: (state: any, action) => {
      state.adminInstruction = action.payload;
    },
  },
});
export const { updatePopup, reset, changeInstruction } = popUpSlice.actions;
export const ispopUpOpen = (state: any) => state?.popUp?.uploadpopup;
export const isInstructionOpen = (state: any) => state?.popUp?.adminInstruction;

export default popUpSlice.reducer;
