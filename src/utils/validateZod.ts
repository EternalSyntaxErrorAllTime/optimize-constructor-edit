import type { ZodType, ZodError } from "zod";
import type { Dispatch } from "@reduxjs/toolkit";
import type { TypeErrorTextZod } from "ru-zod";

import { newAlert } from "@redux/features/notificationAlert";

type TypeErrorAction = {
  path: Array<string>;
  errorZod: ZodError;
};

type TypeValidateZod<T> = {
  schema: ZodType<T>;
  data: T;
  dispatch: Dispatch;
  errorMessage: (error: TypeErrorTextZod["error"]) => string;
  errorAction?: ({ path, errorZod }: TypeErrorAction) => void;
};

/**
 * Функция для валидации данных через zod и отображение alert уведомление для статуса ошибки
 */
export const validateZod = <T>({
  schema,
  data,
  dispatch,
  errorMessage,
  errorAction,
}: TypeValidateZod<T>): T | null => {
  const result = schema.safeParse(data);

  if (!result.success) {
    dispatch(
      newAlert({
        message: errorMessage(result.error),
        severity: "warning",
      })
    );
    const allPaths = result.error.issues.map((issue) => issue.path.join("."));
    errorAction?.({ path: allPaths, errorZod: result.error });
    return null;
  }

  return result.data;
};
