"use client";

import type { TypeResultSearchCard } from "./ResultSearchCard.types";
import type { ChangeEvent } from "react";
import type { TypeRootState } from "@redux/redux.types";

import { Children } from "react";
import { updatePagination } from "@redux/features/searchCardCatalog";

import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CircularProgress, Typography, Pagination } from "@mui/material";

import "./ResultSearchCard.scss";

const ResultSearchCard: TypeResultSearchCard = ({
  title,
  noHaveData = "Нет данных",
  countDisplayElement = 5,
  loading = false,
  children,
}) => {
  const dispatch = useDispatch();
  const { pagination } = useSelector(
    (state: TypeRootState) => state.searchCard
  );

  const container = useRef<HTMLDivElement>(null);

  const itemCard = Children.toArray(children);

  const handleChange = (event: ChangeEvent<unknown>, value: number) => {
    dispatch(updatePagination(value));
    container.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Данные для расчёта количества отображаемых элементов
  const startIndex = (pagination - 1) * countDisplayElement;
  const endIndex = Math.min(startIndex + countDisplayElement, itemCard.length);

  if (loading) {
    return (
      <div className="ResultSearchCard">
        <div className="loading">
          <CircularProgress size="6rem" />
        </div>
      </div>
    );
  }

  return (
    <div className="ResultSearchCard">
      <div ref={container} />
      {title && (
        <Typography variant="h4" component="h1" className="header">
          {title}
        </Typography>
      )}
      {itemCard.length === 0 && (
        <div className="noHaveData">
          <Typography variant="h2" component="p" color="primary">
            {noHaveData}
          </Typography>
        </div>
      )}
      {itemCard.length >= 1 && (
        <div className="list">{itemCard.slice(startIndex, endIndex)}</div>
      )}
      {itemCard.length > countDisplayElement && (
        <Pagination
          className="paginationPlace"
          size="medium"
          color="primary"
          count={Math.ceil(itemCard.length / countDisplayElement)}
          page={pagination}
          onChange={handleChange}
        />
      )}
    </div>
  );
};

export default ResultSearchCard;
