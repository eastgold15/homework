import { Elysia } from "elysia";
import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sqlite";

export const db = drizzle("homework.db");

export const dbPlugin = new Elysia({
  name: "db",
}).decorate("db", db);
