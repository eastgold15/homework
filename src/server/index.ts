import { existsSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Elysia, t } from "elysia";
import emailRoutes from "~/modules/email/email";
import homeworkRoutes from "~/modules/homework/homework";
import reportRoutes from "~/modules/report/report";
import studentRoutes from "~/modules/student/student";

const downloadsDir = join(process.cwd(), "downloads", "作业");
if (!existsSync(downloadsDir)) {
  mkdirSync(downloadsDir, { recursive: true });
}

export const ServerApp = new Elysia({ prefix: "/api" })
  .use(emailRoutes)
  .use(studentRoutes)
  .use(homeworkRoutes)
  .use(reportRoutes)
  .post(
    "/upload",
    async ({ body: { file }, set }) => {
      try {
        const uploadDir = join(process.cwd(), "public", "uploads");
        if (!existsSync(uploadDir)) {
          mkdirSync(uploadDir, { recursive: true });
        }

        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name}`;
        const filePath = join(uploadDir, fileName);

        const buffer = await file.arrayBuffer();
        await writeFile(filePath, new Uint8Array(buffer));

        return {
          success: true,
          message: "文件上传成功",
          filePath: `/uploads/${fileName}`,
        };
      } catch (error) {
        console.error("上传错误:", error);
        set.status = 500;
        return {
          success: false,
          message: "文件上传失败",
        };
      }
    },
    {
      body: t.Object({
        file: t.File(),
      }),
    }
  )
  .get("/message", () => `${Math.random() * 100}`);

export type ServerApp = typeof ServerApp;
