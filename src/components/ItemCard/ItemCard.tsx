import type { TypeItemCard } from "./ItemCard.types";

import { useMediaQuery } from "@mui/material";

import { ReactSVG } from "react-svg";
import { Typography, Button } from "@mui/material";
import Link from "next/link";

import CheckIcon from "@mui/icons-material/Check";

import "./ItemCard.scss";

const ItemCard: TypeItemCard = ({ ID, icon, name, prefixFactory, itemType, description }) => {
  const isMedia = useMediaQuery("(min-width: 950px)");
  const isMediaSmall = useMediaQuery("(min-width: 450px)");

  return (
    <article className="ItemCard">
      {isMedia && icon && (
        <div className="iconDetail">
          <ReactSVG src={icon} />
        </div>
      )}
      <header className="mainInfo">
        <Typography variant="h6" component="h1">
          {name}
        </Typography>
        <Typography variant="h6" component="h2">
          {`${prefixFactory}.${itemType}`}
        </Typography>
      </header>
      {description && (
        <Typography
          variant={isMediaSmall ? "body2" : "body1"}
          component="p"
          className="description"
        >
          {description}
        </Typography>
      )}
      <Button
        href={`/records-card-catalog/${ID}`}
        LinkComponent={Link}
        aria-label="input"
        className={`elementButton ${!isMedia && "iconButton"}`}
        endIcon={isMedia && <CheckIcon />}
      >
        {isMedia && <span>Выбрать</span>}
        {!isMedia && <CheckIcon />}
      </Button>
    </article>
  );
};

export default ItemCard;
