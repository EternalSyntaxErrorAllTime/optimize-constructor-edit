import type { FC, ReactNode } from "react";
import type { ButtonProps } from "@mui/material";
import type {
  TypeRecordsCardCatalog,
  TypeAddRecordCardCatalog,
} from "@database/design-engineer";

// Component
export type PropsTableRecords = {
  id: number;
};

export type TypeTableRecords = FC<PropsTableRecords>;

// Table
export interface TypeRowData extends Omit<TypeRecordsCardCatalog, "ID"> {
  id: number;
}

// State
export type TypeStateDataDialog = {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  confirmation: () => void;
  confirmationText: string;
  confirmationIcon: ReactNode;
  confirmationColor: ButtonProps["color"];
};

// Support component with - delete
type PropsRowDeleteElement = {
  nameDetail: string;
  uniqueNumber: string;
  nameUser: string;
};

export type TypeRowDeleteElement = FC<PropsRowDeleteElement>;

// Support component with - add
export type TypeOutputMessageAddElement = FC<
  TypeAddRecordCardCatalog["data"] & {
    onAction: (value: string) => void;
  }
>;

// Support component with - edit
export type TypeEditRowElement = FC<{
  oldData: TypeRecordsCardCatalog;
  newData: TypeRowData;
}>;
