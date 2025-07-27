import type { TypeErrorTextZod } from "ru-zod";
import { z, errorTextZod } from "ru-zod";

const textError = {
  auth: "Проблема с авторизацией (попробуйте выйти-зайти в учетную запись)",
  idsRecordsNoData: "Нет выбранных данных",
};

const dictParams = {
  user_ID: "Пользователь",
  idsRecords: "Выбранные данные",
};

export const SchemeDeleteRecordsCatalog = z.object({
  user_ID: z
    .number({ error: textError.auth })
    .int({ error: textError.auth })
    .min(1, { error: textError.auth }),
  idsRecords: z
    .array(z.number().int().positive().gt(0))
    .nonempty({ error: textError.idsRecordsNoData }),
});

export const errorMessageDeleteRecordsCatalog = (
  error: TypeErrorTextZod["error"]
): string => {
  return errorTextZod({ error: error, dict: dictParams });
};

export type TypeSchemeDeleteRecordsCatalog = z.infer<
  typeof SchemeDeleteRecordsCatalog
>;
