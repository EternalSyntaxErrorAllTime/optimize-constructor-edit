"use server";

import type { TypeAuthUser } from "./users.types";

import connection from "@database/connect";

/**
 * Авторизация пользователя
 */
export const getAuthUser = async (
  login: string,
  password: string
): Promise<TypeAuthUser> => {
  const client = await connection.connect();

  const sql = `SELECT "usersData"."authenticateUser"($1, $2) AS result;`;

  try {
    const result = await client.query<
      { result: TypeAuthUser },
      [string, string]
    >(sql, [login, password]);

    return result.rows[0].result;
  } catch (error) {
    throw new Error(`Failed to auto to login user - ${error}`);
  } finally {
    client.release();
  }
};
