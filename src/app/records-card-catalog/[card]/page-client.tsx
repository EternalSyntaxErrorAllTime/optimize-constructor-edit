"use client";

import type { TypePageClientCardCatalog } from "./page.types";

import { newAlert } from "@redux/features/notificationAlert";

import { useDispatch } from "react-redux";

import { ReactSVG } from "react-svg";
import { Typography, IconButton } from "@mui/material";
import TableRecords from "@components/TableRecords";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import "./page-style.scss";

const PageClientRecordsCardCatalog: TypePageClientCardCatalog = ({
  ID,
  prefixFactory,
  itemType,
  cardName,
  description,
  icon,
}) => {
  const dispatch = useDispatch();

  const onCopyNumberCard = () => {
    navigator.clipboard.writeText(`${prefixFactory}.${itemType}`);
    dispatch(
      newAlert({
        message: `${prefixFactory}.${itemType} - успешно скопировано!`,
        severity: "success",
      })
    );
  };

  return (
    <div id="RecordsCardCatalog">
      <div className="containerMainInfo">
        {icon && (
          <ReactSVG src={icon} className="iconDetail" aria-label={cardName} />
        )}
        <Typography variant="h5" component="h1" className="name">
          {cardName}
        </Typography>
        <div className="numberCard">
          <Typography variant="h5" component="h2" id="uniqueNumber">
            {`${prefixFactory}.${itemType}`}
          </Typography>
          <IconButton className="buttonCopy" onClick={onCopyNumberCard} size="large">
            <ContentCopyIcon />
          </IconButton>
        </div>
        <Typography variant="h6" component="p" className="description">
          {description}
        </Typography>
      </div>
      <TableRecords id={ID} />
    </div>
  );
};

export default PageClientRecordsCardCatalog;
