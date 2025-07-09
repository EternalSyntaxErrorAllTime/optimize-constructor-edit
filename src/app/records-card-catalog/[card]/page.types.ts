import type { FC } from "react";
import type { TypeDataCardCatalog } from "@database/design-engineer";

type PropsPageCardCatalog = {
  params: Promise<{ card: string }>;
};

export type TypePageCardCatalog = FC<PropsPageCardCatalog>;

export type TypePageClientCardCatalog = FC<TypeDataCardCatalog>;
