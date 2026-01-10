import { t } from "elysia";
import { type InferDTO, spread } from "../helper/utils";
import { studentsTable } from "../table.schema";

export const StudentInsertFields = spread(studentsTable, "insert");
export const StudentFields = spread(studentsTable, "select");
export const StudentContract = {
  Response: t.Object({
    ...StudentFields,
  }),
  Entity: t.Object({
    ...StudentFields,
  }),

  Create: t.Object({
    ...t.Omit(t.Object(StudentInsertFields), ["id", "createdAt"]).properties,
  }),

  Update: t.Partial(
    t.Object({
      ...t.Omit(t.Object(StudentInsertFields), [
        "id",
        "createdAt",
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

  ListResponse: t.Object({
    data: t.Array(t.Object({ ...StudentFields })),
    total: t.Number(),
  }),
  Student: t.Object({
    id: StudentFields.id,
    name: StudentFields.name,
    studentId: StudentFields.studentId,
    className: StudentFields.className,
    submitted: t.Boolean(),
    emailMatch: t.Optional(t.String()),
    submissionTime: t.Optional(t.String()),
  }),
} as const;

export type StudentContract = InferDTO<typeof StudentContract>;
