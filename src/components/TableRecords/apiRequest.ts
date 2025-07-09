import type { TypeRowData } from "./TableRecords.types";
import type {
  TypeRecordsCardCatalog,
  TypeAddRecordCardCatalog,
} from "@database/design-engineer";
import axios, { AxiosError } from "axios";

export const requestDataCardCatalog = async (
  id: number
): Promise<Array<TypeRecordsCardCatalog>> => {
  try {
    const { data } = await axios.get(
      `/api/design-engineer/records-card-catalog?id=${id}`,
      {
        timeout: 5_000,
      }
    );
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError<{ error: string }>;
      const serverMsg = axiosErr.response?.data?.error;
      throw new Error(serverMsg ?? axiosErr.message);
    }
    throw err;
  }
};

export const requestDeleteRecordsCatalog = async (
  ids: number[]
): Promise<{ status: boolean; message: string }> => {
  try {
    const response = await axios.post(
      "/api/design-engineer/delete-records-catalog",
      ids,
      { timeout: 5_000 }
    );

    if (response.status === 200) {
      return {
        status: true,
        message: "Удаление проведено успешно!",
      };
    }

    return {
      status: false,
      message: "Произошла ошибка при удалении! (status ≠ 200)",
    };
  } catch {
    return {
      status: false,
      message: "Произошла ошибка при удалении! (network/server)",
    };
  }
};

export const requestAddRecordCatalog = async (
  data: object
): Promise<{
  status: boolean;
  message: string;
  output?: TypeAddRecordCardCatalog["data"];
}> => {
  try {
    const response = await axios.post<TypeAddRecordCardCatalog>(
      "/api/design-engineer/add-record-catalog",
      data,
      { timeout: 5_000 }
    );

    if (response.status === 200) {
      return {
        status: true,
        message: "Данные успешно добавлены!",
        output: response.data.data,
      };
    }

    return {
      status: false,
      message: "Произошла ошибка при добавлены записи! (status ≠ 200)",
    };
  } catch {
    return {
      status: false,
      message: "Произошла ошибка при добавлены записи! (network/server)",
    };
  }
};

export const requestEditRecordCatalog = async (
  data: Array<TypeRowData>
): Promise<{
  status: boolean;
  message: string;
}> => {
  try {
    const response = await axios.post<TypeAddRecordCardCatalog>(
      "/api/design-engineer/edit-record-catalog",
      data,
      { timeout: 5_000 }
    );

    if (response.status === 200) {
      return {
        status: true,
        message: "Данные успешно обновлены!",
      };
    }

    return {
      status: false,
      message: "Произошла ошибка при обновлены записи! (status ≠ 200)",
    };
  } catch {
    return {
      status: false,
      message: "Произошла ошибка при обновлены записи! (network/server)",
    };
  }
};
