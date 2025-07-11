"use client";

import type { TypeSearchCard } from "./SearchCard.types";
import type { TypePrefixFactory } from "@database/public";

import axios from "axios";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMediaQuery } from "@mui/material";

import {
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import TableRowsIcon from "@mui/icons-material/TableRows";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";

import "./SearchCard.scss";

const requestPrefixFactory = async (): Promise<Array<TypePrefixFactory>> => {
  return (await axios.get("/api/public/prefix-factory", { timeout: 5_000 }))
    .data;
};

const SearchCard: TypeSearchCard = ({ title, loading = false, onOutput }) => {
  const { data: prefixFactory = [] } = useQuery({
    queryFn: requestPrefixFactory,
    queryKey: ["prefix-factory"],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const isMedia = useMediaQuery("(min-width: 850px)");

  const [mainSearch, setMainSearch] = useState<string>("");
  const [currentPrefixFactory, setCurrentPrefixFactory] = useState<string>("");
  const [uniqueNumber, setUniqueNumber] = useState<string>("");

  const [openALl, setOpenALl] = useState<boolean>(false);

  const [isError, setIsError] = useState<boolean>(false);

  const clearInput = () => {
    setCurrentPrefixFactory("");
    setMainSearch("");
    setUniqueNumber("");
    setIsError(false);
  };

  const onSearch = () => {
    setIsError(false);
    if (!mainSearch.trim() && !uniqueNumber.trim() && !currentPrefixFactory) {
      setIsError(true);
      return;
    }

    onOutput({
      status: "search",
      dataSearch: {
        mainSearch: mainSearch.trim() || null,
        prefix: currentPrefixFactory || null,
        numberCard: uniqueNumber.trim() || null,
      },
    });
  };

  const onReset = () => {
    clearInput();
    setOpenALl(false);
    onOutput({ status: "none" });
  };

  const onOpenAllCard = () => {
    setOpenALl((prev) => !prev);
    onOutput({ status: !openALl ? "all-card" : "none" });
  };

  return (
    <section className="SearchCard">
      <Typography variant="h4" component="h1" className="weightText">
        {title}
      </Typography>

      <div className="containerItem">
        <TextField
          label="Поиск"
          helperText="Общий поиск по текстовым данным"
          className="searchAll"
          value={mainSearch}
          onChange={(e) => setMainSearch(e.target.value)}
          onKeyDown={(event) => event.key === "Enter" && onSearch()}
          error={isError}
          disabled={loading}
        />
        <div className="buttonElement">
          <Button
            endIcon={isMedia && <SearchIcon />}
            onClick={onSearch}
            loading={loading}
            className={isMedia ? "" : "iconButton"}
          >
            {isMedia ? <span>Поиск</span> : <SearchIcon />}
          </Button>

          <Button
            endIcon={isMedia && <DeleteIcon />}
            onClick={clearInput}
            loading={loading}
            className={isMedia ? "" : "iconButton"}
          >
            {isMedia ? <span>Очистить</span> : <DeleteIcon />}
          </Button>

          <Button
            endIcon={isMedia && <RefreshIcon />}
            onClick={onReset}
            loading={loading}
            className={isMedia ? "" : "iconButton"}
          >
            {isMedia ? <span>Сбросить</span> : <RefreshIcon />}
          </Button>
        </div>
      </div>

      <div className="containerItem">
        <FormControl fullWidth className="prefixFactory">
          <InputLabel id="prefixFactoryLabel">Префикс</InputLabel>
          <Select
            error={isError}
            labelId="prefixFactoryLabel"
            id="prefixFactory"
            label="Префикс"
            value={currentPrefixFactory}
            disabled={loading}
            onChange={(e) => setCurrentPrefixFactory(e.target.value)}
          >
            <MenuItem value={""} style={{ color: "transparent" }}>
              None
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
          value={uniqueNumber}
          onChange={(e) => setUniqueNumber(e.target.value)}
          onKeyDown={(event) => event.key === "Enter" && onSearch()}
          error={isError}
          disabled={loading}
        />
      </div>

      {isError && (
        <Typography
          variant="body2"
          component="p"
          color="error"
          className="weightText"
        >
          Хоть в одно из полей нужно ввести данные
        </Typography>
      )}

      <Button
        className="pressLeft"
        endIcon={openALl ? <CloseIcon /> : <TableRowsIcon />}
        onClick={onOpenAllCard}
        loading={loading}
        color={openALl ? "secondary" : "primary"}
      >
        {openALl ? "Закрыть картотеку" : "Открыть всю картотек"}
      </Button>
    </section>
  );
};

export default SearchCard;
