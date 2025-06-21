import { relations } from "drizzle-orm";
import {
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

import favourite from "./favourite";
import user from "./user";

const client = pgTable("clients", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    userId: text("user_id")
        .references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const clientRelations = relations(client, ({ many }) => ({
    favourites: many(favourite),
}));

export default client;
