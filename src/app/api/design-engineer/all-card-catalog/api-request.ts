import type { TypeAllCardCatalog } from "@database/design-engineer";

import axios from "axios";

type ResponseAllCardCatalog = {
  message: string;
  status: number;
  data: TypeAllCardCatalog | [];
};

export const requestAllCardCatalog =
  async (): Promise<ResponseAllCardCatalog> => {
    try {
      const result = await axios.get<Omit<ResponseAllCardCatalog, "status">>(
        "/api/design-engineer/all-card-catalog",
        {
          timeout: 5_000,
          validateStatus: (status) => status < 600,
        }
      );

      return { ...result.data, status: result.status };
    } catch (error) {
      return {
        status: 500,
        message: `Произошла ошибка - ${error} -(network/server)`,
        data: [],
      };
    }
  };
