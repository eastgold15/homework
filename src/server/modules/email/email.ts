import { Elysia, t } from "elysia";
import { EmailConfigContract } from "#/db/model/email-config";
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
        data: config,
      };
    },
    {
      detail: {
        summary: "获取邮箱配置",
      },
    }
  )
  .post("/config", async ({ body }) => emailService.saveConfig(body), {
    body: EmailConfigContract.Create,
  })
  .post("/test", async ({ body }) => emailService.testConnection(body), {
    body: t.Object({
      email: t.String(),
      password: t.String(),
      imapServer: t.Optional(t.String()),
      imapPort: t.Optional(t.Number()),
    }),
  });

export default emailRoutes;
