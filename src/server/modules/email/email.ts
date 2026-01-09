import { Elysia, t } from "elysia";
import { emailService } from "./email.service";

const emailRoutes = new Elysia({ prefix: "/email" })
  .get("/config", async () => {
    const config = await emailService.getConfig();
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
  })
  .post("/config", async ({ body }) => emailService.saveConfig(body), {
    body: t.Object({
      email: t.String(),
      password: t.String(),
      imapServer: t.Optional(t.String()),
      imapPort: t.Optional(t.Number()),
      namingRule: t.Optional(t.String()),
    }),
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
