"use client";

import type { FC } from "react";
import type { PropsLayout } from "declare.types";

import { store, persistor } from "@redux/store";
import { QueryClient } from "@tanstack/react-query";

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ProviderTheme } from "./ThemeProvider";
import { QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const LayoutClient: FC<PropsLayout> = ({ children }) => {
  return (
    <SessionProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ProviderTheme>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </ProviderTheme>
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
};

export default LayoutClient;
