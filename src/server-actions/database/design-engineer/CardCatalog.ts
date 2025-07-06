"use server";

import type {
  TypeAllCardCatalog,
  TypeSearchCardCatalog,
  TypeDataCardCatalog,
  TypeRecordsCardCatalog,
  TypeAddRecordCardCatalog,
} from "./CardCatalog.types";

import type {
  TypeParamsSearchCardCatalog,
  TypeParamForAddRecordCardCatalog,
} from "./CardCatalog.types";

import connection from "@database/connect";

/**
 * Получает все карточки имеющиеся в картотеке
 */
export const getALlCardCatalog = async (): Promise<
  Array<TypeAllCardCatalog>
> => {
  const client = await connection.connect();

  const sql = `
  SELECT
    ccc."ID",
    pf.name            AS "prefixFactory",
    ccc."itemType",
    ccc.name,
    ccc.description,
    ccc.icon
  FROM
      "designEngineer"."CurrentCardCatalog" AS ccc
  JOIN
    public."PrefixFactory" AS pf
    ON ccc."prefixFactory_ID" = pf."ID"
  ORDER BY ccc."ID" ASC;
  `;

  try {
    const result = await client.query<TypeAllCardCatalog>(sql);

    return result.rows;
  } catch (error) {
    throw new Error(` ${error}`);
  } finally {
    client.release();
  }
};

/**
 * Получает карточки имеющиеся в картотеке по данным поиска
 */
export const getSearchCardCatalog = async ({
  mainSearch = null,
  prefixFactory = null,
  itemType = null,
}: TypeParamsSearchCardCatalog): Promise<Array<TypeSearchCardCatalog>> => {
  const client = await connection.connect();

  const sql = `SELECT "designEngineer"."SearchAll"($1, $2, $3) AS result;`;

  try {
    const result = await client.query<
      { result: Array<TypeSearchCardCatalog> },
      [string | null, number | null, string | null]
    >(sql, [mainSearch, prefixFactory, itemType]);

    return result.rows[0].result;
  } catch (error) {
    throw new Error(`${error}`);
  } finally {
    client.release();
  }
};

/**
 * Получает информацию о карточки из картотеки по ID
 */
export const getDataCardCatalog = async (
  id: number
): Promise<TypeDataCardCatalog> => {
  const client = await connection.connect();

  const sql = `
  SELECT
    ccc."ID",
    pf.name            AS "prefixFactory",
    ccc."itemType",
    ccc.name            AS "cardName",
    ccc.description,
    ccc.icon
  FROM
    "designEngineer"."CurrentCardCatalog" AS ccc
  JOIN
    public."PrefixFactory" AS pf
    ON ccc."prefixFactory_ID" = pf."ID"
  WHERE ccc."ID" = $1;
  `;

  try {
    const result = await client.query<TypeDataCardCatalog, [number]>(sql, [id]);

    return result.rows[0];
  } catch (error) {
    throw new Error(`${error}`);
  } finally {
    client.release();
  }
};

/**
 * Получает записи сделанные в картотеке по CardCatalog.ID
 */
export const getRecordsCardCatalog = async (
  id: number
): Promise<Array<TypeRecordsCardCatalog>> => {
  const client = await connection.connect();

  const sql = `
  SELECT 
    rccc."ID",
    LPAD(rccc."itemSequence"::TEXT, 3, '0') AS "itemSequence",
    suffix,
    rccc.name AS "nameDetail",
  	us.name AS "nameUser", 
    "dateCreate",
     COALESCE(comment, '') AS comment
  FROM 
    "designEngineer"."RecordsCurrentCardCatalog" AS rccc
  JOIN
      "usersData"."Users" AS us
      ON rccc."createBy_user_ID" = us."ID"
  WHERE 
    rccc."CardCatalog_ID" = $1
  ORDER BY rccc."ID" ASC 
  `;

  try {
    const result = await client.query<TypeRecordsCardCatalog, [number]>(sql, [
      id,
    ]);

    return result.rows;
  } catch (error) {
    throw new Error(`${error}`);
  } finally {
    client.release();
  }
};

/**
 * Удаляет записи в картотеке по полученному списку ID
 */
export const deleteRecordsCardCatalog = async (
  ids: Array<number | string>
): Promise<boolean> => {
  const client = await connection.connect();

  const sql = `
    DELETE FROM "designEngineer"."RecordsCurrentCardCatalog"
    WHERE "ID" = ANY($1::int[])
  `;

  try {
    await client.query("BEGIN");
    await client.query(sql, [ids]);
    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error(`${error}`);
  } finally {
    client.release();
  }
};

/**
 * Добавляет новую запись в картотеку и возвращает результат
 */
export const addRecordsCardCatalog = async ({
  CardCatalog_ID,
  suffix = null,
  name,
  createBy_user_ID,
  comment = null,
}: TypeParamForAddRecordCardCatalog): Promise<TypeAddRecordCardCatalog> => {
  const client = await connection.connect();

  const sql = `SELECT "designEngineer"."AddRecordsCardCatalog"($1, $2, $3, $4, $5) AS result;`;

  try {
    const result = await client.query<
      { result: TypeAddRecordCardCatalog },
      [number, string | null, string, number, string | null]
    >(sql, [CardCatalog_ID, suffix, name, createBy_user_ID, comment]);

    return result.rows[0].result;
  } catch (error) {
    throw new Error(`${error}`);
  } finally {
    client.release();
  }
};
