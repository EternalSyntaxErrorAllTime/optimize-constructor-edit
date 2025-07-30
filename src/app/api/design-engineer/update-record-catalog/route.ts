import type { NextRequest } from "next/server";
import type { TypeSchemeUpdateRecordCatalog } from "./scheme";

import { NextResponse } from "next/server";

import {
  SchemeUpdateRecordCatalog,
  errorMessageUpdateRecordCatalog,
} from "./scheme";

import { updateRecordsCardCatalog } from "@database/design-engineer";

export async function POST(request: NextRequest) {
  const body: TypeSchemeUpdateRecordCatalog = await request.json();

  const parse = SchemeUpdateRecordCatalog.safeParse(body);
  if (!parse.success) {
    return NextResponse.json(
      {
        message: errorMessageUpdateRecordCatalog(parse.error),
      },
      { status: 400 }
    );
  }
  try {
    const success = await updateRecordsCardCatalog(body);

    if (success) {
      return NextResponse.json(
        { message: "Данные успешно обновлены" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Данные не обновлены" },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Серверная ошибка ${String(error)}.` },
      { status: 500 }
    );
  }
}
