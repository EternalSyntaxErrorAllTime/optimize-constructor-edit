import type {
  TypeRowDeleteElement,
  TypeOutputMessageAddElement,
  TypeRowData,
  TypeEditRowElement,
} from "./TableRecords.types";
import type { TypeRecordsCardCatalog } from "@database/design-engineer";
import type { GridColDef } from "@mui/x-data-grid";
import type { TypeLayout } from "declare.types";

import { suffixData } from "constValue";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EastIcon from "@mui/icons-material/East";
import CommentIcon from "@mui/icons-material/Comment";

import sd from "./dialog.module.scss";

export const columns: GridColDef[] = [
  // {
  //   field: "id",
  //   headerName: "ID",
  //   type: "number",
  //   flex: 0.5,
  //   editable: false,
  // },
  {
    field: "itemSequence",
    headerName: "Номер",
    type: "string",
    flex: 0.3,
    editable: false,
  },
  {
    field: "suffix",
    headerName: "Суффикс",
    flex: 0.3,
    type: "singleSelect",
    valueOptions: suffixData,
    editable: true,
  },
  {
    field: "nameDetail",
    headerName: "Название детали",
    flex: 1,
    editable: true,
  },
  {
    field: "nameUser",
    headerName: "Имя пользователя",
    flex: 0.5,
    editable: false,
  },
  {
    field: "dateCreate",
    headerName: "Дата",
    flex: 0.4,
    type: "date",
    editable: false,
  },
  {
    field: "comment",
    headerName: "Примечание",
    flex: 1.1,
    editable: true,
  },
];

export const createDataRow = (
  data: Array<TypeRecordsCardCatalog>
): Array<TypeRowData> => {
  return data.map((item) => ({
    id: item.ID,
    itemSequence: item.itemSequence,
    suffix: item.suffix ?? "",
    nameDetail: item.nameDetail,
    nameUser: item.nameUser,
    dateCreate: new Date(item.dateCreate),
    comment: item.comment,
  }));
};

export const initPagination = {
  page: 0,
  pageSize: 5,
};

export const CreateRowDeleteElement: TypeRowDeleteElement = ({
  nameDetail,
  uniqueNumber,
  nameUser,
}) => {
  return (
    <TableRow>
      <TableCell align="center">{nameDetail}</TableCell>
      <TableCell align="center">{uniqueNumber}</TableCell>
      <TableCell align="center">{nameUser}</TableCell>
    </TableRow>
  );
};

export const CreateTableDeleteElement: TypeLayout = ({ children }) => {
  return (
    <TableContainer className={sd.containerDialog}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Название</TableCell>
            <TableCell align="center">Номер</TableCell>
            <TableCell align="center">Создатель</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
};

export const CreateOutputMessageAddElement: TypeOutputMessageAddElement = ({
  prefixFactory,
  itemType,
  itemSequence,
  suffix,
  name,
  onAction,
}) => {
  const numberDetail = `${prefixFactory}.${itemType}.${itemSequence}${
    suffix || ""
  }`;

  return (
    <div className={`${sd.containerDialog} ${sd.addOutput}`}>
      <div className={sd.containerNumberCard}>
        <Typography variant="h6" component="p" className={sd.textSupport}>
          Номер:
        </Typography>
        <Typography variant="body1" component="h1" className={sd.numberCard}>
          {numberDetail}
        </Typography>
      </div>
      <Button
        onClick={() => onAction(numberDetail)}
        aria-label="copy-number-detail"
        className={sd.copyNumberCard}
        variant="outlined"
      >
        <ContentCopyIcon />
      </Button>

      <div className={sd.containerCardName}>
        <Typography variant="h6" component="p" className={sd.textSupport}>
          Название:
        </Typography>
        <Typography variant="body1" component="h1" className={sd.cardName}>
          {name}
        </Typography>
      </div>

      <Button
        onClick={() => onAction(name)}
        aria-label="copy-name-detail"
        className={sd.copyCardName}
        variant="outlined"
      >
        <ContentCopyIcon />
      </Button>
    </div>
  );
};

export const CreateEditRowElement: TypeEditRowElement = ({
  oldData,
  newData,
}) => {
  return (
    <TableRow>
      <TableCell align="center">{`${oldData.itemSequence}${
        oldData.suffix || ""
      } ${oldData.nameDetail}`}</TableCell>
      <TableCell align="center">
        <EastIcon />
      </TableCell>
      <TableCell align="center">
        <div className={sd.textCell}>
          {`${newData.itemSequence}${newData.suffix} ${newData.nameDetail}`}
          {oldData.comment !== newData.comment.trim() && <CommentIcon />}
        </div>
      </TableCell>
    </TableRow>
  );
};

export const CreateEditMessageElement: TypeLayout = ({ children }) => {
  return (
    <>
      <TableContainer className={sd.containerDialog}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Старые</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">Новые</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{children}</TableBody>
        </Table>
      </TableContainer>
      <Typography
        variant="body1"
        component="p"
        color="info"
        className={sd.textEdit}
      >
        Комментарии не указаны.
      </Typography>
    </>
  );
};
