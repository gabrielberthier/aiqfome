import { relations } from "drizzle-orm";
import {
    decimal,
    pgTable,
    serial,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

import productRating from "./product-rating";

const product = pgTable("products", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    image: varchar("image", { length: 255 }),
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const productRelations = relations(product, ({ one }) => ({
    rating: one(productRating, {
        fields: [product.id],
        references: [productRating.productId],
    }),
}));

export default product;
