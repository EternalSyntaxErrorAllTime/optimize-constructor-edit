"use client";

import type {
  TypeRowData,
  TypeTableRecords,
  TypeStateDataDialog,
} from "./TableRecords.types";
import type {
  GridRowSelectionModel,
  GridRowId,
  GridCellParams,
} from "@mui/x-data-grid";

import {
  requestDataCardCatalog,
  requestDeleteRecordsCatalog,
  requestAddRecordCatalog,
  requestEditRecordCatalog,
} from "./apiRequest";
import { columns, createDataRow, initPagination } from "./UtilsTable";
import {
  CreateTableDeleteElement,
  CreateRowDeleteElement,
  CreateOutputMessageAddElement,
  CreateEditRowElement,
  CreateEditMessageElement,
} from "./UtilsTable";

import { newAlert } from "@redux/features/notificationAlert";
import { suffixData } from "constValue";

import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useEffect } from "react";
import { useMediaQuery } from "@mui/material";

import {
  CircularProgress,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

import "./TableRecords.scss";
import sd from "./dialog.module.scss";

import type { TypeRecordsCardCatalog } from "@database/design-engineer";

const TableRecords: TypeTableRecords = ({ id }) => {
  const { data: session } = useSession();

  const dispatch = useDispatch();

  const {
    data = [],
    isLoading,
    isError,
    error,
    isFetching,
    isSuccess,
    refetch,
  } = useQuery({
    queryFn: () => requestDataCardCatalog(id),
    queryKey: ["records-card-catalog", id],
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 0,
    gcTime: 0,
  });

  const [row, setRow] = useState<TypeRowData[]>([]);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>();
  const [paginationModel, setPaginationModel] = useState(initPagination);

  const isMedia = useMediaQuery("(min-width: 650px)");

  const [addState, setAddState] = useState({
    isError: false,
    name: "",
    suffix: "",
    comment: "",
  });

  const [openDialogAdd, setOpenDialogAdd] = useState(false);

  const [dataDialog, setDataDialog] = useState<TypeStateDataDialog>({
    isOpen: false,
    title: "",
    message: <></>,
    confirmation: () => {},
    confirmationText: "",
    confirmationIcon: <></>,
    confirmationColor: undefined,
  });

  const rebuildingTable = useCallback(() => {
    setRow(createDataRow(data));
    setPaginationModel((prev) => {
      return {
        page: Math.max(0, Math.ceil(data.length / prev.pageSize) - 1),
        pageSize: prev.pageSize,
      };
    });
    setSelectionModel({ type: "include", ids: new Set<GridRowId>() });
  }, [data]);

  const handleProcessRowUpdate = (newRow: TypeRowData): TypeRowData => {
    setRow((prev) => prev.map((row) => (row.id === newRow.id ? newRow : row)));
    return newRow;
  };

  const colorCellForEdit = (params: GridCellParams<TypeRowData>) => {
    // Текущие данные из бд
    const currentRows = data.find((record) => record.ID === params.row.id);

    if (!currentRows) return "";

    if (
      params.field === "suffix" &&
      params.row.suffix?.trim() !== (currentRows.suffix ?? "")
    ) {
      return "cellEditValue";
    }
    if (
      params.field === "nameDetail" &&
      params.row.nameDetail.trim() !== currentRows.nameDetail
    ) {
      if (params.row.nameDetail.trim().length === 0) return "cellErrorValue";

      return "cellEditValue";
    }
    if (
      params.field === "comment" &&
      currentRows.comment.trim() !== params.row.comment.trim()
    ) {
      return "cellEditValue";
    }

    return "";
  };

  const onAdd = () => {
    setAddState({ isError: false, name: "", suffix: "", comment: "" });
    setOpenDialogAdd(true);
  };

  const confirmationAdd = () => {
    setAddState((prev) => {
      return { ...prev, isError: false };
    });
    if (addState.name.length === 0) {
      setAddState((prev) => {
        return { ...prev, isError: true };
      });
      return;
    }

    const data = {
      CardCatalog_ID: id,
      suffix: addState.suffix || null,
      name: addState.name,
      createBy_user_ID: Number(session?.user.id),
      comment: addState.comment || null,
    };

    const request = async () => {
      const { status, message, output } = await requestAddRecordCatalog(data);
      dispatch(
        newAlert({ message: message, severity: status ? "success" : "error" })
      );
      if (status && output !== undefined) {
        setOpenDialogAdd(false);

        const copyText = (value: string) => {
          navigator.clipboard.writeText(value);
          dispatch(
            newAlert({
              message: `Успешно скопировано ${value}`,
              severity: "success",
            })
          );
        };

        setDataDialog({
          isOpen: true,
          title: "Успешно зарегистрированные данные!",
          message: (
            <CreateOutputMessageAddElement {...output} onAction={copyText} />
          ),
          confirmation: closeDialog,
          confirmationText: "Ок",
          confirmationIcon: <CheckIcon />,
          confirmationColor: "primary",
        });
        await refetch();
      }
    };
    request();
  };

  const onEdit = () => {
    if (data.length !== row.length) {
      dispatch(
        newAlert({
          message: "Проблема с данными попробуйте перезапустить страницу!",
          severity: "error",
        })
      );
      return;
    }

    let errorData = false;
    const original: Array<TypeRecordsCardCatalog> = [];
    const editRow: Array<TypeRowData> = [];

    for (let i = 0; i < data.length; i++) {
      if (row[i].nameDetail.trim().length === 0) {
        errorData = true;
        break;
      }

      if (
        data[i].nameDetail !== row[i].nameDetail.trim() ||
        data[i].suffix !== (row[i].suffix || null) ||
        data[i].comment !== row[i].comment.trim()
      ) {
        editRow.push(row[i]);
        original.push(data[i]);
      }
    }

    if (errorData) {
      dispatch(
        newAlert({
          message: "Данные не могут быть изменены!",
          severity: "warning",
        })
      );
      dispatch(
        newAlert({
          message: "В таблицы не может `Название детали` быть пустым!",
          severity: "error",
        })
      );
      return;
    }

    if (editRow.length === 0) {
      dispatch(newAlert({ message: "Не чего изменять!", severity: "warning" }));
      return;
    }

    setDataDialog({
      isOpen: true,
      title: "Вы уверены изменить данные?",
      message: (
        <CreateEditMessageElement>
          {original.map((el, i) => (
            <CreateEditRowElement
              oldData={el}
              newData={editRow[i]}
              key={`EditRowElement-${el.ID}`}
            />
          ))}
        </CreateEditMessageElement>
      ),
      confirmation: () => confirmationEdit(editRow),
      confirmationText: "Изменить",
      confirmationIcon: <EditIcon />,
      confirmationColor: "success",
    });
  };

  const confirmationEdit = (editRow: Array<TypeRowData>) => {
    const request = async () => {
      const { status, message } = await requestEditRecordCatalog(editRow);
      dispatch(
        newAlert({ message: message, severity: status ? "success" : "error" })
      );
      closeDialog();
      await refetch();
    };
    request();
  };

  const onDelete = () => {
    if (!selectionModel?.ids || selectionModel?.ids.size === 0) return;

    const message = (
      <CreateTableDeleteElement>
        {data
          .filter((item) => Array.from(selectionModel.ids).includes(item.ID))
          .map(({ ID, nameDetail, itemSequence, suffix, nameUser }) => (
            <CreateRowDeleteElement
              key={`row-item-${ID}`}
              nameDetail={nameDetail}
              uniqueNumber={`${itemSequence}${suffix || ""}`}
              nameUser={nameUser}
            />
          ))}
      </CreateTableDeleteElement>
    );

    setDataDialog({
      isOpen: true,
      title: "Вы уверены удалить данные?",
      message,
      confirmation: confirmationDelete,
      confirmationText: "Удалить",
      confirmationIcon: <DeleteIcon />,
      confirmationColor: "error",
    });
  };

  const confirmationDelete = () => {
    if (!selectionModel?.ids || selectionModel?.ids.size === 0) return;

    const id = Array.from(selectionModel.ids, (id) => Number(id));

    const request = async () => {
      const { status, message } = await requestDeleteRecordsCatalog(id);

      dispatch(
        newAlert({ message: message, severity: status ? "success" : "error" })
      );
      closeDialog();
      await refetch();
    };
    request();
  };

  const closeDialog = () =>
    setDataDialog((prev) => {
      return { ...prev, isOpen: false };
    });

  useEffect(() => {
    // При изменении данных перестраивает таблицу
    if (isLoading || isFetching) return;
    if (isSuccess) rebuildingTable();
  }, [data, isLoading, isFetching, isSuccess, rebuildingTable]);

  if (isLoading) {
    return (
      <div className="TableRecords">
        <div className="isOtherStatus">
          <CircularProgress size="6rem" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="TableRecords">
        <div className="isOtherStatus">
          <Typography variant="h3" component="h1" color="error">
            Произошла ошибка в получении информации.
          </Typography>
          <Typography variant="h4" component="h1" color="error">
            {error?.message}
          </Typography>
          <Button
            endIcon={<RefreshIcon />}
            color="error"
            size="large"
            onClick={() => refetch()}
          >
            Перезапуск
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="TableRecords">
      <div className="containerTable">
        <DataGrid
          showToolbar
          checkboxSelection
          disableRowSelectionOnClick
          columns={columns}
          rows={row}
          processRowUpdate={handleProcessRowUpdate}
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={setSelectionModel}
          pageSizeOptions={[5, 10, 20, 30]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          className="table"
          loading={isFetching}
          getCellClassName={colorCellForEdit}
        />
      </div>

      <div className="containerButton">
        <Button
          onClick={onAdd}
          endIcon={isMedia && <AddIcon />}
          loading={isFetching}
        >
          Добавить
        </Button>
        <div className="spacer"></div>
        <Button
          onClick={async () => await refetch()}
          endIcon={isMedia && <RefreshIcon />}
          loading={isFetching}
          title="Возвращает данные в исходное состояние."
        >
          Обновить
        </Button>
        {row.length > 0 && (
          <>
            <Button
              onClick={onEdit}
              endIcon={isMedia && <EditIcon />}
              loading={isFetching}
            >
              Изменить
            </Button>
            <Button
              onClick={onDelete}
              endIcon={isMedia && <DeleteIcon />}
              loading={isFetching}
              disabled={!selectionModel?.ids.size}
              color="error"
            >
              Удалить
            </Button>
          </>
        )}
      </div>

      <Dialog open={dataDialog.isOpen} disableEscapeKeyDown={true}>
        <DialogTitle>{dataDialog.title}</DialogTitle>
        <DialogContent>{dataDialog.message}</DialogContent>
        <DialogActions style={{ gap: "10px" }}>
          <Button onClick={closeDialog} endIcon={<CloseIcon />} autoFocus>
            Отмена
          </Button>
          <Button
            onClick={dataDialog.confirmation}
            endIcon={dataDialog.confirmationIcon}
            color={dataDialog.confirmationColor}
          >
            {dataDialog.confirmationText}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialogAdd} disableEscapeKeyDown={true}>
        <DialogTitle>
          Введите данные для регистрации нового изделия!
        </DialogTitle>
        <DialogContent>
          <div className={`${sd.addNewDetail}`}>
            <TextField
              label="Название детали"
              value={addState.name}
              onChange={(e) =>
                setAddState((prev) => ({ ...prev, name: e.target.value }))
              }
              error={addState.isError}
              helperText={addState.isError && "Обязательное поле"}
            />

            <FormControl fullWidth className={sd.suffix}>
              <InputLabel id="suffix">Суффикс</InputLabel>
              <Select
                labelId="suffix"
                id="suffix"
                label="Суффикс"
                value={addState.suffix}
                onChange={(e) =>
                  setAddState((prev) => ({ ...prev, suffix: e.target.value }))
                }
              >
                {suffixData.map((item) => (
                  <MenuItem key={`MenuItem-${item.value}`} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Примечание"
              multiline
              maxRows={4}
              className={sd.comment}
              value={addState.comment}
              onChange={(e) =>
                setAddState((prev) => ({ ...prev, comment: e.target.value }))
              }
            />
          </div>
        </DialogContent>
        <DialogActions style={{ gap: "10px" }}>
          <Button
            onClick={() => setOpenDialogAdd(false)}
            endIcon={<CloseIcon />}
            autoFocus
          >
            Отмена
          </Button>
          <Button
            onClick={confirmationAdd}
            endIcon={<CheckIcon />}
            color="success"
          >
            Зарегистрировать
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TableRecords;
