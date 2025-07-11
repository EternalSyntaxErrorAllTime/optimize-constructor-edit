"use client";

import type { TypeResultSearchCard } from "./ResultSearchCard.types";
import type { ChangeEvent } from "react";

import { Children } from "react";

import { useState, useRef } from "react";

import { Pagination, Typography } from "@mui/material";

import "./ResultSearchCard.scss";

const ResultSearchCard: TypeResultSearchCard = ({
  title,
  noHaveData = "Нет данных",
  countDisplayElement = 5,
  children,
}) => {
  const [displayItem, setDisplayItem] = useState<number>(1);

  const container = useRef<HTMLDivElement>(null);

  const itemCard = Children.toArray(children);

  const handleChange = (event: ChangeEvent<unknown>, value: number) => {
    setDisplayItem(value);
    container.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Данные для расчёта количества отображаемых элементов
  const startIndex = (displayItem - 1) * countDisplayElement;
  const endIndex = Math.min(startIndex + countDisplayElement, itemCard.length);

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
          page={displayItem}
          onChange={handleChange}
        />
      )}
    </div>
  );
};

export default ResultSearchCard;
