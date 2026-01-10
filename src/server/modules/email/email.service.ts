import imaps from "imap-simple";
import { db } from "#/db";
import type { EmailConfigContract } from "#/db/model/email-config";
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

  saveConfig: async (config: typeof EmailConfigContract.Create.static) => {
    await db
      .insert(emailConfigTable)
      .values(config)
      // 关键：冲突时执行替换/更新（根据你的唯一约束选择）
      .onConflictDoUpdate({
        // 冲突键：如果 email 是唯一键，用 eq(emailConfigTable.email, config.email)
        // 如果 id 是主键但新增时没有 id，建议用 email 作为唯一约束
        target: emailConfigTable.email, // 假设 email 字段有唯一索引
        set: config,
      });

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
