"use client";

import type { FC } from "react";
import type {
  TypeAllCardCatalog,
  TypeSearchCardCatalog,
} from "@database/design-engineer";
// import type {
//   TypeParamsStatus,
//   TypeDataSearch,
//   TypeParamsWithOutputCallback,
// } from "@components/SearchCard";

// import axios from "axios";

// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";

// import { CircularProgress } from "@mui/material";
import { SearchCard } from "@components/SearchCard";
// import { ResultSearchCard } from "@components/ResultSearchCard";
// import { ItemCard } from "@components/ItemCard";

const requestALlCardCatalog = async (): Promise<Array<TypeAllCardCatalog>> => {
  return (
    await axios.get("/api/design-engineer/all-card-catalog", { timeout: 5_000 })
  ).data;
};

const requestSearchCardCatalog = async ({
  mainSearch = null,
  prefix = null,
  numberCard = null,
}: TypeDataSearch): Promise<Array<TypeSearchCardCatalog>> => {
  return (
    await axios.get("/api/design-engineer/search-card-catalog", {
      params: {
        main_search: mainSearch,
        prefix_factory: prefix,
        item_type: numberCard,
      },
      timeout: 5_000,
    })
  ).data;
};

const PageIndex: FC = () => {
  // const [displayData, setDisplayData] = useState<TypeParamsStatus>("none");
  // const [dataSearch, setDataSearch] = useState<TypeDataSearch>({
  //   mainSearch: null,
  //   prefix: null,
  //   numberCard: null,
  // });

  // const { data: allCardCatalog = [] } = useQuery({
  //   queryFn: requestALlCardCatalog,
  //   queryKey: ["all-card-catalog"],
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  //   staleTime: Infinity,
  //   gcTime: Infinity,
  // });

  // const {
  //   data: searchCardCatalog = [],
  //   isLoading,
  //   isFetching,
  // } = useQuery({
  //   queryFn: () => requestSearchCardCatalog(dataSearch),
  //   queryKey: ["search-card-catalog", dataSearch],
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  //   staleTime: 0,
  //   gcTime: 0,
  //   enabled: displayData === "search",
  // });


  // const RenderResults = () => {
  //   if (displayData === "none") return;

  //   if (displayData === "all-card") {
  //     return (
  //       <ResultSearchCard
  //         title="Вся картотека"
  //         noHaveData="Произошла техническая ошибка!"
  //       >
          // {allCardCatalog.map((item) => (
          //   <ItemCard key={item.ID} {...item} description={item.description} />
          // ))}
  //       </ResultSearchCard>
  //     );
  //   }

  //   if (displayData === "search") {
  //     if (isLoading || isFetching) {
  //       return (
  //         <div>
  //           <CircularProgress size="6rem" />
  //         </div>
  //       );
  //     }

  //     return (
  //       <ResultSearchCard
  //         title="Найденные карточки"
  //         noHaveData="По вашему запросу не удалось найти данные"
  //       >
  //         {searchCardCatalog.map((item) => (
  //           <ItemCard key={item.ID} {...item} description={item.description} />
  //         ))}
  //       </ResultSearchCard>
  //     );
  //   }
  // };

  return (
    <div id="PageIndex">
      <SearchCard/>
      {/* <RenderResults /> */}
    </div>
  );
};

export default PageIndex;
