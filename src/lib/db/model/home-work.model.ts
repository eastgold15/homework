import { t } from "elysia";
import { type InferDTO, spread } from "../helper/utils";
import { homeworkTable } from "../table.schema";

export const HomeworkInsertFields = spread(homeworkTable, "insert");

export const HomeworkFields = spread(homeworkTable, "select");
export const HomeworkContract = {
  Response: t.Object({
    ...HomeworkFields,
  }),

  Create: t.Object({
    ...t.Omit(t.Object(HomeworkInsertFields), ["id"]).properties,
    startDate: t.String(),
    endDate: t.String(),
  }),

  Update: t.Partial(
    t.Object({
      ...t.Omit(t.Object(HomeworkInsertFields), [
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
    ...t.Partial(t.Object(HomeworkInsertFields)).properties,
    search: t.Optional(t.String()),
  }),

  ListResponse: t.Object({
    data: t.Array(t.Object({ ...HomeworkFields })),
    total: t.Number(),
  }),
  HomeworkItem: t.Object({
    id: HomeworkFields.id,
    studentId: HomeworkFields.studentId,
    fileName: HomeworkFields.fileName,
    originalName: HomeworkFields.originalName,
    emailFrom: HomeworkFields.emailFrom,
    emailDate: HomeworkFields.emailDate,
    hasAttachment: t.Boolean(),
    subject: t.Optional(t.String()),
    sender: t.Optional(t.String()),
    timestamp: t.Optional(t.String()),
  }),
} as const;

export type HomeworkContract = InferDTO<typeof HomeworkContract>;
