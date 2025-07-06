import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TypeMode = "light" | "night";

const initialState: { mode: TypeMode } = { mode: "light" };

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<TypeMode>) {
      state.mode = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
