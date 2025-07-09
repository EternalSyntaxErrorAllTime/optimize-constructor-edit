import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { deleteRecordsCardCatalog } from "@database/design-engineer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { message: "Invalid request: non-empty array of IDs required." },
        { status: 400 }
      );
    }

    // Проверяем, что все элементы — целые положительные числа
    const ok = body.every(
      (id) => typeof id === "number" && Number.isInteger(id) && id > 0
    );
    if (!ok) {
      return NextResponse.json(
        { message: "Invalid request: array must contain positive integers." },
        { status: 400 }
      );
    }

    const success = await deleteRecordsCardCatalog(body);

    if (success) {
      return NextResponse.json(
        { message: "Items deleted successfully.", deletedIds: body },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Internal error during deletion.", deletedIds: body },
        { status: 500 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { message: `Internal server error: ${String(err)}` },
      { status: 500 }
    );
  }
}
