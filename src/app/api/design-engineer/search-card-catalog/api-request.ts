import type { TypeSchemeSearchCardCatalog } from "./scheme";
import type { TypeSearchCardCatalog } from "@database/design-engineer";

import axios from "axios";

type ResponseSearchCardCatalog = {
  message: string;
  status: number;
  data: TypeSearchCardCatalog | [];
};

export const requestSearchCardCatalog = async ({
  main_search,
  prefix_factory,
  item_type,
}: TypeSchemeSearchCardCatalog): Promise<ResponseSearchCardCatalog> => {
  try {
    const result = await axios.get<Omit<ResponseSearchCardCatalog, "status">>(
      "/api/design-engineer/search-card-catalog",
      {
        params: {
          main_search: main_search || null,
          prefix_factory: prefix_factory || null,
          item_type: item_type || null,
        },
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
