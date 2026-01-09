import { eq } from "drizzle-orm";
import imaps from "imap-simple";
import { db } from "#/db";
import { emailConfigTable } from "#/db/table.schema";

export const emailService = {
  getConfig: async () => {
    const result = await db
      .select()
      .from(emailConfigTable)
      .orderBy(emailConfigTable.id)
      .limit(1);
    return result[0];
  },

  saveConfig: async (config: {
    email: string;
    password: string;
    imapServer?: string;
    imapPort?: number;
    namingRule?: string;
  }) => {
    const existing = await db
      .select()
      .from(emailConfigTable)
      .orderBy(emailConfigTable.id)
      .limit(1);

    if (existing && existing.length > 0 && existing[0]) {
      await db
        .update(emailConfigTable)
        .set({
          email: config.email,
          password: config.password,
          imapServer: config.imapServer ?? "imap.qq.com",
          imapPort: config.imapPort ?? 993,
          namingRule: config.namingRule ?? "",
        })
        .where(eq(emailConfigTable.id, existing[0].id));
    } else {
      await db.insert(emailConfigTable).values({
        email: config.email,
        password: config.password,
        imapServer: config.imapServer ?? "imap.qq.com",
        imapPort: config.imapPort ?? 993,
        namingRule: config.namingRule ?? "",
      });
    }
    return { success: true };
  },

  testConnection: async (config: {
    email: string;
    password: string;
    imapServer?: string;
    imapPort?: number;
  }) => {
    try {
      const connection = await imaps.connect({
        imap: {
          user: config.email,
          password: config.password,
          host: config.imapServer || "imap.qq.com",
          port: config.imapPort || 993,
          tls: true,
          authTimeout: 3000,
        },
      });

      await connection.end();
      return { success: true, message: "连接成功" };
    } catch (error) {
      console.error("邮箱连接错误:", error);
      return { success: false, message: "连接失败，请检查邮箱和授权码" };
    }
  },
};
