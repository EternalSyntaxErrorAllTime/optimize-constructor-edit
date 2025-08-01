"use server";

import { NextResponse } from "next/server";

import { getALlCardCatalog } from "@database/design-engineer";

export async function GET() {
  try {
    const result = await getALlCardCatalog();
    return NextResponse.json(
      { data: result, message: "Успешный ответ с сервера" },
      {
        status: 200,
        headers: {
          // "Cache-Control": "public, max-age=600, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { data: [], message: `Серверная ошибка ${String(error)}.` },
      { status: 500 }
    );
  }
}
