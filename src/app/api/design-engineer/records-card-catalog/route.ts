"use server";

import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import {
  SchemeRecordsCardCatalog,
  errorMessageRecordsCardCatalog,
} from "./scheme";

import { getRecordsCardCatalog } from "@database/design-engineer";

export async function GET(request: NextRequest) {
  const idParam = request.nextUrl.searchParams.get("id");

  const parse = SchemeRecordsCardCatalog.safeParse(idParam);
  if (!parse.success) {
    // Временное решение возвращает при неправильном вводе данных { lastRecords: 999, records: [] }
    return NextResponse.json(
      {
        message: errorMessageRecordsCardCatalog(parse.error),
        data: { lastRecords: 999, records: [] },
      },
      { status: 400 }
    );
  }

  try {
    const result = await getRecordsCardCatalog(parse.data);

    return NextResponse.json(
      {
        message: "Данные успешно получены",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `Серверная ошибка ${String(error)}.`,
        data: { lastRecords: 999, records: [] },
      },
      { status: 500 }
    );
  }
}
