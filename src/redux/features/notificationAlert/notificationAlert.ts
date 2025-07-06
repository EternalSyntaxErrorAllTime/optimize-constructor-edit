import {
  TypeStateAlert,
  TypeActionNewAlert,
  TypeActionCloseAlert,
} from "./notificationAlert.types";

import { nanoid } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: TypeStateAlert = {
  alert: [],
};

const notificationAlert = createSlice({
  name: "notificationAlert",
  initialState,

  reducers: {
    newAlert: (state, action: TypeActionNewAlert) => {
      const alert = {
        id: nanoid(),
        message: action.payload.message,
        severity: action.payload.severity,
      };
      state.alert.push(alert);
    },
    closeAlert: (state, action: TypeActionCloseAlert) => {
      const indx = state.alert.findIndex((item) => item.id === action.payload);
      state.alert.splice(indx, 1);
    },
  },
});

export const { newAlert, closeAlert } = notificationAlert.actions;

export default notificationAlert.reducer;
