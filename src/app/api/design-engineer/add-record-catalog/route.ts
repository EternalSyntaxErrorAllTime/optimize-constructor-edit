import type { NextRequest } from "next/server";
import type { TypeParamForAddRecordCardCatalog } from "@database/design-engineer";
import { NextResponse } from "next/server";

import { addRecordsCardCatalog } from "@database/design-engineer";

export async function POST(request: NextRequest) {
  try {
    const body: TypeParamForAddRecordCardCatalog = await request.json();

    const requiredKeys: (keyof TypeParamForAddRecordCardCatalog)[] = [
      "CardCatalog_ID",
      "name",
      "createBy_user_ID",
    ];
    const missing = requiredKeys.filter((key) => !(key in body));
    if (missing.length > 0) {
      return NextResponse.json(
        { message: `Invalid request field(s): ${missing.join(", ")}.` },
        { status: 400 }
      );
    }
    if (
      typeof body.CardCatalog_ID !== "number" ||
      !Number.isInteger(body.CardCatalog_ID) ||
      body.CardCatalog_ID <= 0
    ) {
      return NextResponse.json(
        {
          message: `Invalid request "CardCatalog_ID" must be an integer greater than 0.`,
        },
        { status: 400 }
      );
    }
    if (typeof body.name !== "string") {
      return NextResponse.json(
        { message: `Invalid request "name" must be a string.` },
        { status: 400 }
      );
    }
    if (
      typeof body.createBy_user_ID !== "number" ||
      !Number.isInteger(body.createBy_user_ID) ||
      body.createBy_user_ID <= 0
    ) {
      return NextResponse.json(
        {
          message: `Invalid request "createBy_user_ID" must be an integer greater than 0.`,
        },
        { status: 400 }
      );
    }

    const result = await addRecordsCardCatalog(body);
    if (result.status) {
      return NextResponse.json(
        { message: "Items add successfully.", data: result.data },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Internal error during add." },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: `Internal server error: ${String(error)}.` },
      { status: 500 }
    );
  }
}
