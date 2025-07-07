"use client";

import type { FC } from "react";

import { newAlert } from "@redux/features/notificationAlert";
import { signIn } from "next-auth/react";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Form from "next/form";
import {
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";

import LoginIcon from "@mui/icons-material/Login";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import "./PageIndexSignIn.scss";

const PageIndexSignIn: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const request = async () => {
      const result = await signIn("credentials", {
        redirect: false,
        login,
        password,
      });
      if (!result) return;

      if (result.status === 200) {
        dispatch(
          newAlert({
            message: "Авторизация успешна!",
            severity: "success",
          })
        );
        router.push("/");
        return;
      }

      dispatch(
        newAlert({
          message: `${result.error}`,
          severity: result.status >= 500 ? "error" : "warning",
        })
      );
    };

    request();
  };

  return (
    <div id="PageIndexSignIn">
      <Typography variant="h4" component="h1" className="title">
        Авторизация
      </Typography>
      <Form onSubmit={handleSubmit} action={""} className="formSingIn">
        <TextField
          label="Логин"
          type="text"
          name="username"
          value={login}
          autoComplete="username"
          onChange={(e) => setLogin(e.target.value)}
          className="inputElement"
        />
        <FormControl className="inputElement">
          <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? "hide the password" : "display the password"
                  }
                  onClick={() => setShowPassword((show) => !show)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Пароль"
          />
        </FormControl>
        <Button type="submit" endIcon={<LoginIcon />} size="large">
          Авторизация
        </Button>
      </Form>
    </div>
  );
};

export default PageIndexSignIn;
