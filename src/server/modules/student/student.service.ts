import ExcelJS from "exceljs";
import { eq, notInArray } from "drizzle-orm";
import { db } from "#/db";
import { studentsTable, homeworkTable } from "#/db/table.schema";

export const studentService = {
  getStudents: async () => {
    return await db.select().from(studentsTable).orderBy(studentsTable.name);
  },

  importFromExcel: async (
    file: File
  ): Promise<{ success: boolean; message: string; count?: number }> => {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        return { success: false, message: "Excel文件为空" };
      }

      await db.delete(studentsTable);

      const studentsToInsert: any[] = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        const name = row.getCell(1).value?.toString().trim();
        const studentId = row.getCell(2).value?.toString().trim();
        const className = row.getCell(3).value?.toString().trim();

        if (name) {
          studentsToInsert.push({
            name,
            studentId: studentId || null,
            className: className || null,
          });
        }
      });

      if (studentsToInsert.length > 0) {
        await db.insert(studentsTable).values(studentsToInsert);
      }

      return {
        success: true,
        message: `成功导入${studentsToInsert.length}名学生`,
        count: studentsToInsert.length,
      };
    } catch (error) {
      console.error("Excel导入错误:", error);
      return { success: false, message: "Excel文件格式错误" };
    }
  },

  getNotSubmitted: async () => {
    const submittedStudentIds = await db
      .selectDistinct({ studentId: homeworkTable.studentId })
      .from(homeworkTable)
      .where(eq(homeworkTable.submitStatus, "submitted"));

    const submittedIds = submittedStudentIds
      .map((h) => h.studentId)
      .filter((id): id is number => id !== null);

    if (submittedIds.length === 0) {
      return await db.select().from(studentsTable);
    }

    return await db
      .select()
      .from(studentsTable)
      .where(notInArray(studentsTable.id, submittedIds));
  },
};
