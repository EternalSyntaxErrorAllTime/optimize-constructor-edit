"use client";

import type { FC } from "react";
import type { TypeRootState } from "@redux/redux.types";

import ROUTER from "@components/HeaderWebSite/routerLinks";
import { signOut } from "next-auth/react";
import { setTheme } from "@redux/features/theme";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useScrollTrigger, useMediaQuery } from "@mui/material";

import {
  Slide,
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Link,
  Drawer,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import IconWebSite from "@icons/logoWebSite.svg";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import style from "./HeaderWebSite.module.scss";

const HeaderWebSite: FC = () => {
  const triggerScroll = useScrollTrigger();
  const { data: session } = useSession();

  const pathname = usePathname();

  const isMedia = useMediaQuery("(max-width: 950px)");

  const [openLeft, setOpenLeft] = useState<boolean>(false);
  const [openRight, setOpenRight] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { mode } = useSelector((state: TypeRootState) => state.theme);

  const allLink = Object.values(ROUTER).map(({ Icon, title, links }) => (
    <Link
      key={`link-${links}`}
      href={links}
      className={links === pathname ? style.active : ""}
    >
      <Icon />
      <span>{title}</span>
    </Link>
  ));

  return (
    <>
      <Slide appear={false} direction="down" in={!triggerScroll}>
        <AppBar className={style.HeaderWebSite}>
          <Toolbar>
            {(isMedia && session) && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                sx={{ mr: 2 }}
                onClick={() => setOpenLeft(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={{ mr: 3 }} className={style.logoWebSite}>
              <IconWebSite />
            </Box>
            <nav className={style.navElement}>{(!isMedia && session)&& allLink}</nav>
            <div className={style.userElement}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                onClick={() =>
                  dispatch(setTheme(mode === "light" ? "night" : "light"))
                }
              >
                {mode !== "light" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              {session && (
                <Button
                  size="large"
                  variant="text"
                  color="inherit"
                  id={style.user}
                  endIcon={<AccountCircle />}
                  onClick={() => setOpenRight(true)}
                >
                  <span>{session.user.name}</span>
                </Button>
              )}
            </div>
          </Toolbar>
        </AppBar>
      </Slide>
      <Drawer open={openLeft} onClose={() => setOpenLeft(false)}>
        <nav className={style.listMenu}>{allLink}</nav>
      </Drawer>
      <Drawer
        open={openRight}
        onClose={() => setOpenRight(false)}
        anchor="right"
      >
        <nav className={style.listMenu}>
          <div className={style.spacer}></div>
          <Button onClick={() => signOut({ callbackUrl: "/user/signin" })}>
            Выйти
          </Button>
        </nav>
      </Drawer>
    </>
  );
};

export default HeaderWebSite;
