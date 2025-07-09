import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { updateRecordsCardCatalog } from "@database/design-engineer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body);
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { message: "Invalid request: non-empty array" },
        { status: 400 }
      );
    }
    const success = await updateRecordsCardCatalog(body);

    if (success) {
      return NextResponse.json(
        { message: "Items updates successfully." },
        { status: 200 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { message: `Internal server error: ${String(err)}` },
      { status: 500 }
    );
  }
}
