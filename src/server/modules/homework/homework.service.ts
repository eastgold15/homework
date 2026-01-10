import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import imaps from "imap-simple";
import { db } from "#/db";
import { homeworkTable, studentsTable } from "#/db/table.schema";
import { emailService } from "../email/email.service";

interface NamingRuleResult {
  studentId?: number;
  studentName?: string;
  homeworkName?: string;
  match: boolean;
}

export const homeworkService = {
  parseNamingRule: async (
    fileName: string,
    rule: string,
    emailSubject?: string
  ): Promise<NamingRuleResult> => {
    const students = await db.select().from(studentsTable);
    const result: NamingRuleResult = { match: false };

    const parts = rule.split(/[{}]/);
    const expectedPattern = parts
      .map((part) => {
        if (part === "姓名") return "(.+?)";
        if (part === "学号") return "(.+?)";
        if (part === "作业名") return "(.+?)";
        return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      })
      .join("");

    const regex = new RegExp(expectedPattern);
    const match = fileName.match(regex);

    if (match) {
      const values = match.slice(1);
      const placeholders = parts.filter((p, i) => i % 2 === 0);

      placeholders.forEach((placeholder, index) => {
        const value = values[index]?.trim();
        if (!value) return;

        if (placeholder === "姓名" || placeholder === "学号") {
          const student = students.find(
            (s) => s.name === value || s.studentId === value
          );
          if (student) {
            result.studentId = student.id;
            result.studentName = student.name;
            result.match = true;
          }
        } else if (placeholder === "作业名") {
          result.homeworkName = value;
        }
      });
    }

    if (!result.studentId && emailSubject) {
      const emailParts = emailSubject.match(/[\u4e00-\u9fa5]+|[a-zA-Z]+/g);
      if (emailParts) {
        for (const student of students) {
          if (
            emailParts.includes(student.name) ||
            emailParts.includes(student.studentId || "")
          ) {
            result.studentId = student.id;
            result.studentName = student.name;
            result.match = true;
            break;
          }
        }
      }
    }

    return result;
  },

  downloadAttachments: async (
    onProgress?: (current: number, total: number) => void
  ): Promise<{ success: boolean; message: string; downloaded?: number }> => {
    const config = await emailService.getConfig();
    if (!config) {
      return { success: false, message: "请先配置邮箱" };
    }

    const safeConfig = config!;

    try {
      const connection: any = await imaps.connect({
        imap: {
          user: safeConfig.email,
          password: safeConfig.password,
          host: safeConfig.imapServer || "imap.qq.com",
          port: safeConfig.imapPort || 993,
          tls: true,
        },
      });

      await connection.openBox("INBOX");

      const searchCriteria = ["UNSEEN"];
      const messages = await connection.search(searchCriteria, {
        bodies: "",
        struct: true,
      });

      const downloadDir = join(process.cwd(), "downloads", "作业");
      if (!existsSync(downloadDir)) {
        mkdirSync(downloadDir, { recursive: true });
      }

      let downloadedCount = 0;

      for (const [index, message] of messages.entries()) {
        const parts = imaps.getParts(message.attributes.struct);
        const attachments = parts.filter(
          (part) =>
            part.disposition &&
            part.disposition.type === "attachment" &&
            part.disposition.params &&
            part.disposition.params.filename
        );

        for (const attachment of attachments) {
          const fileName = attachment.disposition?.params?.filename || "";
          const fileData = (await connection.getPartData(
            message,
            attachment
          )) as Buffer;

          const emailBody = message.parts?.[0]
            ? message.parts[0].body?.toString()
            : "";
          const namingRule = safeConfig.namingRule
            ? safeConfig.namingRule
            : "{姓名}_{学号}_{作业名}";
          const parseResult = await this.parseNamingRule(
            fileName,
            namingRule,
            emailBody
          );

          const timestamp = Date.now();
          const savedFileName = `${timestamp}-${fileName}`;
          const filePath = join(downloadDir, savedFileName);
          writeFileSync(filePath, fileData);

          const emailFrom =
            message.attributes.envelope?.from?.[0]?.address ?? "";
          const emailDate = message.attributes.date
            ? new Date(message.attributes.date)
            : new Date();

          await db.insert(homeworkTable).values({
            studentId: parseResult.studentId ?? null,
            fileName,
            originalName: fileName,
            filePath,
            emailSubject: emailBody,
            emailFrom,
            emailDate,
            submitStatus: parseResult.match ? "submitted" : "not_found",
          });

          downloadedCount++;
        }

        if (onProgress) {
          onProgress(index + 1, messages.length);
        }
      }

      await connection.end();

      return {
        success: true,
        message: `成功下载${downloadedCount}个作业文件`,
        downloaded: downloadedCount,
      };
    } catch (error) {
      console.error("下载错误:", error);
      return { success: false, message: "下载失败" };
    }
  },

  getHomeworkList: async () =>
    await db
      .select({
        homework: homeworkTable,
        student: studentsTable,
      })
      .from(homeworkTable)
      .leftJoin(studentsTable, eq(homeworkTable.studentId, studentsTable.id))
      .orderBy(homeworkTable.createdAt),

  deleteHomework: async (id: number) => {
    const homework = await db
      .select()
      .from(homeworkTable)
      .where(eq(homeworkTable.id, id))
      .limit(1);

    if (homework && homework.length > 0) {
      const hw = homework[0]!;
      if (hw.filePath && existsSync(hw.filePath)) {
        unlinkSync(hw.filePath);
      }
    }
    await db.delete(homeworkTable).where(eq(homeworkTable.id, id));
    return { success: true };
  },

  renameHomework: async (id: number, newFileName: string) => {
    const homework = await db
      .select()
      .from(homeworkTable)
      .where(eq(homeworkTable.id, id))
      .limit(1);

    if (homework && homework.length > 0) {
      const hw = homework[0]!;
      if (hw.filePath && existsSync(hw.filePath)) {
        const newFilePath = join(
          process.cwd(),
          "downloads",
          "作业",
          newFileName
        );
        writeFileSync(newFilePath, readFileSync(hw.filePath));
        await db
          .update(homeworkTable)
          .set({ fileName: newFileName })
          .where(eq(homeworkTable.id, id));
        unlinkSync(hw.filePath);
      }
    }
    return { success: true };
  },
};
