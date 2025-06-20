import {
    decimal,
    pgTable,
    serial,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

const product = pgTable("products", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    image: varchar("title", { length: 255 }),
    unitPrice: decimal({ precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export default product;
