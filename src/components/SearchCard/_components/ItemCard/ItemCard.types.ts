import type { FC } from "react";

type PropsItemCard = {
  ID: number;
  icon?: string;
  name: string;
  prefixFactory: string,
  itemType: string;
  description?: string;
};

export type TypeItemCard = FC<PropsItemCard>;
