import type {
  TypeSearchCardCatalog,
  TypeActionSearchCardCatalog,
} from "./searchCardCatalog.types";

import { createSlice } from "@reduxjs/toolkit";

const initialState: TypeSearchCardCatalog = {
  whatOpen: "none",
  inputValue: { mainSearch: "", prefix: 0, uniqueNumber: "" },
};

const searchCardCatalog = createSlice({
  name: "searchCardCatalog",
  initialState,

  reducers: {
    updateDisplaySearchCard: (state, action: TypeActionSearchCardCatalog) => {
      state.whatOpen = action.payload.whatOpen;
      if (action.payload.inputValue) {
        state.inputValue = action.payload.inputValue;
      }
    },
  },
});

export const { updateDisplaySearchCard } = searchCardCatalog.actions;

export default searchCardCatalog.reducer;
