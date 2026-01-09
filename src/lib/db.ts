import { drizzle } from "drizzle-orm/bun-sqlite";
import { Elysia } from "elysia";

export const db = drizzle("homework.db");

export const dbPlugin = new Elysia({
  name: "db",
}).decorate("db", db);
