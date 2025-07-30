import type { NextRequest } from "next/server";
import type { TypeParamForAddRecordCardCatalog } from "@database/design-engineer";

import { NextResponse } from "next/server";
import { SchemeAddRecordCatalog, errorMessageAddRecordCatalog } from "./scheme";
import { addRecordsCardCatalog } from "@database/design-engineer";

export async function POST(request: NextRequest) {
  const body: TypeParamForAddRecordCardCatalog = await request.json();

  const parse = SchemeAddRecordCatalog.safeParse(body);

  if (!parse.success) {
    return NextResponse.json(
      {
        message: errorMessageAddRecordCatalog(parse.error),
        data: null,
      },
      { status: 400 }
    );
  }

  try {
    const result = await addRecordsCardCatalog(parse.data);

    if (!result.status) {
      return NextResponse.json(
        { data: null, message: result.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { data: result.data, message: result.message },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Серверная ошибка ${String(error)}.`, data: null },
      { status: 500 }
    );
  }
}
