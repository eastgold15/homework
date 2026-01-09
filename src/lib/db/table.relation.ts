import { defineRelations } from "drizzle-orm";
import * as schema from "./table.schema";

export const relations = defineRelations(schema, (r) => ({
  homeworkTable: {
    studentId: r.one.studentsTable({
      from: r.homeworkTable.id,
      to: r.studentsTable.id,
    }),
  },
}));
