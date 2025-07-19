import type {
  TypeSearchCardCatalog,
  TypeActionSearchCardCatalog,
  TypeActionUpdatePagination,
} from "./searchCardCatalog.types";

import { createSlice } from "@reduxjs/toolkit";

const initialState: TypeSearchCardCatalog = {
  whatOpen: "none",
  inputValue: { mainSearch: "", prefix: 0, uniqueNumber: "" },
  pagination: 1,
};

const searchCardCatalog = createSlice({
  name: "searchCardCatalog",
  initialState,

  reducers: {
    updateDisplaySearchCard: (state, action: TypeActionSearchCardCatalog) => {
      state.whatOpen = action.payload.whatOpen;
      state.pagination = 1;
      if (action.payload.inputValue) {
        state.inputValue = action.payload.inputValue;
      }
    },
    updatePagination: (state, action: TypeActionUpdatePagination) => {
      state.pagination = action.payload;
    },
  },
});

export const { updateDisplaySearchCard, updatePagination } =
  searchCardCatalog.actions;

export default searchCardCatalog.reducer;
