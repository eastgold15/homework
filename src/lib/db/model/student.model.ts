import { t } from "elysia";
import { type InferDTO, spread } from "../helper/utils";
import { studentsTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const StudentInsertFields = spread(studentsTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const StudentFields = spread(studentsTable, "select");
export const StudentContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
    ...StudentFields,
  }),

  Create: t.Object({
    ...t.Omit(t.Object(StudentInsertFields), [
      "id",
      "createdAt",
      "updatedAt",
      "startDate",
      "endDate",
      "tenantId",
      "siteId",
      "deptId",
      "createdBy",
    ]).properties,
    startDate: t.String(),
    endDate: t.String(),
  }),
  Update: t.Partial(
    t.Object({
      ...t.Omit(t.Object(StudentInsertFields), [
        "id",
        "createdAt",
        "updatedAt",
        "startDate",
        "endDate",
        "siteId", // 不允许修改站点
        "tenantId", // 不允许修改租户
        "deptId", // 不允许修改部门
        "createdBy", // 不允许修改创建者
      ]).properties,
      startDate: t.String(),
      endDate: t.String(),
    })
  ),

  ListQuery: t.Object({
    ...t.Partial(t.Object(StudentInsertFields)).properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...StudentFields })),
    total: t.Number(),
  }),
} as const;

export type StudentContract = InferDTO<typeof StudentContract>;
