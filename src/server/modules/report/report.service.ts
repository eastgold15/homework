import ExcelJS from "exceljs";
import { eq } from "drizzle-orm";
import { db } from "#/db";
import { studentsTable, homeworkTable } from "#/db/table.schema";

export const reportService = {
  exportReport: async (): Promise<{
    success: boolean;
    data?: string;
    message: string;
  }> => {
    try {
      const students = await db.select().from(studentsTable);

      const homeworkData = await db
        .select({
          homework: homeworkTable,
          student: studentsTable,
        })
        .from(homeworkTable)
        .leftJoin(studentsTable, eq(homeworkTable.studentId, studentsTable.id));

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("作业提交情况");

      worksheet.columns = [
        { header: "姓名", key: "name", width: 15 },
        { header: "学号", key: "studentId", width: 15 },
        { header: "班级", key: "className", width: 15 },
        { header: "提交状态", key: "status", width: 15 },
        { header: "文件名", key: "fileName", width: 30 },
        { header: "提交时间", key: "submitTime", width: 20 },
      ];

      for (const student of students) {
        const studentHomework = homeworkData.find(
          (h) => h.homework.studentId === student.id
        );

        worksheet.addRow({
          name: student.name,
          studentId: student.studentId || "-",
          className: student.className || "-",
          status: studentHomework ? "已提交" : "未提交",
          fileName: studentHomework?.homework.originalName || "-",
          submitTime: studentHomework?.homework.emailDate
            ? new Date(studentHomework.homework.emailDate).toLocaleString(
                "zh-CN"
              )
            : "-",
        });

        if (!studentHomework) {
          const lastRow = worksheet.lastRow;
          if (lastRow) {
            lastRow.eachCell((cell) => {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF0000" },
              };
            });
          }
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      return {
        success: true,
        data: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`,
        message: "报告导出成功",
      };
    } catch (error) {
      console.error("报告导出错误:", error);
      return { success: false, message: "报告导出失败" };
    }
  },
};
