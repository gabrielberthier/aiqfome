import * as argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";

import type { DbType } from "@/db/pg/db/index";

import * as schema from "./../schema";
import users from "./data/users.json";

export default async function seed(_: DbType) {
  // await Promise.all(
  //     users.map(async (user) => {
  //       await db
  //         .insert(schema.user)
  //         .values({
  //           email: "james@oliver.com",
  //           name: "jim",
  //           emailVerified: true,
  //           phoneVerified: true,
  //           password: await argon2.hash(user.password),
  //           createdAt: Date.now(),
  //           updatedAt: Date.now(),
  //           id: uuidv4(),
  //         })
  //         .returning();
  //     }),
  //   );
}
