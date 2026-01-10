import { Elysia, t } from "elysia";
import { emailService } from "./email.service";

const emailRoutes = new Elysia({ prefix: "/email" })
  .get(
    "/config",
    async () => {
      const config = await emailService.getConfig();
      console.log("config:", config);
      if (!config) {
        return { success: false, message: "未配置邮箱" };
      }
      return {
        success: true,
        data: {
          id: config.id,
          email: config.email,
          imapServer: config.imapServer,
          imapPort: config.imapPort,
          namingRule: config.namingRule,
        },
      };
    },
    {
      detail: {
        summary: "获取邮箱配置",
      },
    }
  )
  .post(
    "/config",
    async ({ body }) => {
      console.log("保存配置:", body);
      return emailService.saveConfig(body as any);
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
        imapServer: t.Optional(t.String()),
        imapPort: t.Optional(t.Number()),
        namingRule: t.Optional(t.String()),
      }),
    }
  )
  .post("/test", async ({ body }) => emailService.testConnection(body), {
    body: t.Object({
      email: t.String(),
      password: t.String(),
      imapServer: t.Optional(t.String()),
      imapPort: t.Optional(t.Number()),
    }),
  });

export default emailRoutes;
