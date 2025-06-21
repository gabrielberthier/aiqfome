import { decimal, integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

import product from "./product";

const productRating = pgTable("product_rating", {
    id: serial("id").primaryKey(),
    productId: integer("product_id").references(() => product.id, {
        onDelete: "cascade",
    }),
    rating: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
    count: integer("count"),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export default productRating;
