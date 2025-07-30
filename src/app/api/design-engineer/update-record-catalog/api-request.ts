import type { TypeSchemeUpdateRecordCatalog } from ".";

import axios from "axios";

type ResponseUpdateRecordCatalog = {
  message: string;
  status: number;
};

export const requestUpdateRecordCatalog = async (
  data: TypeSchemeUpdateRecordCatalog
): Promise<ResponseUpdateRecordCatalog> => {
  try {
    const result = await axios.post<
      Omit<ResponseUpdateRecordCatalog, "status">
    >(
      "/api/design-engineer/update-record-catalog",
      { ...data },
      { timeout: 5_000, validateStatus: (status) => status < 600 }
    );
    return { ...result.data, status: result.status };
  } catch (error) {
    return {
      status: 500,
      message: `Произошла ошибка - ${error} -(network/server)`,
    };
  }
};
