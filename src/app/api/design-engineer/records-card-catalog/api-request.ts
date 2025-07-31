import type { TypeSchemeRecordsCardCatalog } from "./scheme";
import type { TypeRecordsCardCatalog } from "@database/design-engineer";

import axios from "axios";

type ResponseRecordsCardCatalog = {
  message: string;
  status: number;
  data: TypeRecordsCardCatalog;
};

export const requestRecordsCardCatalog = async (
  id: TypeSchemeRecordsCardCatalog
): Promise<ResponseRecordsCardCatalog> => {
  try {
    const result = await axios.get<Omit<ResponseRecordsCardCatalog, "status">>(
      "/api/design-engineer/records-card-catalog",
      {
        params: { id: id },
        timeout: 5_000,
        validateStatus: (status) => status < 600,
      }
    );
    return { ...result.data, status: result.status };
  } catch (error) {
    return {
      status: 500,
      message: `Произошла ошибка - ${error} -(network/server)`,
      data: { lastRecords: 999, records: [] },
    };
  }
};
