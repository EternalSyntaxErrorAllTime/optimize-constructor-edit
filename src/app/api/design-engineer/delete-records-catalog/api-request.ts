import { TypeParamDeleteRecordsCardCatalog } from "@database/design-engineer";

import axios from "axios";

type ResponseDeleteRecordsCatalog = {
  message: string;
  status: number;
  deletedIds: Array<number> | null;
};

export const requestDeleteRecordsCatalog = async ({
  user_ID,
  idsRecords,
}: TypeParamDeleteRecordsCardCatalog): Promise<ResponseDeleteRecordsCatalog> => {
  try {
    const result = await axios.post<
      Omit<ResponseDeleteRecordsCatalog, "status">
    >(
      "/api/design-engineer/delete-records-catalog",
      { user_ID, idsRecords },
      { timeout: 5_000 }
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
