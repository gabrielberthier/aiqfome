import { relations } from "drizzle-orm";
import { integer, pgTable, serial } from "drizzle-orm/pg-core";

import client from "./client";
import product from "./product";

const favourite = pgTable("favourites", {
    id: serial("id").primaryKey(),

    productId: integer("product_id").references(() => product.id, {
        onDelete: "cascade",
    }),

    clientId: integer("client_id").references(() => client.id, {
        onDelete: "cascade",
    }),
});

export const favouriteRelations = relations(favourite, ({ one }) => ({
    product: one(product, {
        fields: [favourite.productId],
        references: [product.id],
    }),
    client: one(client),
}));

export default favourite;
