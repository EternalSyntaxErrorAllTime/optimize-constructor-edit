import type { TypeErrorTextZod } from "ru-zod";
import { z, errorTextZod } from "ru-zod";

const textError = {
  card: "Ошибка страницы попробуйте перезагрузить  страницу",
  auth: "Проблема с авторизацией (попробуйте выйти-зайти в учетную запись)",
  name: "Обязательные данные",
};

const dictParams = {
  CardCatalog_ID: "Карточка товара",
  suffix: "Суффикс",
  name: "Название детали",
  createBy_user_ID: "Пользователь",
  comment: "Примечание",
};

export const SchemeAddRecordCatalog = z.object({
  CardCatalog_ID: z
    .number({
      error: textError.card,
    })
    .int({ error: textError.card })
    .min(1, {
      error: textError.card,
    }),
  suffix: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().nullable().optional().default(null)
  ),
  name: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string({ error: textError.name }).min(1)
  ),
  createBy_user_ID: z
    .number({ error: textError.auth })
    .int({ error: textError.auth })
    .min(1, { error: textError.auth }),
  comment: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().nullable().optional().default(null)
  ),
});

export const errorMessageAddRecordCatalog = (
  error: TypeErrorTextZod["error"]
): string => {
  return errorTextZod({ error: error, dict: dictParams });
};

export type TypeSchemeAddRecordCatalog = z.infer<typeof SchemeAddRecordCatalog>;
