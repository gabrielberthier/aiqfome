import { boolean, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  role: varchar("role", { length: 255 }).notNull().default("user"),
});

export default user;
