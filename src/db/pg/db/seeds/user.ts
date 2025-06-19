import * as argon2 from "argon2";

import type { DbType } from "@/db/pg/db/index";

import * as schema from "./../schema";
import users from "./data/users.json";

export default async function seed(db: DbType) {
  await Promise.all(
    users.map(async (user) => {
      await db
        .insert(schema.user)
        .values({
          ...user,
          emailVerified: true,
          phoneVerified: true,
          password: await argon2.hash(user.password),
        })
        .returning();
    }),
  );
}
