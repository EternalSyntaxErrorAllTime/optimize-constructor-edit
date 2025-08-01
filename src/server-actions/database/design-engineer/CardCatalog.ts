"use server";

import type {
  TypeAllCardCatalog,
  TypeSearchCardCatalog,
  TypeDataCardCatalog,
  TypeRecordsCardCatalog,
  TypeAddRecordCardCatalog,
  TypeRecordUpdateCardCatalog,
} from "./CardCatalog.types";

import type {
  TypeParamsSearchCardCatalog,
  TypeParamForAddRecordCardCatalog,
  TypeParamDeleteRecordsCardCatalog,
} from "./CardCatalog.types";

import connection from "@database/connect";

/**
 * Получает все карточки имеющиеся в картотеке
 */
export const getALlCardCatalog = async (): Promise<TypeAllCardCatalog> => {
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
  ORDER BY (ccc."itemType")::INTEGER DESC;`;

  try {
    const result = await client.query<TypeAllCardCatalog[number]>(sql);
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
}: TypeParamsSearchCardCatalog): Promise<TypeSearchCardCatalog | null> => {
  const client = await connection.connect();

  const sql = `SELECT "designEngineer"."SearchCardCatalog"($1, $2, $3) AS result;`;

  try {
    const result = await client.query<
      { result: TypeSearchCardCatalog | null },
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
): Promise<TypeRecordsCardCatalog> => {
  const client = await connection.connect();

  const sql = `
  SELECT
    ccc."lastRecords",
    COALESCE(records.records, '[]') AS records
  FROM
    "designEngineer"."CurrentCardCatalog" AS ccc
  LEFT JOIN LATERAL (
    SELECT
      json_agg(
        json_build_object(
          'ID',     rccc."ID",
          'itemSequence', LPAD(rccc."itemSequence"::text, 3, '0'),
          'suffix', rccc.suffix,
          'nameDetail', rccc.name,
          'nameUser', us.name,
          'dateCreate', rccc."dateCreate",
          'comment', COALESCE(rccc.comment, '')
        )
        ORDER BY rccc."itemSequence"
      ) AS records
    FROM
      "designEngineer"."RecordsCurrentCardCatalog" AS rccc
    JOIN
      "usersData"."Users" AS us
      ON rccc."createBy_user_ID" = us."ID"
    WHERE
      rccc."CardCatalog_ID" = ccc."ID"
  ) AS records ON true
  WHERE
    ccc."ID" = $1;
  `;

  try {
    const result = await client.query<TypeRecordsCardCatalog, [number]>(sql, [
      id,
    ]);

    return result.rows[0];
  } catch (error) {
    throw new Error(`${error}`);
  } finally {
    client.release();
  }
};

/**
 * Удаляет записи в картотеке по полученному списку ID,
 * при этом в сессии PG ставится GUC-переменная текущего пользователя,
 */
export const deleteRecordsCardCatalog = async ({
  user_ID,
  idsRecords,
}: TypeParamDeleteRecordsCardCatalog): Promise<boolean> => {
  const client = await connection.connect();

  const sql = `
  DELETE FROM "designEngineer"."RecordsCurrentCardCatalog"
  WHERE "ID" = ANY($1::int[])
  `;

  try {
    await client.query(`SET session app.current_user_id = ${user_ID}`);
    await client.query("BEGIN");
    await client.query(sql, [idsRecords]);
    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    throw new Error(`Ошибка удаления: ${error}`);
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

/**
 * Обновляет данные в таблицы по введенному массиву
 */
export const updateRecordsCardCatalog = async (
  updates: TypeRecordUpdateCardCatalog
): Promise<boolean> => {
  const client = await connection.connect();

  const updatesJson = JSON.stringify(updates.updates);

  const sql = `
    WITH data AS (
    SELECT
      (elem ->> 'id')::int                                AS id,
      -- если пустая строка, то NULL, иначе приводим к вашему enum
      NULLIF(elem ->> 'suffix', '')::"EnumSuffix"         AS suffix,
      (elem ->> 'nameDetail')                             AS nameDetail,
      (elem ->> 'comment')                                AS comment
    FROM jsonb_array_elements($1::jsonb) AS arr(elem)
  )
  UPDATE "designEngineer"."RecordsCurrentCardCatalog" AS target
  SET
    suffix  = data.suffix,
    name    = data.nameDetail,
    comment = data.comment
  FROM data
  WHERE target."ID" = data.id;
  `;

  try {
    await client.query(`SET session app.current_user_id = ${updates.user_ID}`);
    await client.query("BEGIN");
    await client.query(sql, [updatesJson]);
    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error(`${error}`);
  } finally {
    client.release();
  }
};
