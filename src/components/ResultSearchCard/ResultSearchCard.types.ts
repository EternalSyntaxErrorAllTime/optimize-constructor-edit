import type { FC, ReactNode } from "react";

type PropsResultSearchCard = {
  title?: string;
  noHaveData?: string;
  countDisplayElement?: number;
  children: Readonly<ReactNode>;
};

export type TypeResultSearchCard = FC<PropsResultSearchCard>;
