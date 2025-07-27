import type { $ZodIssueBase } from "zod/v4/core";
import { z, prettifyError } from "zod";
import { ru } from "zod/locales";

z.config(ru());

export { z };

export type TypeErrorTextZod = {
  error: { issues: $ZodIssueBase[] };
  dict?: Record<string, string>;
};

/**
 * Функция для преобразование ошибок zod в текст который поймет пользователь
 */
const errorTextZod = ({ error, dict }: TypeErrorTextZod): string => {
  const message = prettifyError(error)
    .replaceAll("✖ ", "")
    .replaceAll("\n  → at", " поле →");

  if (!dict) {
    return message;
  }

  const messageDict = message
    .split("\n")
    .map((item) =>
      item
        .split(" ")
        .map((value) => (value in dict ? dict[value] : value))
        .join(" ")
    )
    .join("\n");

  return messageDict;
};

export { errorTextZod };
