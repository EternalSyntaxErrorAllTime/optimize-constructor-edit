"use server";

import type { TypePageCardCatalog } from "./page.types";

import { getDataCardCatalog } from "@database/design-engineer";
import { notFound } from "next/navigation";

import PageClientRecordsCardCatalog from "./page-client";

const PageCardCatalog: TypePageCardCatalog = async ({ params }) => {
  const { card } = await params;
  const id = Number(card);

  if (Number.isNaN(id) || id <= 0) {
    throw new Error("An incorrect id request must be an integer data type.");
  }

  const cardData = await getDataCardCatalog(id);
  if (!cardData) {
    return notFound();
  }

  return <PageClientRecordsCardCatalog {...cardData} />;
};

export default PageCardCatalog;
