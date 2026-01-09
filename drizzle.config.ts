import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/table.schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "homework.db",
  },
});
