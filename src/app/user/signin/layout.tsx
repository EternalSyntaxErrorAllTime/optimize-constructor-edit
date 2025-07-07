import type { TypeLayout } from "declare.types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Авторизация",
};

const LayoutRecordsCardCatalog: TypeLayout = ({ children }) => {
  return children;
};

export default LayoutRecordsCardCatalog;
