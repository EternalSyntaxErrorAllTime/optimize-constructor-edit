"use server";

import type { NextRequest } from "next/server";
import type { TypeSearchCardCatalog } from "@database/design-engineer";

import { NextResponse } from "next/server";

import { getSearchCardCatalog } from "@database/design-engineer";

export async function GET(
  request: NextRequest
): Promise<NextResponse<Array<TypeSearchCardCatalog> | { message: string }>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mainSearch = searchParams.get("main_search");
    const prefixFactory = searchParams.get("prefix_factory");
    const itemType = searchParams.get("item_type");

    if (mainSearch === null && prefixFactory === null && itemType === null) {
      return NextResponse.json(
        {
          message:
            "Invalid request: you must enter at least one of the parameters.",
        },
        { status: 400 }
      );
    }

    if (prefixFactory !== null) {
      if (
        typeof prefixFactory === "number" ||
        Number.isInteger(prefixFactory) ||
        Number(prefixFactory) <= 0
      ) {
        return NextResponse.json(
          {
            message: `Invalid request "prefixFactory" must be an integer greater than 0.`,
          },
          { status: 400 }
        );
      }
    }

    if (itemType !== null) {
      if (!/^\d+$/.test(itemType)) {
        return NextResponse.json(
          { message: `Invalid request "itemType" must consist of numbers.` },
          { status: 400 }
        );
      }
    }

    const result = await getSearchCardCatalog({
      mainSearch,
      prefixFactory: prefixFactory === null ? null : Number(prefixFactory),
      itemType,
    });
    if (result === null) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Internal server error: ${String(error)}.` },
      { status: 500 }
    );
  }
}
