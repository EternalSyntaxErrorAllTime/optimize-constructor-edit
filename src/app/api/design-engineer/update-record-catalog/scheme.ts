import type { TypeErrorTextZod } from "ru-zod";
import { z, errorTextZod } from "ru-zod";

const textError = {
  auth: "Проблема с авторизацией (попробуйте выйти-зайти в учетную запись)",
  name: "Обязательные данные",
  record: "Проблема с выбранной записью (попробуйте перезапустить страницу)",
  nullData: "Данные не изменены, сохранить нечего",
};

const dictParams = {
  user_ID: "Пользователь",
  id: "Выбранная запись",
  suffix: "Суффикс",
  nameDetail: "Название детали",
  comment: "Примечание",
};

const SchemeElementUpdateRecordCatalog = z.object({
  id: z
    .number({ error: textError.record })
    .int({ error: textError.record })
    .min(1, { error: textError.record }),
  suffix: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().nullable().optional().default(null)
  ),
  nameDetail: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string({ error: textError.name }).min(1, { error: textError.name })
  ),
  comment: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().nullable().optional().default(null)
  ),
});

export const SchemeUpdateRecordCatalog = z.object({
  user_ID: z
    .number({ error: textError.auth })
    .int({ error: textError.auth })
    .min(1, { error: textError.auth }),
  updates: z
    .array(SchemeElementUpdateRecordCatalog, { error: textError.nullData })
    .nonempty({ error: textError.nullData }),
});

export const errorMessageUpdateRecordCatalog = (
  error: TypeErrorTextZod["error"]
): string => {
  return errorTextZod({ error: error, dict: dictParams });
};

export type TypeSchemeUpdateRecordCatalog = z.infer<
  typeof SchemeUpdateRecordCatalog
>;
