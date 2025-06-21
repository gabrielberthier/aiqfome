import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import env from "@/env";

import * as schema from "./schema";

const client = createClient({
  url: env.DATABASE_URL,
  authToken: "",
});

const db = drizzle(client, {
  schema,
});

export type DbType = typeof db;

export default db;
