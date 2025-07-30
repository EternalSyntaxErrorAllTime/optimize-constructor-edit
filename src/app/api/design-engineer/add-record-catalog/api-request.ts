import type { TypeSchemeAddRecordCatalog } from "./scheme";
import type { TypeAddRecordCardCatalog } from "@database/design-engineer";

import axios from "axios";

type ResponseAddRecordCatalog = {
  message: string;
  data: TypeAddRecordCardCatalog["data"] | null;
  status: number;
};

export const requestAddRecordCatalog = async ({
  CardCatalog_ID,
  suffix = null,
  name,
  createBy_user_ID,
  comment = null,
}: TypeSchemeAddRecordCatalog): Promise<ResponseAddRecordCatalog> => {
  try {
    const result = await axios.post<Omit<ResponseAddRecordCatalog, "status">>(
      "/api/design-engineer/add-record-catalog",
      { CardCatalog_ID, suffix, name, createBy_user_ID, comment },
      { timeout: 5_000, validateStatus: (status) => status < 600 }
    );
    return { ...result.data, status: result.status };
  } catch (error) {
    return {
      status: 500,
      message: `Произошла ошибка - ${error} -(network/server)`,
      data: null,
    };
  }
};
