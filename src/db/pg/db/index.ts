import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import env from "@/env";

import * as schema from "./schema";

// Use pg driver.
const { Pool } = pg;

// Instantiate Drizzle client with pg driver and schema.
export const db = drizzle({
  client: new Pool({
    connectionString: env.DATABASE_URL,
    max: env.DB_SEEDING ? 1 : undefined,
  }),
  casing: "snake_case",
  schema,
});

export type DbType = typeof db;
