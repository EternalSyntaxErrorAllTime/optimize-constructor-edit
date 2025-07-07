import type { FC, ReactNode } from "react";

export type PropsLayout = {
  children: Readonly<ReactNode>;
};

export type TypeLayout = FC<PropsLayout>;

export type PropsErrorPage = {
  error: Error & { digest?: string };
  reset: () => void;
};

export type TypeErrorPage = FC<PropsErrorPage>;

// next-auth.d.ts
import type { DefaultUser } from "next-auth";

// 1) Расширяем интерфейс Session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
    };
  }

  // 2) Расширяем интерфейс User (если где-то используете User)
  interface User extends DefaultUser {
    id: string;
    name: string;
  }
}

// 3) Расширяем JWT (токен), чтобы TS знал о custom полях
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
  }
}
