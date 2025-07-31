import type { TypeErrorTextZod } from "ru-zod";
import { z, errorTextZod } from "ru-zod";

const textError = {
  card: "Ошибка страницы попробуйте перезагрузить  страницу",
};

const dictParams = {
  id: "Картотека",
};

export const SchemeRecordsCardCatalog = z.coerce
  .number({ error: textError.card })
  .int({ error: textError.card })
  .min(1, { error: textError.card });

export const errorMessageRecordsCardCatalog = (
  error: TypeErrorTextZod["error"]
): string => {
  return errorTextZod({ error: error, dict: dictParams });
};

export type TypeSchemeRecordsCardCatalog = z.infer<
  typeof SchemeRecordsCardCatalog
>;
