"use client";

import type { TypeLayout } from "declare.types";
import type { TypeRootState } from "@redux/redux.types";

import { ruRU } from "@mui/x-data-grid/locales";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

import { useMemo } from "react";
import { useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import NextLink from "next/link";

const ThemeSettings = () => {
  const { mode } = useSelector((state: TypeRootState) => state.theme);

  const isMedia = useMediaQuery("(min-width: 1200px)", {
    noSsr: false,
    defaultMatches: true,
  });

  const colorTheme = useMemo(() => {
    const colorBlack: object = {
      mode: "dark",
      primary: {
        main: "#9C27B0",
      },
      secondary: {
        main: "#63196f",
      },
    };

    const colorLight: object = {
      mode: "light",
      secondary: {
        main: "#114F96",
      },
    };

    return createTheme(
      {
        cssVariables: true,
        palette: mode === "light" ? colorLight : colorBlack,
        typography: {
          fontFamily: "var(--font-roboto)",
        },
        components: {
          MuiButton: {
            defaultProps: {
              color: "primary",
              size: isMedia ? "medium" : "small",
              variant: "contained",
            },
            styleOverrides: {
              root: {
                textTransform: "none",
              },
            },
          },
          MuiIconButton: {
            defaultProps: {
              color: "primary",
              size: isMedia ? "medium" : "small",
            },
          },
          MuiTextField: {
            defaultProps: {
              variant: "outlined",
              size: isMedia ? "medium" : "small",
              type: "text",
            },
          },
          MuiLink: {
            defaultProps: {
              component: NextLink,
              variant: "body1",
              underline: "none",
              style: { fontWeight: 600 },
            },
          },
          MuiSelect: {
            defaultProps: {
              color: "primary",
              size: isMedia ? "medium" : "small",
            },
          },
          MuiFormControl: {
            defaultProps: {
              size: isMedia ? "medium" : "small",
            },
          },
        },
      },
      ruRU
    );
  }, [isMedia, mode]);

  const mainTheme = responsiveFontSizes(colorTheme, {
    factor: 2,
    breakpoints: ["xs", "sm", "md", "lg"],
  });

  return mainTheme;
};

export const ProviderTheme: TypeLayout = ({ children }) => {
  const theme = ThemeSettings();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
