import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { randomBytes, randomUUID } from "crypto";

import { getAuthUser } from "@database/users";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Логин/Пароль",
      credentials: {
        login: { label: "Логин", type: "text" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { login, password } = credentials;
        const auth = await getAuthUser(login, password);

        if (!auth.status) {
          throw new Error(auth.message);
        }

        return {
          id: auth.id.toString(),
          name: auth.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 72 * 60 * 60, // 72 hours
    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString("hex");
    },
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/user/signin",
    error: "/user/error",
  },
  callbacks: {
    // Запускается при каждом логине и при каждом refresh токена
    async jwt({ token, user }) {
      if (user) {
        // при первом входе user содержит то, что вы вернули из authorize
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    // Запускается при каждом getSession / useSession
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      if (token.login) session.user.name = token.name as string;
      return session;
    },
  },
};
