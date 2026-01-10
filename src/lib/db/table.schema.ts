import * as s from "drizzle-orm/sqlite-core";
import { uniqueIndex } from "drizzle-orm/sqlite-core";

export const emailConfigTable = s.sqliteTable(
  "email_config",
  {
    id: s.integer("id").primaryKey({ autoIncrement: true }),
    email: s.text("email").notNull().unique(),
    password: s.text("password").notNull(),
    imapServer: s.text("imap_server").notNull().default("imap.qq.com"),
    imapPort: s.integer("imap_port").notNull().default(993),
    namingRule: s
      .text("naming_rule")
      .notNull()
      .default("{姓名}_{学号}_{作业名}"),
    createdAt: s
      .integer("created_at", { mode: "timestamp" })
      .default(new Date()),
  },
  (table) => [uniqueIndex("email_config_email_unique").on(table.email)]
);

export const homeworkTable = s.sqliteTable("homework", {
  id: s.integer("id").primaryKey({ autoIncrement: true }),
  studentId: s.integer("student_id").references(() => studentsTable.id),
  fileName: s.text("file_name").notNull(),
  originalName: s.text("original_name"),
  filePath: s.text("file_path"),
  emailSubject: s.text("email_subject"),
  emailFrom: s.text("email_from"),
  emailDate: s.integer("email_date", { mode: "timestamp" }),
  submitStatus: s.text("submit_status").default("submitted"),
  createdAt: s.integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const studentsTable = s.sqliteTable("students", {
  id: s.integer("id").primaryKey({ autoIncrement: true }),
  name: s.text("name").notNull(),
  studentId: s.text("student_id"),
  className: s.text("class_name"),
  createdAt: s.integer("created_at", { mode: "timestamp" }).default(new Date()),
});
