"use server";

import type { NextRequest } from "next/server";
import type { TypeRecordsCardCatalog } from "@database/design-engineer";

import { NextResponse } from "next/server";

import { getRecordsCardCatalog } from "@database/design-engineer";

/**
 * GET handler для получения списка записей карточки по её ID.
 *
 * @async
 * @param {NextRequest} request — входящий запрос; ожидается query‑параметр `id`.
 * @returns {Promise<NextResponse<TypeRecordsCardCatalog[] | { error: string }>>}
 *   - **200**: массив записей (`Array<TypeRecordsCardCatalog>`)
 *   - **400**: `{ error: string }` — когда `id` отсутствует или невалиден
 *   - **500**: `{ error: string }` — при внутренней ошибке
 *
 * @example
 * // Запрос:
 * GET /api/design-engineer/records-card-catalog?id=12
 *
 * // Успех (200):
 * [
 *   { id: 1, cardId: 12, title: "Запись 1", … },
 *   { id: 2, cardId: 12, title: "Запись 2", … }
 * ]
 *
 * @throws {NextResponse} При неверном `id` (400) или внутренних ошибках (500).
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<TypeRecordsCardCatalog[] | { error: string }>> {
  const idParam = request.nextUrl.searchParams.get("id");

  if (!idParam) {
    return NextResponse.json(
      { error: "Parameter 'id' is required" },
      { status: 400 }
    );
  }

  const id = Number(idParam);
  if (Number.isNaN(id) || id <= 0) {
    return NextResponse.json(
      { error: "Parameter 'id' must be a positive integer" },
      { status: 400 }
    );
  }

  try {
    const result = await getRecordsCardCatalog(id);

    return NextResponse.json(result, { status: 200 });
  } catch(error) {
    return NextResponse.json(
      { error: `Internal Server Error ${error}` },
      { status: 500 }
    );
  }
}
