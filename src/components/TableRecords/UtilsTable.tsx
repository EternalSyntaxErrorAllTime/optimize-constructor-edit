import type {
  TypeRowDeleteElement,
  TypeOutputMessageAddElement,
  TypeRowData,
  TypeEditMessageElement,
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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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
    flex: 0.2,
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
    flex: 0.25,
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
  data: TypeRecordsCardCatalog["records"]
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
      <TableCell align="center">{uniqueNumber}</TableCell>
      <TableCell align="center">{nameDetail}</TableCell>
      <TableCell align="center">{nameUser}</TableCell>
    </TableRow>
  );
};

export const CreateTableDeleteElement: TypeLayout = ({ children }) => {
  return (
    <>
    <TableContainer className={sd.containerDialog}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Номер</TableCell>
            <TableCell align="center">Название</TableCell>
            <TableCell align="center">Создатель</TableCell>
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

export const CreateEditRowElement: TypeEditRowElement = ({ data }) => {
  return (
    <TableRow>
      <TableCell align="center">{`${data.itemSequence}${
        data.suffix || ""
      }`}</TableCell>
      <TableCell align="center">{data.nameDetail}</TableCell>
    </TableRow>
  );
};

export const CreateEditMessageElement: TypeEditMessageElement = ({
  oldData,
  newData,
}) => {
  return (
    <>
      <TableContainer className={sd.containerDialog}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Старые</TableCell>
              <TableCell align="center" style={{width: "0px"}} width={"0px"}></TableCell>
              <TableCell align="center">Новые</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Table size="small" aria-label="nested-old">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">
                        <Typography variant="subtitle2">Номер</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2">Название</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{oldData}</TableBody>
                </Table>
              </TableCell>
              <TableCell width={"0px"}>
                <ArrowForwardIcon/>
              </TableCell>
              <TableCell>
                <Table size="small" aria-label="nested-new">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">
                        <Typography variant="subtitle2">Номер</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2">Название</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{newData}</TableBody>
                </Table>
              </TableCell>
            </TableRow>
          </TableBody>
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
