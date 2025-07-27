import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  SchemeDeleteRecordsCatalog,
  errorMessageDeleteRecordsCatalog,
} from "./scheme";
import { deleteRecordsCardCatalog } from "@database/design-engineer";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const parse = SchemeDeleteRecordsCatalog.safeParse(body);
  if (!parse.success) {
    return NextResponse.json(
      {
        message: errorMessageDeleteRecordsCatalog(parse.error),
        deletedIds: null,
      },
      { status: 400 }
    );
  }

  try {
    const result = await deleteRecordsCardCatalog({
      idsRecords: parse.data.idsRecords,
      user_ID: parse.data.user_ID,
    });
    if (!result) {
      return NextResponse.json(
        {
          deletedIds: null,
          message: "Ошибка при удалении (Попробуйте ещё раз позже)",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { deletedIds: null, message: "Удаление данных проведено успешно" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Серверная ошибка ${String(error)}.`, deletedIds: null },
      { status: 500 }
    );
  }
}
