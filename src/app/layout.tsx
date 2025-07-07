import type { TypeLayout } from "declare.types";
import type { Metadata } from "next";

import { Roboto } from "next/font/google";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import LayoutClient from "./layout-client";
import { HeaderWebSite } from "@components/HeaderWebSite";
import { DisplayAlert } from "@components/DisplayAlert";

import "@styles/reset.css";
import "./index.scss";

export const metadata: Metadata = {
  title: "OptimizeConstructorEdit",
  icons: "/icons/logoWebSite.svg",
};

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

const RootLayout: TypeLayout = ({ children }) => {
  return (
    <html lang="ru" className={roboto.variable}>
      <body>
        <AppRouterCacheProvider>
          <LayoutClient>
            <HeaderWebSite />
            <main>{children}</main>
            <DisplayAlert />
          </LayoutClient>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
