import {
  boolean,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const roles = pgEnum("roles", [
  "ADMIN",
  "REGULAR",
]);

const user = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("contact_phone", { length: 255 }).notNull().unique(),
  phoneVerified: boolean("phone_verified").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  confirmationCode: varchar("confirmation_code", { length: 255 }),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  role: roles().notNull().default("REGULAR"),
});

// export const userRelations = relations(user, ({ many }) => ({
//   addresses: many(address),
//   orders: many(order),
// }));

export default user;
