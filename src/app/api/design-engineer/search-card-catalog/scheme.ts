import type { TypeErrorTextZod } from "ru-zod";
import { z, errorTextZod } from "ru-zod";

const textError = {
  it_notNumber: "Уникальный номер это строка состоящая из чисел",
  notValue: "Нужно передать хотя бы один из параметров",
};

const dictParams = {
  main_search: "Основной поиск",
  prefix_factory: "Префикс",
  item_type: "Уникальный номер",
  noInput: "Значение"
};

export const SchemeSearchCardCatalog = z
  .object({
    main_search: z.string().optional(),
    prefix_factory: z.coerce.number().int().min(1).optional(),
    item_type: z
      .string()
      .regex(/^\d*$/, {
        error: textError.it_notNumber,
      })
      .optional(),
  })
  .check((ctx) => {
    if (
      (ctx.issues.length === 0 && Object.keys(ctx.value).length === 0) ||
      Object.values(ctx.value).every((v) => v === undefined)
    ) {
      ctx.issues.push({
        path: ["noInput"],
        code: "custom",
        message: textError.notValue,
        input: [],
      });
    }
  });

export const errorMessageSearchCardCatalog = (
  error: TypeErrorTextZod["error"]
): string => {
  return errorTextZod({ error: error, dict: dictParams });
};

export type TypeSchemeSearchCardCatalog = z.infer<
  typeof SchemeSearchCardCatalog
>;
