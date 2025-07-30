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
  let message = prettifyError(error)
    .replaceAll("✖ ", "")
    .replaceAll("\n  → at", " поле →");

  if (!dict) {
    return message;
  }

  for (const [key, label] of Object.entries(dict)) {
    const re = new RegExp(`\\b${key}\\b`, "g");
    message = message.replace(re, label);
  }

  return message;
};

export { errorTextZod };
