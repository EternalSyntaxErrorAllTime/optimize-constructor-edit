import type { FC } from "react";

type PropsItemCard = {
  ID: number;
  icon?: string;
  name: string;
  itemType: string;
  description?: string;
};

export type TypeItemCard = FC<PropsItemCard>;
