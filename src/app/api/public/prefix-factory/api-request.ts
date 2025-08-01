import type { TypePrefixFactory } from "@database/public";

import axios from "axios";

export const requestPrefixFactory = async (): Promise<TypePrefixFactory> => {
  const result = await axios.get<TypePrefixFactory>(
    "/api/public/prefix-factory",
    {
      timeout: 5_000,
    }
  );

  return result.data;
};
