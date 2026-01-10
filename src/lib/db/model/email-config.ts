import { t } from "elysia";
import { type InferDTO, spread } from "../helper/utils";
import { emailConfigTable } from "../table.schema";

export const EmailConfigInsertFields = spread(emailConfigTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const EmailConfigFields = spread(emailConfigTable, "select");
export const EmailConfigContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
    ...EmailConfigFields,
  }),

  Create: t.Object({
    ...t.Omit(t.Object(EmailConfigInsertFields), ["id", "createdAt"])
      .properties,
  }),
  Update: t.Partial(
    t.Object({
      ...t.Omit(t.Object(EmailConfigInsertFields), ["id", "createdAt"])
        .properties,
    })
  ),

  ListQuery: t.Object({
    ...t.Partial(t.Object(EmailConfigInsertFields)).properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...EmailConfigFields })),
    total: t.Number(),
  }),
} as const;

export type EmailConfigContract = InferDTO<typeof EmailConfigContract>;
