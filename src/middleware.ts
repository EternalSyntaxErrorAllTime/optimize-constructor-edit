// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const SIGNIN_PATH = "/user/signin";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Всегда пропускаем статику и API-роуты NextAuth
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // 2) Проверяем токен (сессию)
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 3) Если нет сессии и не на странице входа — редиректим на /user/signin
  if (!token && pathname !== SIGNIN_PATH) {
    return NextResponse.redirect(new URL(SIGNIN_PATH, req.url));
  }

  // 4) Если есть сессия и пользователь идёт на /user/signin — редиректим на /
  if (token && pathname === SIGNIN_PATH) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 5) Во всех прочих случаях — пускаем дальше
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico).*)"],
};
