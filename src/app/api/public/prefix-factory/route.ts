"use server";

import { getPrefixFactory } from "@database/public";

export async function GET() {
  const result = await getPrefixFactory();

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      // "Cache-Control": "public, max-age=43200, stale-while-revalidate=3600",
    },
  });
}
