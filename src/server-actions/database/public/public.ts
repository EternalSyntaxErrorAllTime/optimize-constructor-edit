"use server";

import type { TypePrefixFactory } from "./public.types";

import connection from "@database/connect";

/**
 * Получить все префиксы завода
 */
export const getPrefixFactory = async (): Promise<TypePrefixFactory> => {
  const client = await connection.connect();

  const sql = `SELECT "ID", name FROM public."PrefixFactory" WHERE status = 'active'`;

  try {
    const result = await client.query<TypePrefixFactory[number]>(sql);
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to fetch prefix factory - ${error}`);
  } finally {
    client.release();
  }
};
