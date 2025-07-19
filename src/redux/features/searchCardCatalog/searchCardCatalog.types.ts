import type { PayloadAction } from "@reduxjs/toolkit";

export type TypeWhatOpen = "none" | "search" | "all-card";

export type TypeInputValue = {
  mainSearch: string;
  prefix: number;
  uniqueNumber: string;
};

export type TypeSearchCardCatalog = {
  whatOpen: TypeWhatOpen;
  inputValue: TypeInputValue;
  pagination: number;
};

export type TypeActionSearchCardCatalog = PayloadAction<{
  whatOpen: TypeWhatOpen;
  inputValue?: TypeInputValue;
}>;


export type TypeActionUpdatePagination = PayloadAction<number>;
