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

import { validateZod } from "@utils/validateZod";
import { suffixData } from "constValue";

import { requestRecordsCardCatalog } from "@api/design-engineer/records-card-catalog";

import {
  SchemeAddRecordCatalog,
  errorMessageAddRecordCatalog,
  requestAddRecordCatalog,
} from "@api/design-engineer/add-record-catalog";

import {
  SchemeDeleteRecordsCatalog,
  errorMessageDeleteRecordsCatalog,
  requestDeleteRecordsCatalog,
} from "@api/design-engineer/delete-records-catalog";

import {
  SchemeUpdateRecordCatalog,
  errorMessageUpdateRecordCatalog,
  requestUpdateRecordCatalog,
} from "@api/design-engineer/update-record-catalog";

import { columns, createDataRow, initPagination } from "./UtilsTable";
import {
  CreateTableDeleteElement,
  CreateRowDeleteElement,
  CreateOutputMessageAddElement,
  CreateEditRowElement,
  CreateEditMessageElement,
} from "./UtilsTable";

import { newAlert } from "@redux/features/notificationAlert";

import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useEffect, useMemo } from "react";
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

const TableRecords: TypeTableRecords = ({ id }) => {
  const { data: session } = useSession();

  const dispatch = useDispatch();
  const {
    data = {
      data: { lastRecords: 999, records: [] },
      message: "",
      status: 102,
    },
    isLoading,
    isError,
    error,
    isFetching,
    isSuccess,
    refetch,
  } = useQuery({
    queryFn: () => requestRecordsCardCatalog(id),
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
    setRow(createDataRow(data.data.records));
    // Временное решение что бы отображалась последняя страница
    setTimeout(() => {
      setPaginationModel((prev) => {
        return {
          page: Math.max(
            0,
            Math.ceil(data.data.records.length / prev.pageSize)
          ),
          pageSize: prev.pageSize,
        };
      });
    }, 2);
    setSelectionModel({ type: "include", ids: new Set<GridRowId>() });
  }, [data]);

  const handleProcessRowUpdate = (newRow: TypeRowData): TypeRowData => {
    setRow((prev) => prev.map((row) => (row.id === newRow.id ? newRow : row)));
    return newRow;
  };

  const colorCellForEdit = (params: GridCellParams<TypeRowData>) => {
    // Текущие данные из бд
    const currentRows = data.data.records.find(
      (record) => record.ID === params.row.id
    );

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

  const infoAdd = useMemo(() => {
    const used = new Set<number>(
      data.data.records.map((r) => parseInt(r.itemSequence, 10))
    );

    for (let seq = data.data.lastRecords + 1; seq <= 999; seq++) {
      if (!used.has(seq)) {
        return false;
      }
    }
    return true;
  }, [data]);

  const onAdd = () => {
    setAddState({ isError: false, name: "", suffix: "", comment: "" });
    setOpenDialogAdd(true);
  };

  const confirmationAdd = () => {
    setAddState((prev) => {
      return { ...prev, isError: false };
    });

    const parse = validateZod({
      schema: SchemeAddRecordCatalog,
      data: {
        CardCatalog_ID: id,
        createBy_user_ID: Number(session?.user.id),
        ...addState,
      },
      errorMessage: errorMessageAddRecordCatalog,
      dispatch: dispatch,
      errorAction: ({ path }) => {
        if (path?.includes("name")) {
          setAddState((prev) => {
            return { ...prev, isError: true };
          });
        }
      },
    });

    if (!parse) return;

    const request = async () => {
      const { status, message, data } = await requestAddRecordCatalog(parse);
      dispatch(
        newAlert({
          message: message,
          severity:
            status === 400 ? "warning" : status === 200 ? "success" : "error",
        })
      );
      if (status === 200 && data !== null) {
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
            <CreateOutputMessageAddElement {...data} onAction={copyText} />
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
    if (data.data.records.length !== row.length) {
      dispatch(
        newAlert({
          message: "Проблема с данными попробуйте перезапустить страницу!",
          severity: "error",
        })
      );
      return;
    }

    const original = [];
    const editRow: Array<TypeRowData> = [];

    for (let i = 0; i < data.data.records.length; i++) {
      if (row[i].nameDetail.trim().length === 0) {
        dispatch(
          newAlert({
            message:
              "Данные не могут быть изменены!\nВ таблицы не может `Название детали` быть пустым",
            severity: "error",
          })
        );
        return;
      }

      if (
        data.data.records[i].nameDetail !== row[i].nameDetail.trim() ||
        data.data.records[i].suffix !== (row[i].suffix || null) ||
        data.data.records[i].comment !== row[i].comment.trim()
      ) {
        editRow.push(row[i]);
        original.push(data.data.records[i]);
      }
    }

    if (editRow.length === 0) {
      dispatch(
        newAlert({ message: "В таблицы не чего изменять", severity: "warning" })
      );
      return;
    }

    setDataDialog({
      isOpen: true,
      title: "Вы уверены изменить данные?",
      message: (
        <CreateEditMessageElement
          oldData={original.map((el) => (
            <CreateEditRowElement data={el} key={`EditRowElement-${el.ID}`} />
          ))}
          newData={editRow.map((el) => (
            <CreateEditRowElement data={el} key={`EditRowElement-${el.id}`} />
          ))}
        />
      ),
      confirmation: () => confirmationEdit(editRow),
      confirmationText: "Изменить",
      confirmationIcon: <EditIcon />,
      confirmationColor: "success",
    });
  };

  const confirmationEdit = (editRow: Array<TypeRowData>) => {
    const parse = validateZod({
      schema: SchemeUpdateRecordCatalog,
      data: { user_ID: Number(session?.user.id), updates: editRow },
      errorMessage: errorMessageUpdateRecordCatalog,
      dispatch: dispatch,
      errorAction: () => closeDialog(),
    });

    if (!parse) return;

    const request = async () => {
      const { status, message } = await requestUpdateRecordCatalog(parse);

      dispatch(
        newAlert({
          message: message,
          severity:
            status === 400 ? "warning" : status === 200 ? "success" : "error",
        })
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
        {data.data.records
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

    const parse = validateZod({
      schema: SchemeDeleteRecordsCatalog,
      data: { user_ID: Number(session?.user.id), idsRecords: id },
      errorMessage: errorMessageDeleteRecordsCatalog,
      dispatch: dispatch,
      errorAction: () => closeDialog(),
    });

    if (!parse) return;

    const request = async () => {
      const { status, message } = await requestDeleteRecordsCatalog(parse);
      dispatch(
        newAlert({
          message: message,
          severity:
            status === 400 ? "warning" : status === 200 ? "success" : "error",
        })
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

  if (isError || data.status >= 400) {
    return (
      <div className="TableRecords">
        <div className="isOtherStatus">
          <Typography variant="h3" component="h1" color="error">
            Произошла ошибка в получении информации.
          </Typography>
          <Typography variant="h4" component="h1" color="error">
            {data.status >= 400 ? data.message : error?.message}
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
        <span title={infoAdd ? "Нет свободных мест" : "Добавить новую запись"}>
          <Button
            onClick={onAdd}
            endIcon={isMedia && <AddIcon />}
            loading={isFetching}
            disabled={infoAdd}
            className="addButton"
          >
            Добавить
          </Button>
        </span>
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

      <Dialog
        open={dataDialog.isOpen}
        disableEscapeKeyDown={true}
        fullWidth
        maxWidth="md"
      >
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
