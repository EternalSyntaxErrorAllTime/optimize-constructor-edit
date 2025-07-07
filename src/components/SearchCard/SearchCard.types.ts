import type { FC } from "react";

export type TypeParamsStatus = "search" | "none" | "all-card";

export type TypeDataSearch = {
  mainSearch: string | null;
  prefix: string | null;
  numberCard: string | null;
};

export type TypeParamsWithOutputCallback = {
  status: TypeParamsStatus;
  dataSearch?: TypeDataSearch;
};

type PropsSearchCard = {
  title: string;
  loading?: boolean;
  onOutput: (param: TypeParamsWithOutputCallback) => void;
};

export type TypeSearchCard = FC<PropsSearchCard>;
