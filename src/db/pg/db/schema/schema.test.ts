import { describe, expect, it, afterAll, beforeAll, beforeEach, afterEach, } from "vitest";

import { PostgreSqlContainer } from "@testcontainers/postgresql";
import type { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { DbType } from "../";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../schema";
import { getTableName, sql, Table } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";

import { default as config } from "src/../drizzle.config";


const createDb = (databaseUrl: string) => {
    return drizzle({
        client: new Pool({
            connectionString: databaseUrl,
        }),
        casing: "snake_case",
        schema,

    });
}

async function resetTable(db: DbType, table: Table) {
    return db.execute(
        sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`)
    );
}

describe("Schema tests", () => {
    let postgresContainer: StartedPostgreSqlContainer;
    let db: DbType;

    beforeAll(async () => {
        postgresContainer = await new PostgreSqlContainer('postgres:17').start();
        const connectionString = postgresContainer.getConnectionUri();
        console.log(connectionString);

        db = createDb(connectionString);
        await migrate(db, { migrationsFolder: config.out! });

        await db.execute(sql`SELECT 1`);
    });

    // beforeEach(async () => {
    //     await migrate(db, { migrationsFolder: config.out! });
    // })

    // afterEach(async () => {
    //     for (const table of [
    //         schema.user,
    //         schema.client,
    //         schema.product,
    //         schema.favourite
    //     ]) {
    //         await resetTable(db, table);
    //     }
    // });

    afterAll(async () => {
        await db.$client.end();
        await postgresContainer.stop();
    });

    it("should create and return multiple clients", async () => {
        const res = await db.insert(schema.client).values({
            email: 'gabo@magaluv.com',
            name: 'Gabo Berfier'
        }).returning()
        // const res = await db.query.client.findFirst()

        expect(res[0].name).toEqual("Gabo Berfier");
    });
}, { timeout: 60000 });