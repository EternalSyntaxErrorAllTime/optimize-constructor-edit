"use client";

import { TypeErrorPage } from "declare.types";

import { useMediaQuery } from "@mui/material";

import { Typography, Button } from "@mui/material";
import NextLink from "next/link";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";

import "@styles/page.scss";

const PageError: TypeErrorPage = ({ error, reset }) => {
  const isMedia = useMediaQuery("(min-width: 850px)");

  return (
    <div id="ErrorPage">
      <Typography variant="h2" content="h1" className="title">
        Ошибка сервера 500
      </Typography>
      <Typography variant="h4" component="pre" color="error" className="error">
        {error.message}
      </Typography>
      <div className="containerButton">
        <Button
          startIcon={<ArrowBackIcon />}
          size={isMedia ? "large" : "small"}
          href="/"
          LinkComponent={NextLink}
          className="toMainPage"
        >
          На главную
        </Button>
        <Button
          onClick={() => reset()}
          endIcon={<RefreshIcon />}
          size={isMedia ? "large" : "small"}
          color="warning"
        >
          Попробовать снова
        </Button>
      </div>
    </div>
  );
};

export default PageError;
