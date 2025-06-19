import type { Table } from "drizzle-orm";

import { getTableName, sql } from "drizzle-orm";

import type { DbType } from "@/db/pg/db";

import { db } from "@/db/pg/db";
import * as schema from "@/db/pg/db/schema";
import env from "@/env";

import userSeed from "./seeds/user";

if (!env.DB_SEEDING) {
  throw new Error("You must set DB_SEEDING to \"true\" when running seeds");
}

async function resetTable(db: DbType, table: Table) {
  return db.execute(
    sql<string>`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`,
  );
}

for (const table of [
  schema.user,
]) {
  // await db.delete(table); // clear tables without truncating / resetting ids
  await resetTable(db, table);
}

await userSeed(db);

await db.$client.end();
