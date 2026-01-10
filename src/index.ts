import { fromTypes, openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { ServerApp } from "~/index";
import { errorSuite } from "~/middleware/err/errorSuite.plugin";
import { loggerPlugin } from "~/middleware/logger";
import frontendApp from "./frontend";

const app = new Elysia()
  .use(
    openapi({
      documentation: {
        info: {
          title: "Gin Shopping API",
          version: "1.0.71",
          description: "基于 Elysia + Drizzle + TypeScript 的电商后端 API",
        },
        tags: [],
      },
      references: fromTypes(
        process.env.NODE_ENV === "production"
          ? "dist/index.d.ts"
          : "src/server.ts",
        {
          // 关键：指定项目根目录，以便编译器能找到 tsconfig.json 和其他文件
          // 这里使用 import.meta.dir (Bun) 或 process.cwd()
          projectRoot: process.cwd(),
          // 如果你的 tsconfig 在根目录
          tsconfigPath: "tsconfig.json",
          debug: process.env.NODE_ENV !== "production",
        }
      ),
    })
  )
  .use(loggerPlugin)
  .use(errorSuite)
  .use(frontendApp)
  .use(ServerApp)
  .listen(4510);
