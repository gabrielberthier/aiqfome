import { integer, pgTable, serial } from "drizzle-orm/pg-core";

import client from "./client";
import product from "./product";

const favourite = pgTable("favourites", {
    id: serial("id").primaryKey(),

    productId: integer().references(() => product.id, {
        onDelete: "cascade",
    }),

    clientId: integer().references(() => client.id, {
        onDelete: "cascade",
    }),
});


export default favourite;
