import type { TypePrefixFactory } from "@database/public";
import type {
  TypeAllCardCatalog,
  TypeSearchCardCatalog,
} from "@database/design-engineer";
import type { TypeInputValue } from "@redux/features/searchCardCatalog";

import axios from "axios";

export const requestPrefixFactory = async (): Promise<
  Array<TypePrefixFactory>
> => {
  return (await axios.get("/api/public/prefix-factory", { timeout: 5_000 }))
    .data;
};

export const requestALlCardCatalog = async (): Promise<
  Array<TypeAllCardCatalog>
> => {
  return (
    await axios.get("/api/design-engineer/all-card-catalog", { timeout: 5_000 })
  ).data;
};

export const requestSearchCardCatalog = async ({
  mainSearch,
  prefix,
  uniqueNumber,
}: TypeInputValue): Promise<Array<TypeSearchCardCatalog>> => {
  return (
    await axios.get("/api/design-engineer/search-card-catalog", {
      params: {
        main_search: mainSearch || null,
        prefix_factory: prefix || null,
        item_type: uniqueNumber || null,
      },
      timeout: 5_000,
    })
  ).data;
};
