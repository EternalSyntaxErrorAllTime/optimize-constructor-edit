import type { AlertProps } from "@mui/material";
import type { PayloadAction } from "@reduxjs/toolkit";

export type TypeDataForAlert = {
  id: string;
  severity: AlertProps["severity"];
  message: string;
};

export type TypeStateAlert = {
  alert: Array<TypeDataForAlert>;
};

export type TypeActionNewAlert = PayloadAction<Omit<TypeDataForAlert, "id">>;
export type TypeActionCloseAlert = PayloadAction<string>;
