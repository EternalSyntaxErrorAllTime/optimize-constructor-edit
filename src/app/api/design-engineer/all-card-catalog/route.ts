"use server";

import { NextResponse } from "next/server";

import { getALlCardCatalog } from "@database/design-engineer";

export async function GET() {
  const result = await getALlCardCatalog();

  return NextResponse.json(result, {
    status: 200,
    headers: {
      // "Cache-Control": "public, max-age=600, stale-while-revalidate=600",
    },
  });
}
