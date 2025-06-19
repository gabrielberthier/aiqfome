import { migrate } from "drizzle-orm/node-postgres/migrator";

import { default as config } from "src/../drizzle.config";

import { db } from "./index";

await migrate(db, { migrationsFolder: config.out! });
