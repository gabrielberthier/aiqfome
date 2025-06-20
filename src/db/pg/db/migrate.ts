import { migrate } from "drizzle-orm/node-postgres/migrator";

import config from "src/../drizzle.config";

import { db } from "./index";

await migrate(db, { migrationsFolder: config.out! });
