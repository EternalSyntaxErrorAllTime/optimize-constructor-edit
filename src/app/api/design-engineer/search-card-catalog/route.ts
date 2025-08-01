"use server";

import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import {
  SchemeSearchCardCatalog,
  errorMessageSearchCardCatalog,
} from "./scheme";

import { getSearchCardCatalog } from "@database/design-engineer";

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());

  const parse = SchemeSearchCardCatalog.safeParse(params);
  if (!parse.success) {
    return NextResponse.json(
      { data: [], message: errorMessageSearchCardCatalog(parse.error) },
      { status: 400 }
    );
  }

  const { main_search, prefix_factory, item_type } = parse.data;

  try {
    const result = await getSearchCardCatalog({
      mainSearch: main_search,
      prefixFactory: prefix_factory ?? null,
      itemType: item_type,
    });

    if (!result) {
      return NextResponse.json(
        { data: [], message: "Данные по вашему запросу найти не удалось" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { data: result, message: "Успешно найденные данные" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { data: [], message: `Серверная ошибка ${String(error)}.` },
      { status: 500 }
    );
  }
}
