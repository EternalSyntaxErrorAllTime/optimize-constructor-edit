import type { TypeSchemeDeleteRecordsCatalog } from "./scheme";

import axios from "axios";

type ResponseDeleteRecordsCatalog = {
  message: string;
  status: number;
  deletedIds: Array<number> | null;
};

export const requestDeleteRecordsCatalog = async ({
  user_ID,
  idsRecords,
}: TypeSchemeDeleteRecordsCatalog): Promise<ResponseDeleteRecordsCatalog> => {
  try {
    const result = await axios.post<
      Omit<ResponseDeleteRecordsCatalog, "status">
    >(
      "/api/design-engineer/delete-records-catalog",
      { user_ID, idsRecords },
      { timeout: 5_000, validateStatus: (status) => status < 600 }
    );
    return { ...result.data, status: result.status };
  } catch (error) {
    return {
      status: 500,
      message: `Произошла ошибка - ${error} -(network/server)`,
      deletedIds: null,
    };
  }
};
