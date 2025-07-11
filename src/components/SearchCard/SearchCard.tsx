"use client";

import type { TypeRootState } from "@redux/redux.types";

import {
  requestPrefixFactory,
  requestALlCardCatalog,
  requestSearchCardCatalog,
} from "./apiRequest";

import { updateDisplaySearchCard } from "@redux/features/searchCardCatalog";

import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "@mui/material";

import {
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { ResultSearchCard } from "@components/ResultSearchCard";
import { ItemCard } from "@components/ItemCard";

import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import TableRowsIcon from "@mui/icons-material/TableRows";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";

import "./SearchCard.scss";

const SearchCard: FC = () => {
  const dispatch = useDispatch();
  const { whatOpen, inputValue } = useSelector(
    (state: TypeRootState) => state.searchCard
  );

  const { data: prefixFactory = [] } = useQuery({
    queryFn: requestPrefixFactory,
    queryKey: ["prefix-factory"],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { data: allCard = [], isLoading: loadingAllCard } = useQuery({
    queryFn: requestALlCardCatalog,
    queryKey: ["all-card-catalog"],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: whatOpen === "all-card",
  });

  const {
    data: searchCard = [],
    isLoading: loadingSearchCard,
    isFetching: fetchingSearchCard,
    refetch: searchRefetch,
  } = useQuery({
    queryFn: () =>
      requestSearchCardCatalog({
        mainSearch: mainSearch.trim(),
        prefix,
        uniqueNumber,
      }),
    queryKey: ["search-card-catalog"],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 30_0000,
    gcTime: 30_0000,
    enabled:
      whatOpen === "search" &&
      (inputValue.mainSearch !== "" ||
        inputValue.prefix !== 0 ||
        inputValue.uniqueNumber !== ""),
  });

  const [mainSearch, setMainSearch] = useState<string>(inputValue.mainSearch);
  const [prefix, setPrefixFactory] = useState<number>(inputValue.prefix);
  const [uniqueNumber, setUniqueNumber] = useState<string>(
    inputValue.uniqueNumber
  );

  const [title, setTitle] = useState<string>("");
  const [errorInput, setErrorInput] = useState<boolean>(false);

  const isMedia = useMediaQuery("(min-width: 850px)");

  const onAllCard = () => {
    if (whatOpen === "all-card") {
      dispatch(updateDisplaySearchCard({ whatOpen: "none" }));
      return;
    }
    dispatch(updateDisplaySearchCard({ whatOpen: "all-card" }));
    setTitle("Вся картотека:");
    setErrorInput(false);
  };

  const onSearchCard = () => {
    setErrorInput(false);
    if (mainSearch.trim() === "" && prefix === 0 && uniqueNumber === "") {
      setErrorInput(true);
      return;
    }

    if (
      inputValue.mainSearch !== mainSearch.trim() ||
      inputValue.prefix !== prefix ||
      inputValue.uniqueNumber !== uniqueNumber
    ) {
      searchRefetch();
    }

    dispatch(
      updateDisplaySearchCard({
        whatOpen: "search",
        inputValue: { mainSearch, prefix, uniqueNumber },
      })
    );
    setTitle("Найденные карточки:");
  };

  const clearInput = () => {
    setMainSearch("");
    setPrefixFactory(0);
    setUniqueNumber("");
    setErrorInput(false);
  };

  const onClear = () => {
    dispatch(
      updateDisplaySearchCard({
        whatOpen: whatOpen,
        inputValue: {
          mainSearch: "",
          prefix: 0,
          uniqueNumber: "",
        },
      })
    );
    clearInput();
  };

  const onReset = () => {
    clearInput();
    dispatch(
      updateDisplaySearchCard({
        whatOpen: "none",
        inputValue: {
          mainSearch: "",
          prefix: 0,
          uniqueNumber: "",
        },
      })
    );
  };

  const RenderResultCard = () => {
    if (whatOpen === "none") return;

    if (loadingAllCard || loadingSearchCard || fetchingSearchCard) {
      return (
        <div className="loading">
          <CircularProgress size="6rem" />
        </div>
      );
    }

    return (
      <ResultSearchCard title={title}>
        {whatOpen === "search" &&
          searchCard.map((item) => <ItemCard key={item.ID} {...item} />)}
        {whatOpen === "all-card" &&
          allCard.map((item) => <ItemCard key={item.ID} {...item} />)}
      </ResultSearchCard>
    );
  };

  return (
    <section className="SearchCard">
      <Typography variant="h4" component="h1" className="weightText">
        Поиск по картотеке
      </Typography>

      <div className="containerItem">
        <TextField
          label="Поиск"
          helperText="Общий поиск по текстовым данным"
          className="searchAll"
          value={mainSearch}
          type="search"
          inputMode="search"
          onChange={(e) => setMainSearch(e.target.value)}
          onKeyDown={(event) => event.key === "Enter" && onSearchCard()}
          disabled={loadingAllCard || loadingSearchCard || fetchingSearchCard}
          error={errorInput}
        />
        <div className="buttonElement">
          <Button
            endIcon={isMedia && <SearchIcon />}
            className={isMedia ? "" : "iconButton"}
            loading={loadingAllCard || loadingSearchCard || fetchingSearchCard}
            onClick={onSearchCard}
          >
            {isMedia ? <span>Поиск</span> : <SearchIcon />}
          </Button>

          <Button
            endIcon={isMedia && <DeleteIcon />}
            onClick={onClear}
            className={isMedia ? "" : "iconButton"}
            loading={loadingAllCard || loadingSearchCard || fetchingSearchCard}
          >
            {isMedia ? <span>Очистить</span> : <DeleteIcon />}
          </Button>

          <Button
            endIcon={isMedia && <RefreshIcon />}
            onClick={onReset}
            className={isMedia ? "" : "iconButton"}
            loading={loadingAllCard || loadingSearchCard || fetchingSearchCard}
          >
            {isMedia ? <span>Сбросить</span> : <RefreshIcon />}
          </Button>
        </div>
      </div>

      <div className="containerItem">
        <FormControl fullWidth className="prefixFactory">
          <InputLabel id="prefixFactoryLabel">Префикс</InputLabel>
          <Select
            error={errorInput}
            labelId="prefixFactoryLabel"
            id="prefixFactory"
            label="Префикс"
            value={prefix}
            disabled={loadingAllCard || loadingSearchCard || fetchingSearchCard}
            onChange={(e) => setPrefixFactory(e.target.value)}
          >
            <MenuItem value={0}>
              <span style={{ color: "transparent" }}>None</span>
            </MenuItem>
            {prefixFactory.map((item) => (
              <MenuItem key={item.name} value={item.ID}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          className="uniqueNumber"
          label="Уникальный номер"
          slotProps={{
            htmlInput: {
              maxLength: 6,
            },
          }}
          type="search"
          inputMode="search"
          value={uniqueNumber}
          onChange={(e) =>
            /^\d*$/.test(e.target.value) && setUniqueNumber(e.target.value)
          }
          onKeyDown={(event) => event.key === "Enter" && onSearchCard()}
          error={errorInput}
          disabled={loadingAllCard || loadingSearchCard || fetchingSearchCard}
        />
      </div>

      {errorInput && (
        <Typography
          variant="body2"
          component="p"
          color="error"
          className="weightText"
        >
          Хоть в одно из полей нужно ввести данные!
        </Typography>
      )}

      <Button
        className="pressLeft"
        endIcon={whatOpen === "all-card" ? <CloseIcon /> : <TableRowsIcon />}
        onClick={onAllCard}
        loading={loadingAllCard || loadingSearchCard || fetchingSearchCard}
        color={whatOpen === "all-card" ? "secondary" : "primary"}
      >
        {whatOpen === "all-card" ? "Закрыть картотеку" : "Открыть всю картотек"}
      </Button>

      <RenderResultCard />
    </section>
  );
};

export default SearchCard;
