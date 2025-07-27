"use client";

import type { FC } from "react";
import type { TypeStateTimerAutoClose } from "./DisplayAlert.types";
import type { TypeRootState } from "@redux/redux.types";

import { closeAlert } from "@redux/features/notificationAlert";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { TransitionGroup } from "react-transition-group";
import { Collapse, Alert, IconButton } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import "./DisplayAlert.scss";

const DisplayAlert: FC = () => {
  const dispatch = useDispatch();

  const { alert } = useSelector(
    (state: TypeRootState) => state.notificationAlert
  );

  const [timer, setTimer] = useState<TypeStateTimerAutoClose>([]);

  const autoCloseAlert = (id: string) => {
    dispatch(closeAlert(id));
    setTimer((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    if (alert.length === 0) return;

    alert.forEach((alr) => {
      const exists = timer.some((item) => item.id === alr.id);
      if (!exists) {
        const timeout = setTimeout(() => {
          autoCloseAlert(alr.id);
        }, 9_000);

        setTimer((prev) => [...prev, { id: alr.id, action: timeout }]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alert]);

  return (
    <TransitionGroup id="DisplayAlert" component="div">
      {alert.map((item) => (
        <Collapse key={item.id}>
          <Alert
            className="alert"
            severity={item.severity}
            style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => dispatch(closeAlert(item.id))}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {item.message}
          </Alert>
        </Collapse>
      ))}
    </TransitionGroup>
  );
};

export default DisplayAlert;
